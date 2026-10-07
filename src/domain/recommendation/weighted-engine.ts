import { CampusItem } from '../campus-item/types';
import { StudentPreferences } from '../preferences';
import {
  IRecommendationEngine,
  RecommendationResult,
  UrgencyLevel,
} from './index';
import {
  RECOMMENDATION_WEIGHTS,
  CATEGORY_LABELS,
  CampusCategory,
  ImportanceLevel,
} from '@/src/shared/constants';

export interface RecommendationEngineWeights {
  interestMatch: number;
  timeRelevance: number;
  urgency: number;
  importance: number;
  discovery: number;
}

export interface WeightedRecommendationEngineOptions {
  referenceDate?: Date | string;
  weights?: Partial<RecommendationEngineWeights>;
}

// Importance multiplier values (0 - 100)
export const IMPORTANCE_SCORES: Record<ImportanceLevel, number> = {
  critical: 100,
  high: 70,
  normal: 40,
} as const;

// Default weights aligned with domain constants
export const DEFAULT_WEIGHTS: RecommendationEngineWeights = {
  interestMatch: RECOMMENDATION_WEIGHTS.INTEREST_MATCH, // 0.40
  timeRelevance: RECOMMENDATION_WEIGHTS.TIME_RELEVANCE, // 0.25
  urgency: RECOMMENDATION_WEIGHTS.URGENCY, // 0.15
  importance: RECOMMENDATION_WEIGHTS.POPULARITY, // 0.10 (maps to importance/priority)
  discovery: RECOMMENDATION_WEIGHTS.DISCOVERY, // 0.10
};

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/**
 * WeightedRecommendationEngine
 * Pure, deterministic recommendation scoring and ranking based on domain signals.
 * Implements IRecommendationEngine following SOLID principles (DIP, SRP, OCP).
 */
export class WeightedRecommendationEngine implements IRecommendationEngine {
  private readonly weights: RecommendationEngineWeights;
  private readonly referenceDateProvider?: () => Date;

  constructor(options?: WeightedRecommendationEngineOptions) {
    this.weights = {
      ...DEFAULT_WEIGHTS,
      ...(options?.weights || {}),
    };

    if (options?.referenceDate) {
      const fixedDate =
        typeof options.referenceDate === 'string'
          ? new Date(options.referenceDate)
          : options.referenceDate;
      this.referenceDateProvider = () => new Date(fixedDate.getTime());
    }
  }

  private getReferenceDate(): Date {
    return this.referenceDateProvider ? this.referenceDateProvider() : new Date();
  }

  /**
   * Calculate recommendation score, urgency, and human-readable reasons for a single item.
   */
  public calculateScore(
    item: CampusItem,
    preferences: StudentPreferences
  ): RecommendationResult {
    const refDate = this.getReferenceDate();
    const reasons: string[] = [];

    // 1. Interest Match (0 - 100)
    const interestScore = this.computeInterestScore(item, preferences, reasons);

    // 2. Time Relevance (0 - 100)
    const timeScore = this.computeTimeRelevanceScore(item, refDate, reasons);

    // 3. Urgency / Deadline (0 - 100)
    const { score: urgencyScore, level: urgencyLevel } = this.computeUrgencyScore(
      item,
      refDate,
      reasons
    );

    // 4. Importance / Priority (0 - 100)
    const importanceScore = this.computeImportanceScore(item, reasons);

    // 5. Discovery Factor (0 - 100)
    const discoveryScore = this.computeDiscoveryScore(item, preferences);

    // Weighted aggregate score (0 - 100)
    const rawScore =
      interestScore * this.weights.interestMatch +
      timeScore * this.weights.timeRelevance +
      urgencyScore * this.weights.urgency +
      importanceScore * this.weights.importance +
      discoveryScore * this.weights.discovery;

    const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    return {
      item,
      score: finalScore,
      reasons: reasons.length > 0 ? reasons : ['Recommended for campus discovery'],
      urgency: urgencyLevel,
    };
  }

  /**
   * Rank a list of CampusItems for a student.
   * Returns a sorted array without mutating the input items.
   */
  public rank(
    items: CampusItem[],
    preferences: StudentPreferences
  ): RecommendationResult[] {
    if (!items || items.length === 0) {
      return [];
    }

    // Score all items immutably
    const scoredResults: RecommendationResult[] = items.map((item) =>
      this.calculateScore(item, preferences)
    );

    // Deterministic sort:
    // 1. Score descending
    // 2. Importance level (critical > high > normal)
    // 3. Event date ascending (sooner dates first)
    // 4. Start time ascending
    // 5. Item ID ascending (lexicographical stable tie-breaker)
    return scoredResults.slice().sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const impDiff =
        (IMPORTANCE_SCORES[b.item.importance] || 0) -
        (IMPORTANCE_SCORES[a.item.importance] || 0);
      if (impDiff !== 0) {
        return impDiff;
      }

      if (a.item.date !== b.item.date) {
        return a.item.date.localeCompare(b.item.date);
      }

      const timeA = a.item.startTime || '99:99';
      const timeB = b.item.startTime || '99:99';
      if (timeA !== timeB) {
        return timeA.localeCompare(timeB);
      }

      return a.item.id.localeCompare(b.item.id);
    });
  }

  /**
   * Evaluates interest match between item and student preferences.
   */
  private computeInterestScore(
    item: CampusItem,
    preferences: StudentPreferences,
    reasons: string[]
  ): number {
    const selected = preferences?.selectedCategories || [];

    // If student has selected categories
    if (selected.length > 0) {
      const isDirectMatch = selected.includes(item.category);

      if (isDirectMatch) {
        const categoryMeta = CATEGORY_LABELS[item.category];
        const categoryName = categoryMeta ? categoryMeta.label : item.category;
        reasons.push(`Matches your interest in ${categoryName}`);
        return 100;
      }

      // Academic important notices get partial relevance even if not directly chosen
      if (item.category === 'important_campus' || item.category === 'academic_important') {
        return 60;
      }

      return 15; // Low base for unselected categories when preferences exist
    }

    // If no preferences are set (e.g. initial onboarding skipped)
    return 50; // Neutral baseline
  }

  /**
   * Evaluates time relevance based on proximity of event date to reference date.
   */
  private computeTimeRelevanceScore(
    item: CampusItem,
    refDate: Date,
    reasons: string[]
  ): number {
    if (!item.date) return 50;

    const eventDate = new Date(`${item.date}T00:00:00`);
    if (isNaN(eventDate.getTime())) return 50;

    const refDay = new Date(
      refDate.getFullYear(),
      refDate.getMonth(),
      refDate.getDate()
    );
    const eventDay = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );

    const diffDays = Math.round(
      (eventDay.getTime() - refDay.getTime()) / MS_PER_DAY
    );

    if (diffDays === 0) {
      reasons.push('Happening today');
      return 100;
    } else if (diffDays === 1) {
      reasons.push('Happening tomorrow');
      return 90;
    } else if (diffDays > 1 && diffDays <= 3) {
      reasons.push('Happening in the next 3 days');
      return 80;
    } else if (diffDays > 3 && diffDays <= 7) {
      reasons.push('Happening this week');
      return 65;
    } else if (diffDays > 7 && diffDays <= 14) {
      return 45;
    } else if (diffDays > 14) {
      return 30;
    } else {
      // Past event
      return 10;
    }
  }

  /**
   * Evaluates deadline urgency and assigns an UrgencyLevel.
   */
  private computeUrgencyScore(
    item: CampusItem,
    refDate: Date,
    reasons: string[]
  ): { score: number; level: UrgencyLevel } {
    if (item.deadline) {
      const deadlineDate = new Date(item.deadline);
      if (!isNaN(deadlineDate.getTime())) {
        const diffMs = deadlineDate.getTime() - refDate.getTime();
        const diffHours = diffMs / MS_PER_HOUR;

        if (diffHours > 0 && diffHours <= 24) {
          reasons.push('Registration closes within 24 hours');
          return { score: 100, level: 'urgent' };
        } else if (diffHours > 24 && diffHours <= 72) {
          reasons.push('Registration closes soon');
          return { score: 75, level: 'soon' };
        } else if (diffHours > 72 && diffHours <= 168) {
          return { score: 45, level: 'normal' };
        } else if (diffHours > 168) {
          return { score: 25, level: 'normal' };
        } else {
          // Deadline has passed
          return { score: 0, level: 'normal' };
        }
      }
    }

    // When deadline is missing, check event start proximity
    if (item.date) {
      const eventDateTime = item.startTime
        ? new Date(`${item.date}T${item.startTime}:00`)
        : new Date(`${item.date}T00:00:00`);

      if (!isNaN(eventDateTime.getTime())) {
        const diffHours = (eventDateTime.getTime() - refDate.getTime()) / MS_PER_HOUR;
        if (diffHours > 0 && diffHours <= 24 && item.importance !== 'normal') {
          return { score: 80, level: 'urgent' };
        }
        if (diffHours > 0 && diffHours <= 48) {
          return { score: 60, level: 'soon' };
        }
      }
    }

    return { score: 30, level: 'normal' };
  }

  /**
   * Evaluates importance/priority level.
   */
  private computeImportanceScore(item: CampusItem, reasons: string[]): number {
    const score = IMPORTANCE_SCORES[item.importance] || 40;

    if (item.importance === 'critical') {
      reasons.push('Critical institutional announcement');
    } else if (item.importance === 'high') {
      reasons.push('High priority campus activity');
    }

    return score;
  }

  /**
   * Evaluates discovery factor ensuring diverse campus exposure.
   */
  private computeDiscoveryScore(
    item: CampusItem,
    preferences: StudentPreferences
  ): number {
    // Reward open audience events for general discovery
    let discoveryScore = 60;

    if (item.audience === 'all_students') {
      discoveryScore += 20;
    }

    // Boost discovery for categories not currently in preferences to promote exploration
    const selected = preferences?.selectedCategories || [];
    if (selected.length > 0 && !selected.includes(item.category)) {
      discoveryScore += 20;
    }

    return Math.min(100, discoveryScore);
  }
}

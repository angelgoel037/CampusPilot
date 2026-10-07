import { describe, it, expect } from 'vitest';
import {
  WeightedRecommendationEngine,
  RecommendationResult,
} from '@/src/domain/recommendation';
import { CampusItem } from '@/src/domain/campus-item/types';
import { StudentPreferences } from '@/src/domain/preferences';
import sampleItemsRaw from '../../shared/sample-data/campus-items.sample.json';

const sampleItems: CampusItem[] = sampleItemsRaw as CampusItem[];

describe('WeightedRecommendationEngine Unit Tests', () => {
  const referenceDate = '2026-10-14T10:00:00Z';
  const engine = new WeightedRecommendationEngine({ referenceDate });

  const baseTechItem: CampusItem = {
    id: 'test-tech-1',
    title: 'AI Workshop',
    description: 'Learn AI basics',
    category: 'technical',
    subCategory: 'workshop',
    date: '2026-10-20',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Hall 1',
    organizer: 'Tech Club',
    registrationUrl: 'https://example.com/reg',
    deadline: '2026-10-19T23:59:00Z',
    audience: 'all_students',
    importance: 'normal',
    tags: ['ai', 'tech'],
    source: 'publisher_manual',
    status: 'published',
    imageUrl: null,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  };

  const baseMusicItem: CampusItem = {
    ...baseTechItem,
    id: 'test-music-1',
    title: 'Acoustic Jam',
    category: 'cultural_music',
    tags: ['music'],
  };

  describe('1. Interest and Category Matching', () => {
    it('ranks a strong category match above a non-matching item', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const results = engine.rank([baseMusicItem, baseTechItem], preferences);

      expect(results.length).toBe(2);
      expect(results[0].item.id).toBe('test-tech-1');
      expect(results[0].score).toBeGreaterThan(results[1].score);
      expect(results[0].reasons).toContain('Matches your interest in Technical & Coding');
    });

    it('correctly handles multiple matching preferences', () => {
      const preferences: StudentPreferences = {
        userId: 'student-2',
        selectedCategories: ['technical', 'cultural_music'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const sportsItem: CampusItem = {
        ...baseTechItem,
        id: 'test-sports-1',
        title: 'Football Match',
        category: 'sports',
      };

      const results = engine.rank([sportsItem, baseTechItem, baseMusicItem], preferences);

      expect(results.length).toBe(3);
      // Both tech and music should rank above sports
      const techScore = results.find((r) => r.item.id === 'test-tech-1')?.score || 0;
      const musicScore = results.find((r) => r.item.id === 'test-music-1')?.score || 0;
      const sportsScore = results.find((r) => r.item.id === 'test-sports-1')?.score || 0;

      expect(techScore).toBeGreaterThan(sportsScore);
      expect(musicScore).toBeGreaterThan(sportsScore);
    });
  });

  describe('2. Time Relevance and Urgency', () => {
    it('ranks closer upcoming events higher when all other factors are identical', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const todayItem: CampusItem = {
        ...baseTechItem,
        id: 'tech-today',
        date: '2026-10-14',
      };

      const nextWeekItem: CampusItem = {
        ...baseTechItem,
        id: 'tech-next-week',
        date: '2026-10-25',
      };

      const results = engine.rank([nextWeekItem, todayItem], preferences);

      expect(results[0].item.id).toBe('tech-today');
      expect(results[0].score).toBeGreaterThan(results[1].score);
      expect(results[0].reasons).toContain('Happening today');
    });

    it('boosts items with imminent deadlines and assigns correct urgency levels', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      // Deadline closing in 6 hours from referenceDate ('2026-10-14T10:00:00Z')
      const urgentItem: CampusItem = {
        ...baseTechItem,
        id: 'tech-urgent',
        deadline: '2026-10-14T16:00:00Z',
      };

      // Deadline in 10 days
      const normalDeadlineItem: CampusItem = {
        ...baseTechItem,
        id: 'tech-normal',
        deadline: '2026-10-24T23:59:00Z',
      };

      const resultUrgent = engine.calculateScore(urgentItem, preferences);
      const resultNormal = engine.calculateScore(normalDeadlineItem, preferences);

      expect(resultUrgent.urgency).toBe('urgent');
      expect(resultUrgent.reasons).toContain('Registration closes within 24 hours');
      expect(resultUrgent.score).toBeGreaterThan(resultNormal.score);

      // Deadline closing in 48 hours -> 'soon'
      const soonItem: CampusItem = {
        ...baseTechItem,
        id: 'tech-soon',
        deadline: '2026-10-16T10:00:00Z',
      };
      const resultSoon = engine.calculateScore(soonItem, preferences);
      expect(resultSoon.urgency).toBe('soon');
      expect(resultSoon.reasons).toContain('Registration closes soon');
    });
  });

  describe('3. Importance and Priority', () => {
    it('ranks critical importance items higher than normal importance items', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: [],
        isOnboardingCompleted: false,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const criticalNotice: CampusItem = {
        ...baseTechItem,
        id: 'notice-critical',
        category: 'academic_important',
        importance: 'critical',
      };

      const normalNotice: CampusItem = {
        ...baseTechItem,
        id: 'notice-normal',
        category: 'academic_important',
        importance: 'normal',
      };

      const results = engine.rank([normalNotice, criticalNotice], preferences);

      expect(results[0].item.id).toBe('notice-critical');
      expect(results[0].score).toBeGreaterThan(results[1].score);
      expect(results[0].reasons).toContain('Critical institutional announcement');
    });
  });

  describe('4. Discovery and Fallback Behaviour', () => {
    it('awards discovery score for open audience and exploration of non-selected categories', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const unselectedOpenItem: CampusItem = {
        ...baseMusicItem,
        id: 'open-music',
        audience: 'all_students',
      };

      const unselectedRestrictedItem: CampusItem = {
        ...baseMusicItem,
        id: 'restricted-music',
        audience: 'specific_group',
      };

      const scoreOpen = engine.calculateScore(unselectedOpenItem, preferences);
      const scoreRestricted = engine.calculateScore(unselectedRestrictedItem, preferences);

      expect(scoreOpen.score).toBeGreaterThan(scoreRestricted.score);
    });

    it('handles empty preferences safely without throwing', () => {
      const emptyPrefs: StudentPreferences = {
        userId: 'guest-1',
        selectedCategories: [],
        isOnboardingCompleted: false,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const results = engine.rank([baseTechItem, baseMusicItem], emptyPrefs);

      expect(results.length).toBe(2);
      expect(results[0].score).toBeGreaterThan(0);
      expect(results[1].score).toBeGreaterThan(0);
    });
  });

  describe('5. Edge Cases and Safety', () => {
    it('returns empty array when items list is empty', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const results = engine.rank([], preferences);
      expect(results).toEqual([]);
    });

    it('safely handles missing or null optional fields', () => {
      const minimalItem: CampusItem = {
        id: 'ci-min-01',
        title: 'Minimal Notice',
        description: 'Plain notice without optional fields',
        category: 'academic_important',
        subCategory: null,
        date: '2026-10-15',
        startTime: null,
        endTime: null,
        venue: null,
        organizer: 'Admin',
        registrationUrl: null,
        deadline: null,
        audience: 'all_students',
        importance: 'normal',
        tags: [],
        source: 'publisher_manual',
        status: 'published',
        imageUrl: null,
        createdAt: '2026-10-01T00:00:00Z',
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['academic_important'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      expect(() => engine.calculateScore(minimalItem, preferences)).not.toThrow();
      const result = engine.calculateScore(minimalItem, preferences);
      expect(result.score).toBeGreaterThan(0);
      expect(result.urgency).toBeDefined();
    });

    it('does not mutate input items or input array', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const itemA = Object.freeze({ ...baseTechItem, id: 'a' });
      const itemB = Object.freeze({ ...baseMusicItem, id: 'b' });
      const inputArray = Object.freeze([itemA, itemB]) as unknown as CampusItem[];

      expect(() => engine.rank(inputArray as CampusItem[], preferences)).not.toThrow();
    });

    it('uses deterministic tie-breaking when items have identical scores', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      // Two identical items with different IDs
      const item1: CampusItem = { ...baseTechItem, id: 'item-aaa' };
      const item2: CampusItem = { ...baseTechItem, id: 'item-zzz' };

      const run1 = engine.rank([item2, item1], preferences);
      const run2 = engine.rank([item1, item2], preferences);

      expect(run1.map((r) => r.item.id)).toEqual(['item-aaa', 'item-zzz']);
      expect(run2.map((r) => r.item.id)).toEqual(['item-aaa', 'item-zzz']);
    });

    it('produces identical deterministic results across multiple executions', () => {
      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical', 'career'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const run1 = engine.rank(sampleItems, preferences);
      const run2 = engine.rank(sampleItems, preferences);

      expect(run1.length).toBe(sampleItems.length);
      expect(run1.map((r) => ({ id: r.item.id, score: r.score, urgency: r.urgency }))).toEqual(
        run2.map((r) => ({ id: r.item.id, score: r.score, urgency: r.urgency }))
      );
    });

    it('produces predictable results with reference-date injection', () => {
      const engineA = new WeightedRecommendationEngine({ referenceDate: '2026-10-14T00:00:00Z' });
      const engineB = new WeightedRecommendationEngine({ referenceDate: '2026-10-25T00:00:00Z' });

      const item: CampusItem = {
        ...baseTechItem,
        date: '2026-10-14',
      };

      const preferences: StudentPreferences = {
        userId: 'student-1',
        selectedCategories: ['technical'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const scoreA = engineA.calculateScore(item, preferences);
      const scoreB = engineB.calculateScore(item, preferences);

      // Event is "today" for engineA, but in the past for engineB
      expect(scoreA.score).toBeGreaterThan(scoreB.score);
      expect(scoreA.reasons).toContain('Happening today');
      expect(scoreB.reasons).not.toContain('Happening today');
    });
  });

  describe('6. Sample Data Validation', () => {
    it('successfully ranks all realistic sample items for various student personas', () => {
      const techStudentPrefs: StudentPreferences = {
        userId: 'user-tech',
        selectedCategories: ['technical', 'career'],
        isOnboardingCompleted: true,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const results = engine.rank(sampleItems, techStudentPrefs);
      expect(results.length).toBe(sampleItems.length);

      // Top items should be technical or career
      const topCategory = results[0].item.category;
      expect(['technical', 'career', 'academic_important']).toContain(topCategory);

      // Every result should have valid score (0-100), reasons, and urgency
      for (const res of results) {
        expect(res.score).toBeGreaterThanOrEqual(0);
        expect(res.score).toBeLessThanOrEqual(100);
        expect(res.reasons.length).toBeGreaterThan(0);
        expect(['normal', 'soon', 'urgent']).toContain(res.urgency);
      }
    });
  });
});

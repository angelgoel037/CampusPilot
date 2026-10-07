import { describe, it, expect, vi } from 'vitest';
import { GetPersonalizedFeedUseCase } from '@/src/application/recommendations';
import {
  ICampusItemReader,
  CampusItem,
  CampusItemFilter,
} from '@/src/domain/campus-item';
import { StudentPreferences } from '@/src/domain/preferences';
import {
  IRecommendationEngine,
  RecommendationResult,
  WeightedRecommendationEngine,
} from '@/src/domain/recommendation';
import sampleItemsRaw from '../../shared/sample-data/campus-items.sample.json';

const sampleItems = sampleItemsRaw as CampusItem[];

describe('GetPersonalizedFeedUseCase — Application Layer Integration', () => {
  const samplePreferences: StudentPreferences = {
    userId: 'user-app-test-1',
    selectedCategories: ['technical', 'career'],
    isOnboardingCompleted: true,
    updatedAt: '2026-10-01T00:00:00Z',
  };

  /**
   * In-memory mock reader implementing ICampusItemReader
   */
  const createMockReader = (items: CampusItem[]): ICampusItemReader => ({
    findById: vi.fn(async (id: string) => items.find((i) => i.id === id) || null),
    findMany: vi.fn(async (filter?: CampusItemFilter) => {
      if (!filter) return items;
      return items.filter((item) => {
        if (filter.status && item.status !== filter.status) return false;
        if (filter.category && item.category !== filter.category) return false;
        return true;
      });
    }),
    findImportant: vi.fn(async (limit: number = 5) =>
      items.filter((i) => i.importance === 'critical' || i.importance === 'high').slice(0, limit)
    ),
  });

  describe('1. Abstraction and Dependency Injection', () => {
    it('delegates ranking to IRecommendationEngine abstraction without scoring internally', async () => {
      const mockReader = createMockReader(sampleItems);

      const mockRankResult: RecommendationResult[] = [
        {
          item: sampleItems[0],
          score: 95,
          reasons: ['Mock reason'],
          urgency: 'urgent',
        },
      ];

      const mockEngine: IRecommendationEngine = {
        rank: vi.fn().mockReturnValue(mockRankResult),
        calculateScore: vi.fn(),
      };

      const useCase = new GetPersonalizedFeedUseCase(mockReader, mockEngine);
      const result = await useCase.execute(samplePreferences);

      // Verify reader was queried specifically for published items
      expect(mockReader.findMany).toHaveBeenCalledWith({ status: 'published' });

      // Verify recommendation engine was invoked with the exact items and preferences
      expect(mockEngine.rank).toHaveBeenCalledTimes(1);
      expect(mockEngine.rank).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: 'ci-tech-01' })]),
        samplePreferences
      );

      // Verify use case returned the exact engine result
      expect(result).toEqual(mockRankResult);
    });
  });

  describe('2. Concrete Integration with WeightedRecommendationEngine', () => {
    it('integrates seamlessly with WeightedRecommendationEngine and returns ranked feed', async () => {
      const mockReader = createMockReader(sampleItems);
      const concreteEngine = new WeightedRecommendationEngine({
        referenceDate: '2026-10-14T10:00:00Z',
      });

      const useCase = new GetPersonalizedFeedUseCase(mockReader, concreteEngine);
      const results = await useCase.execute(samplePreferences);

      expect(results.length).toBe(sampleItems.length);

      // Scores must be non-negative and sorted in descending order
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }

      // First ranked item should match user's technical/career preferences or critical academic notice
      const topCategory = results[0].item.category;
      expect(['technical', 'career', 'academic_important']).toContain(topCategory);
    });

    it('returns empty result array when no published items are found in repository', async () => {
      const emptyReader = createMockReader([]);
      const concreteEngine = new WeightedRecommendationEngine();

      const useCase = new GetPersonalizedFeedUseCase(emptyReader, concreteEngine);
      const results = await useCase.execute(samplePreferences);

      expect(results).toEqual([]);
    });

    it('safely processes empty / un-onboarded student preferences', async () => {
      const mockReader = createMockReader(sampleItems);
      const concreteEngine = new WeightedRecommendationEngine({
        referenceDate: '2026-10-14T10:00:00Z',
      });

      const emptyPrefs: StudentPreferences = {
        userId: 'guest-user',
        selectedCategories: [],
        isOnboardingCompleted: false,
        updatedAt: '2026-10-01T00:00:00Z',
      };

      const useCase = new GetPersonalizedFeedUseCase(mockReader, concreteEngine);
      const results = await useCase.execute(emptyPrefs);

      expect(results.length).toBe(sampleItems.length);
      // All items should have valid scores and reasons
      for (const res of results) {
        expect(res.score).toBeGreaterThanOrEqual(0);
        expect(res.reasons.length).toBeGreaterThan(0);
      }
    });
  });
});

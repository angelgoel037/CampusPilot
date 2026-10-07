import { describe, it, expect, beforeEach } from 'vitest';
import { getContainer, resetContainer } from '@/src/infrastructure/container';
import { CampusItem } from '@/src/domain/campus-item/types';
import { StudentPreferences } from '@/src/domain/preferences';

describe('Phase 2 — End-to-End System Integration Tests', () => {
  beforeEach(() => {
    resetContainer();
  });

  describe('FLOW A: Personalized Feed Pipeline', () => {
    it('retrieves published items, personalizes via WeightedRecommendationEngine, and preserves critical updates', async () => {
      const container = getContainer();

      const preferences: StudentPreferences = {
        userId: 'student-e2e-1',
        selectedCategories: ['technical', 'career'],
        isOnboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      await container.preferencesRepository.savePreferences(preferences);
      const savedPrefs = await container.preferencesRepository.getPreferences('student-e2e-1');
      expect(savedPrefs).toBeDefined();
      expect(savedPrefs?.selectedCategories).toEqual(['technical', 'career']);

      // Execute Personalized Feed Use Case
      const feedResults = await container.getPersonalizedFeedUseCase.execute(savedPrefs!);

      expect(feedResults.length).toBeGreaterThan(0);

      // Verify descending score order
      for (let i = 0; i < feedResults.length - 1; i++) {
        expect(feedResults[i].score).toBeGreaterThanOrEqual(feedResults[i + 1].score);
      }

      // Top result matches technical or career
      const topCategory = feedResults[0].item.category;
      expect(['technical', 'career', 'academic_important']).toContain(topCategory);

      // Verify result metadata
      for (const res of feedResults) {
        expect(res.score).toBeGreaterThanOrEqual(0);
        expect(res.score).toBeLessThanOrEqual(100);
        expect(res.reasons.length).toBeGreaterThan(0);
        expect(['normal', 'soon', 'urgent']).toContain(res.urgency);
      }

      // Execute Important Updates Use Case
      const importantNotices = await container.getImportantCampusUpdatesUseCase.execute(3);
      expect(importantNotices.length).toBeGreaterThan(0);
      for (const notice of importantNotices) {
        expect(['critical', 'high']).toContain(notice.importance);
      }
    });
  });

  describe('FLOW B & D: My Plan & Conflict Detection Pipeline', () => {
    it('adds items, detects schedule conflicts, recalculates upon removal, and prevents duplicates', async () => {
      const container = getContainer();
      const userId = 'student-plan-user';

      // 1. Add first item (10:00 - 12:00)
      const itemA: CampusItem = {
        id: 'e2e-item-a',
        title: 'Morning AI Keynote',
        description: 'AI keynote presentation',
        category: 'technical',
        subCategory: 'keynote',
        date: '2026-10-20',
        startTime: '10:00',
        endTime: '12:00',
        venue: 'Auditorium',
        organizer: 'Tech Club',
        registrationUrl: null,
        deadline: null,
        audience: 'all_students',
        importance: 'high',
        tags: ['ai'],
        source: 'publisher_manual',
        status: 'published',
        imageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await container.managePlanUseCase.addItemToPlan(userId, itemA);

      // Verify plan has 1 item and 0 conflicts
      let planState = await container.managePlanUseCase.getUserPlan(userId);
      expect(planState.items.length).toBe(1);
      expect(planState.conflicts.length).toBe(0);

      // 2. Add non-conflicting evening item (17:00 - 19:00)
      const itemB: CampusItem = {
        ...itemA,
        id: 'e2e-item-b',
        title: 'Evening Cultural Night',
        category: 'cultural_music',
        startTime: '17:00',
        endTime: '19:00',
      };

      await container.managePlanUseCase.addItemToPlan(userId, itemB);

      planState = await container.managePlanUseCase.getUserPlan(userId);
      expect(planState.items.length).toBe(2);
      expect(planState.conflicts.length).toBe(0);

      // 3. Add conflicting overlapping item (11:00 - 13:00)
      const itemC: CampusItem = {
        ...itemA,
        id: 'e2e-item-c',
        title: 'Overlapping Workshop',
        category: 'career',
        startTime: '11:00',
        endTime: '13:00',
      };

      await container.managePlanUseCase.addItemToPlan(userId, itemC);

      planState = await container.managePlanUseCase.getUserPlan(userId);
      expect(planState.items.length).toBe(3);
      expect(planState.conflicts.length).toBe(1);
      expect(planState.conflicts[0].itemA.id).toBe('e2e-item-a');
      expect(planState.conflicts[0].itemB.id).toBe('e2e-item-c');
      expect(planState.conflicts[0].reason).toContain('Morning AI Keynote');
      expect(planState.conflicts[0].reason).toContain('Overlapping Workshop');

      // 4. Remove conflicting item C -> conflict clears automatically
      await container.managePlanUseCase.removeItemFromPlan(userId, 'e2e-item-c');

      planState = await container.managePlanUseCase.getUserPlan(userId);
      expect(planState.items.length).toBe(2);
      expect(planState.conflicts.length).toBe(0);

      // 5. Duplicate addition attempt should not duplicate
      await container.managePlanUseCase.addItemToPlan(userId, itemA);
      planState = await container.managePlanUseCase.getUserPlan(userId);
      expect(planState.items.length).toBe(2);
    });
  });

  describe('FLOW C: Preferences Re-Ranking Reactivity', () => {
    it('re-ranks personalized feed dynamically when student preferences are modified', async () => {
      const container = getContainer();
      const userId = 'student-pref-reactivity';

      // 1. Initial preferences: sports only
      const initialPrefs: StudentPreferences = {
        userId,
        selectedCategories: ['sports'],
        isOnboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      const feedSports = await container.getPersonalizedFeedUseCase.execute(initialPrefs);
      const topSportsItem = feedSports[0].item;
      expect(['sports', 'academic_important']).toContain(topSportsItem.category);

      // 2. Updated preferences: cultural_music only
      const updatedPrefs: StudentPreferences = {
        userId,
        selectedCategories: ['cultural_music'],
        isOnboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      const feedCultural = await container.getPersonalizedFeedUseCase.execute(updatedPrefs);
      const topCulturalItem = feedCultural[0].item;
      expect(['cultural_music', 'academic_important']).toContain(topCulturalItem.category);

      // Verify that the top items differ reflecting the preference update
      expect(feedSports[0].item.id).not.toBe(feedCultural[0].item.id);
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { ManagePlanUseCase } from '@/src/application/planning';
import {
  IPlanRepository,
  IPlanningConflictDetector,
  PlanItem,
  PlanConflict,
  PlanningConflictDetector,
} from '@/src/domain/planning';
import { CampusItem } from '@/src/domain/campus-item/types';

describe('ManagePlanUseCase — Application Layer Planning Integration', () => {
  const sampleItem1: CampusItem = {
    id: 'ci-plan-1',
    title: 'Morning Robotics Lab',
    description: 'Robotics lab practicals',
    category: 'technical',
    subCategory: 'lab',
    date: '2026-10-15',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Robotics Center',
    organizer: 'Robotics Club',
    registrationUrl: null,
    deadline: null,
    audience: 'all_students',
    importance: 'high',
    tags: ['robotics'],
    source: 'publisher_manual',
    status: 'published',
    imageUrl: null,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  };

  const sampleItem2: CampusItem = {
    ...sampleItem1,
    id: 'ci-plan-2',
    title: 'Placement Workshop',
    category: 'career',
    startTime: '11:00',
    endTime: '13:00',
  };

  const sampleItem3: CampusItem = {
    ...sampleItem1,
    id: 'ci-plan-3',
    title: 'Evening Cultural Fest',
    category: 'cultural_music',
    startTime: '17:00',
    endTime: '19:00',
  };

  const createMockPlanRepo = (initialItems: PlanItem[] = []): IPlanRepository => {
    let items = [...initialItems];
    return {
      getPlan: vi.fn(async (userId: string) => items.filter((p) => p.userId === userId)),
      addItem: vi.fn(async (userId: string, item: CampusItem) => {
        const newItem: PlanItem = {
          id: `plan-${Date.now()}-${Math.random()}`,
          userId,
          campusItemId: item.id,
          item,
          addedAt: new Date().toISOString(),
        };
        items.push(newItem);
        return newItem;
      }),
      removeItem: vi.fn(async (userId: string, campusItemId: string) => {
        items = items.filter((p) => !(p.userId === userId && p.campusItemId === campusItemId));
      }),
      hasItem: vi.fn(async (userId: string, campusItemId: string) =>
        items.some((p) => p.userId === userId && p.campusItemId === campusItemId)
      ),
    };
  };

  describe('1. Delegation to IPlanningConflictDetector abstraction', () => {
    it('delegates conflict detection to the injected IPlanningConflictDetector abstraction', async () => {
      const planItems: PlanItem[] = [
        {
          id: 'p-1',
          userId: 'student-123',
          campusItemId: sampleItem1.id,
          item: sampleItem1,
          addedAt: '2026-10-01T10:00:00Z',
        },
      ];

      const mockRepo = createMockPlanRepo(planItems);
      const mockDetector: IPlanningConflictDetector = {
        hasConflict: vi.fn(),
        findConflicts: vi.fn().mockReturnValue([]),
      };

      const useCase = new ManagePlanUseCase(mockRepo, mockDetector);
      const result = await useCase.getUserPlan('student-123');

      expect(mockRepo.getPlan).toHaveBeenCalledWith('student-123');
      expect(mockDetector.findConflicts).toHaveBeenCalledTimes(1);
      expect(mockDetector.findConflicts).toHaveBeenCalledWith([sampleItem1]);
      expect(result.items).toEqual(planItems);
      expect(result.conflicts).toEqual([]);
    });
  });

  describe('2. End-to-End Integration with PlanningConflictDetector', () => {
    it('identifies and returns conflicts when student plan has overlapping activities', async () => {
      const planItems: PlanItem[] = [
        {
          id: 'p-1',
          userId: 'student-123',
          campusItemId: sampleItem1.id,
          item: sampleItem1,
          addedAt: '2026-10-01T10:00:00Z',
        },
        {
          id: 'p-2',
          userId: 'student-123',
          campusItemId: sampleItem2.id,
          item: sampleItem2,
          addedAt: '2026-10-01T10:05:00Z',
        },
      ];

      const mockRepo = createMockPlanRepo(planItems);
      const concreteDetector = new PlanningConflictDetector();

      const useCase = new ManagePlanUseCase(mockRepo, concreteDetector);
      const result = await useCase.getUserPlan('student-123');

      expect(result.items.length).toBe(2);
      expect(result.conflicts.length).toBe(1);
      expect(result.conflicts[0].itemA.id).toBe('ci-plan-1');
      expect(result.conflicts[0].itemB.id).toBe('ci-plan-2');
      expect(result.conflicts[0].reason).toContain('Robotics Lab');
      expect(result.conflicts[0].reason).toContain('Placement Workshop');
    });

    it('returns empty conflicts list when student plan has no overlapping activities', async () => {
      const nonOverlappingPlan: PlanItem[] = [
        {
          id: 'p-1',
          userId: 'student-123',
          campusItemId: sampleItem1.id, // 10:00 - 12:00
          item: sampleItem1,
          addedAt: '2026-10-01T10:00:00Z',
        },
        {
          id: 'p-3',
          userId: 'student-123',
          campusItemId: sampleItem3.id, // 17:00 - 19:00
          item: sampleItem3,
          addedAt: '2026-10-01T10:10:00Z',
        },
      ];

      const mockRepo = createMockPlanRepo(nonOverlappingPlan);
      const concreteDetector = new PlanningConflictDetector();

      const useCase = new ManagePlanUseCase(mockRepo, concreteDetector);
      const result = await useCase.getUserPlan('student-123');

      expect(result.items.length).toBe(2);
      expect(result.conflicts).toEqual([]);
    });

    it('handles empty plan safely without errors', async () => {
      const mockRepo = createMockPlanRepo([]);
      const concreteDetector = new PlanningConflictDetector();

      const useCase = new ManagePlanUseCase(mockRepo, concreteDetector);
      const result = await useCase.getUserPlan('empty-user');

      expect(result.items).toEqual([]);
      expect(result.conflicts).toEqual([]);
    });

    it('delegates addItemToPlan and removeItemFromPlan to repository correctly', async () => {
      const mockRepo = createMockPlanRepo([]);
      const concreteDetector = new PlanningConflictDetector();

      const useCase = new ManagePlanUseCase(mockRepo, concreteDetector);

      const added = await useCase.addItemToPlan('user-1', sampleItem1);
      expect(added.campusItemId).toBe('ci-plan-1');
      expect(mockRepo.addItem).toHaveBeenCalledWith('user-1', sampleItem1);

      await useCase.removeItemFromPlan('user-1', 'ci-plan-1');
      expect(mockRepo.removeItem).toHaveBeenCalledWith('user-1', 'ci-plan-1');
    });
  });
});

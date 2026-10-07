import { describe, it, expect } from 'vitest';
import {
  PlanningConflictDetector,
  PlanConflict,
} from '@/src/domain/planning';
import { CampusItem } from '@/src/domain/campus-item/types';

describe('PlanningConflictDetector Unit Tests', () => {
  const detector = new PlanningConflictDetector();

  const baseItem: CampusItem = {
    id: 'plan-item-1',
    title: 'Morning AI Workshop',
    description: 'Hands-on AI coding session',
    category: 'technical',
    subCategory: 'workshop',
    date: '2026-10-15',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Lab 3',
    organizer: 'Tech Society',
    registrationUrl: null,
    deadline: null,
    audience: 'all_students',
    importance: 'high',
    tags: ['ai', 'coding'],
    source: 'publisher_manual',
    status: 'published',
    imageUrl: null,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  };

  describe('1. Single & Pairwise Conflict Detection', () => {
    it('detects no conflict when schedule is empty', () => {
      const conflicts = detector.findConflicts([]);
      expect(conflicts).toEqual([]);
    });

    it('detects no conflict when only one item is in the schedule', () => {
      const conflicts = detector.findConflicts([baseItem]);
      expect(conflicts).toEqual([]);
    });

    it('detects an overlap when two events overlap on the same date', () => {
      const itemA: CampusItem = {
        ...baseItem,
        id: 'item-a',
        title: 'Hackathon Prep',
        startTime: '10:00',
        endTime: '12:00',
      };

      const itemB: CampusItem = {
        ...baseItem,
        id: 'item-b',
        title: 'Placement Talk',
        startTime: '11:00',
        endTime: '13:00',
      };

      expect(detector.hasConflict(itemA, itemB)).toBe(true);
      expect(detector.hasConflict(itemB, itemA)).toBe(true);

      const conflicts = detector.findConflicts([itemA, itemB]);
      expect(conflicts.length).toBe(1);
      expect(conflicts[0].itemA.id).toBe('item-a');
      expect(conflicts[0].itemB.id).toBe('item-b');
      expect(conflicts[0].reason).toContain('Hackathon Prep');
      expect(conflicts[0].reason).toContain('Placement Talk');
    });

    it('detects conflict for identical time ranges on the same date', () => {
      const itemA: CampusItem = {
        ...baseItem,
        id: 'item-identical-1',
        title: 'Session A',
        startTime: '14:00',
        endTime: '16:00',
      };

      const itemB: CampusItem = {
        ...baseItem,
        id: 'item-identical-2',
        title: 'Session B',
        startTime: '14:00',
        endTime: '16:00',
      };

      expect(detector.hasConflict(itemA, itemB)).toBe(true);
      const conflicts = detector.findConflicts([itemA, itemB]);
      expect(conflicts.length).toBe(1);
    });

    it('detects conflict when one event completely contains another event duration', () => {
      const longItem: CampusItem = {
        ...baseItem,
        id: 'item-long',
        title: 'All-Day Workshop',
        startTime: '10:00',
        endTime: '16:00',
      };

      const shortItem: CampusItem = {
        ...baseItem,
        id: 'item-short',
        title: 'Quick Sync',
        startTime: '12:00',
        endTime: '13:00',
      };

      expect(detector.hasConflict(longItem, shortItem)).toBe(true);
      expect(detector.hasConflict(shortItem, longItem)).toBe(true);
      const conflicts = detector.findConflicts([longItem, shortItem]);
      expect(conflicts.length).toBe(1);
    });

    it('detects conflict when events share the same start time but differ in duration', () => {
      const item1: CampusItem = {
        ...baseItem,
        id: 'item-same-start-1',
        title: 'Talk 1',
        startTime: '10:00',
        endTime: '11:00',
      };

      const item2: CampusItem = {
        ...baseItem,
        id: 'item-same-start-2',
        title: 'Talk 2',
        startTime: '10:00',
        endTime: '12:00',
      };

      expect(detector.hasConflict(item1, item2)).toBe(true);
      const conflicts = detector.findConflicts([item1, item2]);
      expect(conflicts.length).toBe(1);
    });

    it('does NOT conflict for adjacent events touching on boundary (end == start)', () => {
      const itemA: CampusItem = {
        ...baseItem,
        id: 'item-adj-1',
        title: 'Morning Session',
        startTime: '10:00',
        endTime: '12:00',
      };

      const itemB: CampusItem = {
        ...baseItem,
        id: 'item-adj-2',
        title: 'Afternoon Session',
        startTime: '12:00',
        endTime: '14:00',
      };

      expect(detector.hasConflict(itemA, itemB)).toBe(false);
      expect(detector.hasConflict(itemB, itemA)).toBe(false);

      const conflicts = detector.findConflicts([itemA, itemB]);
      expect(conflicts).toEqual([]);
    });

    it('does NOT conflict for events on different dates with same time', () => {
      const itemDay1: CampusItem = {
        ...baseItem,
        id: 'item-day-1',
        date: '2026-10-15',
        startTime: '10:00',
        endTime: '12:00',
      };

      const itemDay2: CampusItem = {
        ...baseItem,
        id: 'item-day-2',
        date: '2026-10-16',
        startTime: '10:00',
        endTime: '12:00',
      };

      expect(detector.hasConflict(itemDay1, itemDay2)).toBe(false);
      const conflicts = detector.findConflicts([itemDay1, itemDay2]);
      expect(conflicts).toEqual([]);
    });
  });

  describe('2. Multiple Conflicts and Sorting', () => {
    it('correctly detects and orders multiple conflicting pairs deterministically', () => {
      const item1: CampusItem = {
        ...baseItem,
        id: 'item-1',
        title: 'Event 1 (10:00 - 12:00)',
        date: '2026-10-15',
        startTime: '10:00',
        endTime: '12:00',
      };

      const item2: CampusItem = {
        ...baseItem,
        id: 'item-2',
        title: 'Event 2 (11:00 - 13:00)',
        date: '2026-10-15',
        startTime: '11:00',
        endTime: '13:00',
      };

      const item3: CampusItem = {
        ...baseItem,
        id: 'item-3',
        title: 'Event 3 (11:30 - 12:30)',
        date: '2026-10-15',
        startTime: '11:30',
        endTime: '12:30',
      };

      // item1 overlaps with item2 and item3
      // item2 overlaps with item1 and item3
      // Total conflicts: (1, 2), (1, 3), (2, 3) = 3 conflicts
      const conflicts = detector.findConflicts([item3, item1, item2]);
      expect(conflicts.length).toBe(3);

      // Verify deterministic sorting: itemA starting at 10:00 comes before itemA starting at 11:00
      expect(conflicts[0].itemA.id).toBe('item-1');
      expect(conflicts[0].itemB.id).toBe('item-2');

      expect(conflicts[1].itemA.id).toBe('item-1');
      expect(conflicts[1].itemB.id).toBe('item-3');

      expect(conflicts[2].itemA.id).toBe('item-2');
      expect(conflicts[2].itemB.id).toBe('item-3');
    });
  });

  describe('3. Edge Cases and Safety', () => {
    it('does not report conflict when an item is compared to itself', () => {
      expect(detector.hasConflict(baseItem, baseItem)).toBe(false);
    });

    it('safely handles missing or null startTime / endTime', () => {
      const itemNoTimes: CampusItem = {
        ...baseItem,
        id: 'item-no-times',
        startTime: null,
        endTime: null,
      };

      const itemNoEnd: CampusItem = {
        ...baseItem,
        id: 'item-no-end',
        startTime: '10:00',
        endTime: null,
      };

      expect(detector.hasConflict(baseItem, itemNoTimes)).toBe(false);
      expect(detector.hasConflict(itemNoTimes, itemNoEnd)).toBe(false);
      expect(detector.findConflicts([baseItem, itemNoTimes, itemNoEnd])).toEqual([]);
    });

    it('safely handles malformed time strings', () => {
      const itemMalformed: CampusItem = {
        ...baseItem,
        id: 'item-malformed',
        startTime: 'invalid',
        endTime: 'times',
      };

      expect(detector.hasConflict(baseItem, itemMalformed)).toBe(false);
      expect(detector.findConflicts([baseItem, itemMalformed])).toEqual([]);
    });

    it('does not mutate input array or items', () => {
      const itemA = Object.freeze({ ...baseItem, id: 'freeze-a' });
      const itemB = Object.freeze({ ...baseItem, id: 'freeze-b', startTime: '11:00', endTime: '13:00' });
      const frozenArray = Object.freeze([itemA, itemB]) as unknown as CampusItem[];

      expect(() => detector.findConflicts(frozenArray as CampusItem[])).not.toThrow();
    });
  });
});

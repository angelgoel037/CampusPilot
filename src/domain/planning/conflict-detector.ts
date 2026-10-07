import { CampusItem } from '../campus-item/types';
import { IPlanningConflictDetector, PlanConflict } from './index';
import { doTimesOverlap, formatDateString, formatTimeString } from '@/src/shared/utils/date';

/**
 * PlanningConflictDetector
 * Deterministic, pure domain implementation of IPlanningConflictDetector.
 * Identifies time overlap conflicts in a student's personal plan according to FR-007.
 */
export class PlanningConflictDetector implements IPlanningConflictDetector {
  /**
   * Evaluates if two CampusItems have a scheduling conflict.
   * Conflict rule (FR-007):
   * 1. Same date (itemA.date === itemB.date)
   * 2. Both items have valid start and end times
   * 3. Time ranges overlap (A.start < B.end && B.start < A.end)
   *
   * Touching boundaries (e.g. 10:00-12:00 and 12:00-14:00) do NOT conflict.
   */
  public hasConflict(itemA: CampusItem, itemB: CampusItem): boolean {
    if (!itemA || !itemB) return false;
    if (itemA.id === itemB.id) return false;

    // Different dates cannot conflict
    if (!itemA.date || !itemB.date || itemA.date !== itemB.date) {
      return false;
    }

    // Both start and end times must be present to confirm an overlap
    if (!itemA.startTime || !itemA.endTime || !itemB.startTime || !itemB.endTime) {
      return false;
    }

    // Format validation (expects HH:mm)
    const timePattern = /^\d{1,2}:\d{2}$/;
    if (
      !timePattern.test(itemA.startTime) ||
      !timePattern.test(itemA.endTime) ||
      !timePattern.test(itemB.startTime) ||
      !timePattern.test(itemB.endTime)
    ) {
      return false;
    }

    // Interval validity check (startTime must be strictly before endTime)
    if (itemA.startTime >= itemA.endTime || itemB.startTime >= itemB.endTime) {
      return false;
    }

    return doTimesOverlap(
      itemA.startTime,
      itemA.endTime,
      itemB.startTime,
      itemB.endTime
    );
  }

  /**
   * Identifies all pairwise conflicts within a list of CampusItems.
   * Returns a deterministic, sorted list of PlanConflict objects without mutating input.
   */
  public findConflicts(items: CampusItem[]): PlanConflict[] {
    if (!items || items.length < 2) {
      return [];
    }

    const conflicts: PlanConflict[] = [];

    // Pairwise comparison
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const item1 = items[i];
        const item2 = items[j];

        if (this.hasConflict(item1, item2)) {
          // Normalize ordering so earlier starting item is itemA
          const [orderedA, orderedB] = this.orderConflictPair(item1, item2);
          const reason = this.buildConflictReason(orderedA, orderedB);

          conflicts.push({
            itemA: orderedA,
            itemB: orderedB,
            reason,
          });
        }
      }
    }

    // Deterministic sorting of conflicts:
    // 1. itemA.date ascending
    // 2. itemA.startTime ascending
    // 3. itemA.id ascending
    // 4. itemB.id ascending
    return conflicts.sort((a, b) => {
      if (a.itemA.date !== b.itemA.date) {
        return a.itemA.date.localeCompare(b.itemA.date);
      }
      const startA = a.itemA.startTime || '';
      const startB = b.itemA.startTime || '';
      if (startA !== startB) {
        return startA.localeCompare(startB);
      }
      if (a.itemA.id !== b.itemA.id) {
        return a.itemA.id.localeCompare(b.itemA.id);
      }
      return a.itemB.id.localeCompare(b.itemB.id);
    });
  }

  /**
   * Orders conflict pairs consistently:
   * 1. Earlier startTime first
   * 2. If identical startTime, lexicographical ID order
   */
  private orderConflictPair(
    item1: CampusItem,
    item2: CampusItem
  ): [CampusItem, CampusItem] {
    const time1 = item1.startTime || '';
    const time2 = item2.startTime || '';

    if (time1 < time2) {
      return [item1, item2];
    }
    if (time2 < time1) {
      return [item2, item1];
    }
    return item1.id.localeCompare(item2.id) <= 0 ? [item1, item2] : [item2, item1];
  }

  /**
   * Constructs clear, explainable conflict reason for UI/presentation layer.
   */
  private buildConflictReason(itemA: CampusItem, itemB: CampusItem): string {
    const dateFormatted = formatDateString(itemA.date);
    const timeA = `${formatTimeString(itemA.startTime)} - ${formatTimeString(itemA.endTime)}`;
    const timeB = `${formatTimeString(itemB.startTime)} - ${formatTimeString(itemB.endTime)}`;

    return `Time conflict on ${dateFormatted}: "${itemA.title}" (${timeA}) overlaps with "${itemB.title}" (${timeB})`;
  }
}

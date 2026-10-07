import { CampusItem } from '@/src/domain/campus-item/types';
import { IPlanRepository, PlanItem } from '@/src/domain/planning';

/**
 * PlanRepository
 * Infrastructure repository implementing IPlanRepository.
 * Manages saved student plan items, preventing duplicate entries.
 */
export class PlanRepository implements IPlanRepository {
  private planItems: PlanItem[] = [];

  constructor(initialPlans?: PlanItem[]) {
    if (initialPlans) {
      this.planItems = [...initialPlans];
    }
  }

  async getPlan(userId: string): Promise<PlanItem[]> {
    return this.planItems
      .filter((p) => p.userId === userId)
      .map((p) => ({ ...p, item: { ...p.item } }));
  }

  async addItem(userId: string, item: CampusItem): Promise<PlanItem> {
    const existing = this.planItems.find(
      (p) => p.userId === userId && p.campusItemId === item.id
    );

    if (existing) {
      return { ...existing };
    }

    const newPlanItem: PlanItem = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      campusItemId: item.id,
      item: { ...item },
      addedAt: new Date().toISOString(),
    };

    this.planItems.push(newPlanItem);
    return { ...newPlanItem };
  }

  async removeItem(userId: string, campusItemId: string): Promise<void> {
    this.planItems = this.planItems.filter(
      (p) => !(p.userId === userId && p.campusItemId === campusItemId)
    );
  }

  async hasItem(userId: string, campusItemId: string): Promise<boolean> {
    return this.planItems.some(
      (p) => p.userId === userId && p.campusItemId === campusItemId
    );
  }
}

import {
  CampusItem,
  CampusItemFilter,
  ICampusItemRepository,
} from '@/src/domain/campus-item/types';
import { ItemStatus } from '@/src/shared/constants';
import sampleItemsRaw from '../../../shared/sample-data/campus-items.sample.json';

/**
 * CampusItemRepository
 * Infrastructure repository implementing ICampusItemRepository.
 * Initialized with sample campus items for offline reliability and demo resilience.
 */
export class CampusItemRepository implements ICampusItemRepository {
  private items: CampusItem[];

  constructor(initialItems?: CampusItem[]) {
    this.items = initialItems ? [...initialItems] : [...(sampleItemsRaw as CampusItem[])];
  }

  async findById(id: string): Promise<CampusItem | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? { ...item } : null;
  }

  async findMany(filter?: CampusItemFilter): Promise<CampusItem[]> {
    let result = [...this.items];

    if (!filter) {
      return result;
    }

    if (filter.status) {
      result = result.filter((i) => i.status === filter.status);
    }

    if (filter.category) {
      result = result.filter((i) => i.category === filter.category);
    }

    if (filter.categories && filter.categories.length > 0) {
      result = result.filter((i) => filter.categories!.includes(i.category));
    }

    if (filter.importance) {
      result = result.filter((i) => i.importance === filter.importance);
    }

    if (filter.audience) {
      result = result.filter((i) => i.audience === filter.audience);
    }

    if (filter.startDate) {
      result = result.filter((i) => i.date >= filter.startDate!);
    }

    if (filter.endDate) {
      result = result.filter((i) => i.date <= filter.endDate!);
    }

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.organizer.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  async findImportant(limit: number = 5): Promise<CampusItem[]> {
    const published = this.items.filter((i) => i.status === 'published');
    const important = published.filter(
      (i) => (i.category === 'important_campus' || i.category === 'academic_important') || i.importance === 'critical' || i.importance === 'high'
    );

    return important
      .sort((a, b) => {
        if (a.importance === 'critical' && b.importance !== 'critical') return -1;
        if (b.importance === 'critical' && a.importance !== 'critical') return 1;
        return a.date.localeCompare(b.date);
      })
      .slice(0, limit);
  }

  async create(
    itemData: Omit<CampusItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CampusItem> {
    const now = new Date().toISOString();
    const newItem: CampusItem = {
      ...itemData,
      id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(newItem);
    return { ...newItem };
  }

  async update(id: string, updates: Partial<CampusItem>): Promise<CampusItem> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`CampusItem with ID "${id}" not found.`);
    }

    const updatedItem: CampusItem = {
      ...this.items[index],
      ...updates,
      id, // Preserve immutable ID
      updatedAt: new Date().toISOString(),
    };

    this.items[index] = updatedItem;
    return { ...updatedItem };
  }

  async setStatus(id: string, status: ItemStatus): Promise<CampusItem> {
    return this.update(id, { status });
  }
}

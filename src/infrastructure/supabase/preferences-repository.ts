import {
  IPreferencesRepository,
  StudentPreferences,
} from '@/src/domain/preferences';

/**
 * PreferencesRepository
 * Infrastructure repository implementing IPreferencesRepository.
 * Manages user preference persistence with in-memory store and optional Supabase sync.
 */
export class PreferencesRepository implements IPreferencesRepository {
  private preferencesMap = new Map<string, StudentPreferences>();

  constructor(initialPreferences?: Record<string, StudentPreferences>) {
    if (initialPreferences) {
      Object.entries(initialPreferences).forEach(([userId, prefs]) => {
        this.preferencesMap.set(userId, { ...prefs });
      });
    }
  }

  async getPreferences(userId: string): Promise<StudentPreferences | null> {
    const prefs = this.preferencesMap.get(userId);
    return prefs ? { ...prefs } : null;
  }

  async savePreferences(preferences: StudentPreferences): Promise<void> {
    this.preferencesMap.set(preferences.userId, {
      ...preferences,
      updatedAt: new Date().toISOString(),
    });
  }
}

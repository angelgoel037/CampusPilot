import {
  CampusItemRepository,
  PreferencesRepository,
  PlanRepository,
} from './supabase';
import { MockContentExtractor } from './ai';
import {
  WeightedRecommendationEngine,
  IRecommendationEngine,
} from '@/src/domain/recommendation';
import {
  PlanningConflictDetector,
  IPlanningConflictDetector,
  IPlanRepository,
} from '@/src/domain/planning';
import {
  ICampusItemReader,
  ICampusItemWriter,
  ICampusItemRepository,
} from '@/src/domain/campus-item';
import { IPreferencesRepository } from '@/src/domain/preferences';
import {
  GetPersonalizedFeedUseCase,
} from '@/src/application/recommendations';
import {
  GetCampusItemsUseCase,
  GetImportantCampusUpdatesUseCase,
} from '@/src/application/campus-items';
import { ManagePlanUseCase } from '@/src/application/planning';
import {
  PublishCampusItemUseCase,
  IExtractionService,
} from '@/src/application/publishing';

export interface ServiceContainer {
  // Repositories
  campusItemRepository: ICampusItemRepository;
  preferencesRepository: IPreferencesRepository;
  planRepository: IPlanRepository;

  // Domain Services
  recommendationEngine: IRecommendationEngine;
  planningConflictDetector: IPlanningConflictDetector;
  contentExtractor: IExtractionService;

  // Application Use Cases
  getPersonalizedFeedUseCase: GetPersonalizedFeedUseCase;
  getCampusItemsUseCase: GetCampusItemsUseCase;
  getImportantCampusUpdatesUseCase: GetImportantCampusUpdatesUseCase;
  managePlanUseCase: ManagePlanUseCase;
  publishCampusItemUseCase: PublishCampusItemUseCase;
}

let containerInstance: ServiceContainer | null = null;

/**
 * Creates or retrieves the singleton ServiceContainer wiring dependencies
 * adhering to SOLID Dependency Inversion Principle (DIP).
 */
export function getContainer(): ServiceContainer {
  if (!containerInstance) {
    const campusItemRepository = new CampusItemRepository();
    const preferencesRepository = new PreferencesRepository();
    const planRepository = new PlanRepository();

    const recommendationEngine = new WeightedRecommendationEngine();
    const planningConflictDetector = new PlanningConflictDetector();
    const contentExtractor = new MockContentExtractor();

    const getPersonalizedFeedUseCase = new GetPersonalizedFeedUseCase(
      campusItemRepository,
      recommendationEngine
    );
    const getCampusItemsUseCase = new GetCampusItemsUseCase(
      campusItemRepository
    );
    const getImportantCampusUpdatesUseCase = new GetImportantCampusUpdatesUseCase(
      campusItemRepository
    );
    const managePlanUseCase = new ManagePlanUseCase(
      planRepository,
      planningConflictDetector
    );
    const publishCampusItemUseCase = new PublishCampusItemUseCase(
      campusItemRepository,
      contentExtractor
    );

    containerInstance = {
      campusItemRepository,
      preferencesRepository,
      planRepository,
      recommendationEngine,
      planningConflictDetector,
      contentExtractor,
      getPersonalizedFeedUseCase,
      getCampusItemsUseCase,
      getImportantCampusUpdatesUseCase,
      managePlanUseCase,
      publishCampusItemUseCase,
    };
  }

  return containerInstance;
}

/**
 * Reset container for isolation in tests if needed
 */
export function resetContainer(): void {
  containerInstance = null;
}

import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/src/infrastructure/container';
import { StudentPreferences } from '@/src/domain/preferences';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'student-demo';

    const container = getContainer();

    // 1. Retrieve student preferences or fallback to default
    let preferences = await container.preferencesRepository.getPreferences(userId);
    if (!preferences) {
      preferences = {
        userId,
        selectedCategories: ['technical', 'cultural'],
        isOnboardingCompleted: false,
        updatedAt: new Date().toISOString(),
      };
    }

    // 2. Execute Personalized Feed Use Case
    const forYou = await container.getPersonalizedFeedUseCase.execute(preferences);

    // 3. Execute Important Campus Updates Use Case
    const important = await container.getImportantCampusUpdatesUseCase.execute(5);

    return NextResponse.json({
      success: true,
      data: {
        forYou,
        important,
        preferences,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to generate personalized feed.',
      },
      { status: 500 }
    );
  }
}

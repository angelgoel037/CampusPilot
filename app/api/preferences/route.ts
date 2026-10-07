import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/src/infrastructure/container';
import { StudentPreferencesSchema } from '@/src/domain/preferences';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'student-demo';

    const container = getContainer();
    const preferences = await container.preferencesRepository.getPreferences(userId);

    return NextResponse.json({
      success: true,
      data: preferences || {
        userId,
        selectedCategories: [],
        isOnboardingCompleted: false,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve student preferences.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = StudentPreferencesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid preferences payload.',
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const container = getContainer();
    await container.preferencesRepository.savePreferences(validation.data);

    return NextResponse.json({
      success: true,
      data: validation.data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to save student preferences.',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/src/infrastructure/container';
import { CampusCategory } from '@/src/shared/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as CampusCategory | null;
    const searchQuery = searchParams.get('searchQuery') || undefined;

    const container = getContainer();
    const items = await container.getCampusItemsUseCase.execute({
      status: 'published',
      category: category || undefined,
      searchQuery,
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve campus items.',
      },
      { status: 500 }
    );
  }
}

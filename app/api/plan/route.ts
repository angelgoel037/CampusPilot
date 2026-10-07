import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/src/infrastructure/container';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'student-demo';

    const container = getContainer();
    const planData = await container.managePlanUseCase.getUserPlan(userId);

    return NextResponse.json({
      success: true,
      data: planData,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve student plan.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, campusItemId } = body || {};

    if (!userId || !campusItemId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId and campusItemId are required fields.',
        },
        { status: 400 }
      );
    }

    const container = getContainer();
    const item = await container.campusItemRepository.findById(campusItemId);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: `CampusItem with ID "${campusItemId}" not found.`,
        },
        { status: 404 }
      );
    }

    const planItem = await container.managePlanUseCase.addItemToPlan(userId, item);
    const updatedPlan = await container.managePlanUseCase.getUserPlan(userId);

    return NextResponse.json({
      success: true,
      data: {
        added: planItem,
        plan: updatedPlan,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to add item to plan.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const campusItemId = searchParams.get('campusItemId');

    if (!userId || !campusItemId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId and campusItemId query parameters are required.',
        },
        { status: 400 }
      );
    }

    const container = getContainer();
    await container.managePlanUseCase.removeItemFromPlan(userId, campusItemId);
    const updatedPlan = await container.managePlanUseCase.getUserPlan(userId);

    return NextResponse.json({
      success: true,
      data: {
        removedId: campusItemId,
        plan: updatedPlan,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to remove item from plan.',
      },
      { status: 500 }
    );
  }
}

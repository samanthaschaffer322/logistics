export const dynamic = 'force-static';
export const revalidate = false;

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedRouteOptimizer, RouteOptimizationRequest } from '@/lib/route-optimization/advanced-optimizer';

export async function POST(request: NextRequest) {
  try {
    const optimizationRequest: RouteOptimizationRequest = await request.json();

    // Validate the request
    if (!optimizationRequest.vehicles || optimizationRequest.vehicles.length === 0) {
      return NextResponse.json(
        { error: 'At least one vehicle is required' },
        { status: 400 }
      );
    }

    if (!optimizationRequest.locations || optimizationRequest.locations.length === 0) {
      return NextResponse.json(
        { error: 'At least one location is required' },
        { status: 400 }
      );
    }

    const optimizer = new AdvancedRouteOptimizer();
    const result = await optimizer.optimize(optimizationRequest);

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Error in optimize-routes API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Route optimization API endpoint',
    usage: 'POST with RouteOptimizationRequest object'
  });
}

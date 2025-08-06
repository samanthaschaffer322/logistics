import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Route optimization API ready",
    status: "ready"
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { departure, destination, vehicleType = 'truck' } = body;

    // Simple route optimization response
    const response = {
      route: {
        departure: departure || 'TP. Hồ Chí Minh',
        destination: destination || 'Hà Nội',
        distance: 1700,
        duration: 24,
        cost: {
          fuel: 800000,
          tolls: 400000,
          driver: 500000,
          total: 1700000
        },
        vehicleType,
        optimized: true
      },
      recommendations: [
        'Khởi hành lúc 5:00 sáng để tránh kẹt xe',
        'Sử dụng tuyến đường AH1 để tiết kiệm thời gian',
        'Dừng nghỉ tại Vinh để đổi ca lái xe'
      ]
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json(
      { error: 'Route optimization failed' },
      { status: 500 }
    );
  }
}

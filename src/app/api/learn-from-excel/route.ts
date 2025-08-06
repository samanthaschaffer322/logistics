import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Excel learning API ready",
    status: "ready",
    features: [
      "Excel file processing",
      "Vietnamese logistics data analysis",
      "Route pattern recognition",
      "Cost optimization insights"
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileData, fileName } = body;

    // Simulate Excel processing with Vietnamese logistics insights
    const analysis = {
      fileName: fileName || 'logistics-data.xlsx',
      processedAt: new Date().toISOString(),
      insights: [
        {
          type: 'route_pattern',
          title: 'Tuyến đường phổ biến',
          description: 'Phát hiện 5 tuyến đường chính: TP.HCM-Hà Nội, Đà Nẵng-Hải Phòng',
          confidence: 0.92
        },
        {
          type: 'cost_optimization',
          title: 'Cơ hội tiết kiệm',
          description: 'Có thể tiết kiệm 15-20% chi phí bằng tối ưu hóa tuyến đường',
          confidence: 0.87
        },
        {
          type: 'seasonal_pattern',
          title: 'Xu hướng theo mùa',
          description: 'Tăng 30% hoạt động vào tháng 10-12 (chuẩn bị Tết)',
          confidence: 0.89
        }
      ],
      recommendations: [
        'Sử dụng kho trung chuyển để giảm chi phí vận chuyển',
        'Tối ưu hóa lịch trình để tránh giờ cao điểm',
        'Kết hợp nhiều đơn hàng cùng tuyến để tiết kiệm',
        'Áp dụng công nghệ GPS để theo dõi thời gian thực'
      ],
      routes: [
        { from: 'TP. Hồ Chí Minh', to: 'Hà Nội', frequency: 95, avgCost: 2100000 },
        { from: 'Đà Nẵng', to: 'TP. Hồ Chí Minh', frequency: 87, avgCost: 1800000 },
        { from: 'Hà Nội', to: 'Hải Phòng', frequency: 82, avgCost: 800000 },
        { from: 'TP. Hồ Chí Minh', to: 'Cần Thơ', frequency: 78, avgCost: 600000 }
      ]
    };

    return NextResponse.json({
      success: true,
      analysis,
      message: 'Excel file processed successfully with Vietnamese logistics insights'
    });

  } catch (error) {
    console.error('Excel processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process Excel file',
        message: 'Có lỗi xảy ra khi xử lý file Excel. Vui lòng thử lại.'
      },
      { status: 500 }
    );
  }
}

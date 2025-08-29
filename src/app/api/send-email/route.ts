import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content } = await request.json()

    // For static deployment, we'll simulate email sending
    // In production, you would integrate with EmailJS, SendGrid, or similar service
    console.log('📧 SIMULATED EMAIL SEND:')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Content:', content)
    
    // Simulate successful email sending
    const messageId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return NextResponse.json({ 
      success: true, 
      messageId: messageId,
      message: `Email simulated successfully to ${to}`,
      note: 'This is a simulation for static deployment. Integrate with EmailJS or SendGrid for real emails.'
    })

  } catch (error) {
    console.error('❌ Email simulation failed:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

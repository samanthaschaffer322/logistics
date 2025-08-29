import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content } = await request.json()

    // Email configuration - you can update these for BillionMail
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'localhost', // BillionMail SMTP host
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'logiai@yourdomain.com',
        pass: process.env.SMTP_PASS || 'your-password'
      },
      // For BillionMail self-signed certificates
      tls: {
        rejectUnauthorized: false
      }
    })

    // Send email
    const info = await transporter.sendMail({
      from: `"LogiAI System" <${process.env.SMTP_USER || 'logiai@yourdomain.com'}>`,
      to: to,
      subject: subject,
      text: content,
      html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${content}</pre>`
    })

    console.log('📧 Email sent successfully:', info.messageId)
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully to ' + to
    })

  } catch (error) {
    console.error('❌ Email sending failed:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

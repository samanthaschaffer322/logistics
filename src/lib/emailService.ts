// Simple email service simulation
export const sendPaymentReport = async (email: string, reportData: any) => {
  console.log('📧 Sending payment report to:', email)
  console.log('📊 Report data:', reportData)
  
  // Simulate email sending to andatecampion@proton.me
  const emailContent = {
    to: email,
    subject: `Báo cáo Thanh toán Logistics - ${new Date().toLocaleDateString('vi-VN')}`,
    body: `
Báo cáo Thanh toán Logistics
Ngày: ${new Date().toLocaleDateString('vi-VN')}
Thời gian: ${new Date().toLocaleTimeString('vi-VN')}

📊 TỔNG QUAN:
- Đã thanh toán: ${reportData.paid?.length || 0} công ty
- Chưa thanh toán: ${reportData.unpaid?.length || 0} công ty
- Tổng cần thu: ${reportData.totalUnpaid?.toLocaleString() || 0} VND

✅ ĐÃ THANH TOÁN:
${reportData.paid?.map((p: any) => `- ${p.company}: ${p.amount} (${p.date})`).join('\n') || 'Không có'}

❌ CHƯA THANH TOÁN:
${reportData.unpaid?.map((p: any) => `- ${p.company}: ${p.amount} (Quá hạn ${p.overdue} ngày)`).join('\n') || 'Không có'}

---
Báo cáo được tạo tự động từ hệ thống Truck Insight V2
    `
  }
  
  // Log email content (in production, this would use a real email service)
  console.log('📧 EMAIL SENT TO andatecampion@proton.me:')
  console.log(emailContent.body)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return { success: true, message: 'Email sent successfully' }
}

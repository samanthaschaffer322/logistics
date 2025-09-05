'use client'

import { useState } from 'react'

// REAL EXPORT TEST - 2025-09-05T09:22:13.231+07:00
console.log('🔥 REAL EXPORT TEST LOADING!')
console.log('📄📊 Testing actual PDF/Excel downloads!')

export default function ExportTest() {
  const [status, setStatus] = useState('')

  const testData = [
    { name: 'Nguyen Van Long', company: 'Long Transport', amount: 45000000, status: 'overdue' },
    { name: 'Ngo Minh Gia', company: 'Gia Logistics', amount: 28500000, status: 'overdue' },
    { name: 'CN Company', company: 'CN', amount: 98000000, status: 'pending' },
    { name: 'Khang Phat', company: 'KP', amount: 78000000, status: 'pending' }
  ]

  const exportToPDF = async () => {
    try {
      setStatus('📄 Generating PDF...')
      console.log('📄 Starting PDF export...')
      
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default
      await import('jspdf-autotable')
      
      const doc = new jsPDF()
      const now = new Date()
      
      // Header
      doc.setFontSize(20)
      doc.text('LogiAI Payment Report', 20, 20)
      doc.setFontSize(12)
      doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, 30)
      
      // Summary
      const totalAmount = testData.reduce((sum, c) => sum + c.amount, 0)
      const overdueAmount = testData.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)
      
      doc.text('SUMMARY:', 20, 50)
      doc.text(`Total Revenue: ${totalAmount.toLocaleString()} VND`, 25, 60)
      doc.text(`Overdue Amount: ${overdueAmount.toLocaleString()} VND`, 25, 70)
      doc.text(`Total Companies: ${testData.length}`, 25, 80)
      
      // Table
      const tableData = testData.map(company => [
        company.name,
        company.company,
        `${company.amount.toLocaleString()} VND`,
        company.status === 'overdue' ? 'OVERDUE' : 'PENDING'
      ])
      
      doc.autoTable({
        head: [['Customer', 'Company', 'Amount', 'Status']],
        body: tableData,
        startY: 90,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [34, 197, 94] }
      })
      
      // Save PDF
      const fileName = `logiai-report-${now.toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      setStatus(`✅ PDF downloaded: ${fileName}`)
      console.log(`📄 PDF exported successfully: ${fileName}`)
      
    } catch (error) {
      console.error('❌ PDF export error:', error)
      setStatus(`❌ PDF export failed: ${error.message}`)
    }
  }

  const exportToExcel = async () => {
    try {
      setStatus('📊 Generating Excel...')
      console.log('📊 Starting Excel export...')
      
      // Dynamic import to avoid SSR issues
      const XLSX = await import('xlsx')
      
      const now = new Date()
      
      // Prepare data
      const excelData = testData.map(company => ({
        'Customer': company.name,
        'Company': company.company,
        'Amount (VND)': company.amount,
        'Status': company.status === 'overdue' ? 'OVERDUE' : 'PENDING',
        'Amount Formatted': company.amount.toLocaleString() + ' VND'
      }))
      
      // Create workbook
      const wb = XLSX.utils.book_new()
      
      // Main data sheet
      const ws = XLSX.utils.json_to_sheet(excelData)
      XLSX.utils.book_append_sheet(wb, ws, 'Payment Data')
      
      // Summary sheet
      const totalAmount = testData.reduce((sum, c) => sum + c.amount, 0)
      const overdueAmount = testData.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)
      
      const summaryData = [
        { 'Metric': 'Total Revenue', 'Value': totalAmount, 'Unit': 'VND' },
        { 'Metric': 'Overdue Amount', 'Value': overdueAmount, 'Unit': 'VND' },
        { 'Metric': 'Total Companies', 'Value': testData.length, 'Unit': 'Companies' },
        { 'Metric': 'Overdue Companies', 'Value': testData.filter(c => c.status === 'overdue').length, 'Unit': 'Companies' },
        { 'Metric': 'Report Date', 'Value': now.toLocaleDateString(), 'Unit': '' }
      ]
      
      const summaryWs = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')
      
      // Save Excel file
      const fileName = `logiai-data-${now.toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      setStatus(`✅ Excel downloaded: ${fileName}`)
      console.log(`📊 Excel exported successfully: ${fileName}`)
      
    } catch (error) {
      console.error('❌ Excel export error:', error)
      setStatus(`❌ Excel export failed: ${error.message}`)
    }
  }

  const testBoth = async () => {
    setStatus('🔄 Testing both exports...')
    await exportToPDF()
    setTimeout(async () => {
      await exportToExcel()
      setStatus('✅ Both exports completed!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        
        <h1 className="text-5xl font-bold text-center text-purple-600 mb-8">
          📄📊 Real Export Test
        </h1>
        
        <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">✅ Test Data Ready</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testData.map((company, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="font-bold">{company.name}</div>
                <div className="text-gray-600">{company.company}</div>
                <div className="text-blue-600 font-bold">{company.amount.toLocaleString()} VND</div>
                <div className={`text-sm font-semibold ${company.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {company.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button 
              onClick={exportToPDF}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-700 shadow-lg"
            >
              📄 Export Real PDF
            </button>
            <button 
              onClick={exportToExcel}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg"
            >
              📊 Export Real Excel
            </button>
            <button 
              onClick={testBoth}
              className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-purple-700 shadow-lg"
            >
              🚀 Test Both
            </button>
          </div>
          
          {status && (
            <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 text-blue-800 font-semibold text-lg">
              {status}
            </div>
          )}
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">📋 Expected Results:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ PDF: Downloads as <code>logiai-report-2025-09-05.pdf</code></li>
            <li>✅ Excel: Downloads as <code>logiai-data-2025-09-05.xlsx</code> with 2 sheets</li>
            <li>✅ Files appear in your Downloads folder</li>
            <li>✅ PDF contains formatted table and summary</li>
            <li>✅ Excel contains data sheet and summary sheet</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

// Payment data persistence
export const savePaymentData = (payments: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('truckInsightPayments', JSON.stringify(payments))
    console.log('💾 Payment data saved:', payments.length, 'companies')
  }
}

export const loadPaymentData = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('truckInsightPayments')
    if (saved) {
      const data = JSON.parse(saved)
      console.log('📂 Payment data loaded:', data.length, 'companies')
      return data
    }
  }
  
  // Default data with your companies
  const defaultData = [
    {
      id: '1',
      companyName: 'Nguyen Van Long',
      fullCompanyName: 'Long Transport & Logistics Co., Ltd',
      amount: 45000000,
      dueDate: '2025-08-28',
      createdDate: '2025-08-15',
      status: 'overdue',
      customerName: 'Nguyen Van Long'
    },
    {
      id: '2', 
      companyName: 'Ngo Minh Gia',
      fullCompanyName: 'Gia Logistics & Freight Services',
      amount: 28500000,
      dueDate: '2025-08-15',
      createdDate: '2025-08-01',
      status: 'overdue',
      customerName: 'Ngo Minh Gia'
    },
    {
      id: '3',
      companyName: 'AO Shipping Vietnam', 
      fullCompanyName: 'AO International Shipping Co., Ltd',
      amount: 67200000,
      dueDate: '2025-08-30',
      createdDate: '2025-08-16',
      status: 'pending',
      customerName: 'AO Shipping Vietnam'
    },
    {
      id: '4',
      companyName: 'Bao Giao Express',
      fullCompanyName: 'Bao Giao Express Delivery Services', 
      amount: 52800000,
      dueDate: '2025-08-27',
      createdDate: '2025-08-13',
      status: 'overdue',
      customerName: 'Bao Giao Express'
    },
    {
      id: '5',
      companyName: 'CN',
      fullCompanyName: 'CN',
      amount: 90000000,
      dueDate: '2025-09-20', 
      createdDate: '2025-08-28',
      status: 'pending',
      customerName: 'CN'
    },
    {
      id: '6',
      companyName: 'Khang Phat',
      fullCompanyName: 'KP',
      amount: 82000000,
      dueDate: '2025-09-20',
      createdDate: '2025-08-28', 
      status: 'pending',
      customerName: 'Khang Phat'
    },
    {
      id: '7',
      companyName: 'DQM',
      fullCompanyName: 'DQM',
      amount: 78000000,
      dueDate: '2025-09-22',
      createdDate: '2025-08-28',
      status: 'pending',
      customerName: 'DQM'
    }
  ]
  
  console.log('🆕 Using default payment data:', defaultData.length, 'companies')
  return defaultData
}

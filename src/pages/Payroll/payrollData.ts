export type PaymentStatus = 'Paid' | 'Pending'

export interface PaymentHistoryRecord {
  id: string
  month: string
  overtime: number
  netPay: number
  status: PaymentStatus
}

export const mockPaymentHistoryData: PaymentHistoryRecord[] = [
  { id: 'ph-1', month: 'October', overtime: 34, netPay: 650, status: 'Paid' },
  { id: 'ph-2', month: 'September', overtime: 28, netPay: 620, status: 'Paid' },
  { id: 'ph-3', month: 'August', overtime: 45, netPay: 695, status: 'Paid' },
  { id: 'ph-4', month: 'July', overtime: 22, netPay: 610, status: 'Paid' },
  { id: 'ph-5', month: 'June', overtime: 38, netPay: 668, status: 'Paid' },
  { id: 'ph-6', month: 'May', overtime: 30, netPay: 640, status: 'Paid' },
  { id: 'ph-7', month: 'April', overtime: 25, netPay: 625, status: 'Paid' },
  { id: 'ph-8', month: 'March', overtime: 42, netPay: 682, status: 'Paid' },
]

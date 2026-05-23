export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type RequestMaterialStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface RequestMaterial {
  id: string
  materialName: string
  quantityNeeded: number
  urgencyLevel: UrgencyLevel
  reason: string
  employeeId?: string
  status: RequestMaterialStatus
  createdAt?: string
}

export const URGENCY_OPTIONS: { value: UrgencyLevel; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

export const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const STATUS_LABEL: Record<RequestMaterialStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export const URGENCY_CLASSES: Record<UrgencyLevel, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
}

export const STATUS_CLASSES: Record<RequestMaterialStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export const STATUS_DOT_CLASSES: Record<RequestMaterialStatus, string> = {
  PENDING: 'bg-amber-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
}

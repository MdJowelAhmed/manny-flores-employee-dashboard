import type { SelectOption } from '@/types'

export type EquipmentUrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type RequestEquipmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface RequestEquipment {
  id: string
  equipmentName: string
  urgencyLevel: EquipmentUrgencyLevel
  reason: string
  employeeId?: string
  status: RequestEquipmentStatus
  createdAt?: string
}

/**
 * Backward-compat alias so other files importing `EquipmentCardData`
 * (e.g. ReportIssueModal) keep compiling. New code should use `RequestEquipment`.
 */
export type EquipmentCardData = RequestEquipment

export const URGENCY_OPTIONS: {
  value: EquipmentUrgencyLevel
  label: string
}[] = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
]

export const URGENCY_LABEL: Record<EquipmentUrgencyLevel, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const STATUS_LABEL: Record<RequestEquipmentStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export const URGENCY_CLASSES: Record<EquipmentUrgencyLevel, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
}

export const STATUS_CLASSES: Record<RequestEquipmentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export const STATUS_DOT_CLASSES: Record<RequestEquipmentStatus, string> = {
  PENDING: 'bg-amber-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
}

/** Kept for ReportIssueModal compatibility. */
export const ISSUE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'overheating', label: 'Overheating' },
  { value: 'mechanical-problem', label: 'Mechanical Problem' },
  { value: 'safety-issue', label: 'Safety Issue' },
  { value: 'oil-leak', label: 'Oil Leak' },
  { value: 'other', label: 'Other' },
]

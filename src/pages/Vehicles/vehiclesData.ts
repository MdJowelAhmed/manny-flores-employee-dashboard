import type { SelectOption } from '@/types'

export type VehicleUrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type RequestVehicleStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface RequestVehicle {
  id: string
  vehicleType: string
  projectName: string
  urgencyLevel: VehicleUrgencyLevel
  reason: string
  employeeId?: string
  status: RequestVehicleStatus
  createdAt?: string
}

/**
 * Backward-compat alias so other files importing `VehicleCardData`
 * (e.g. ReportIssueModal) keep compiling. New code should use `RequestVehicle`.
 */
export type VehicleCardData = RequestVehicle

export const VEHICLE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'pickup-truck', label: 'Pickup Truck' },
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
]

export const URGENCY_OPTIONS: { value: VehicleUrgencyLevel; label: string }[] =
  [
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ]

export const URGENCY_LABEL: Record<VehicleUrgencyLevel, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const STATUS_LABEL: Record<RequestVehicleStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export const URGENCY_CLASSES: Record<VehicleUrgencyLevel, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
}

export const STATUS_CLASSES: Record<RequestVehicleStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export const STATUS_DOT_CLASSES: Record<RequestVehicleStatus, string> = {
  PENDING: 'bg-amber-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
}

/** Map a vehicle type value (e.g. "truck") to a display label. */
export function getVehicleTypeLabel(value: string): string {
  return (
    VEHICLE_TYPE_OPTIONS.find((o) => o.value === value)?.label ??
    value.charAt(0).toUpperCase() + value.slice(1)
  )
}

/** Kept for ReportIssueModal compatibility. */
export const ISSUE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'engine-problem', label: 'Engine Problem' },
  { value: 'tire-damage', label: 'Tire Damage' },
  { value: 'brake-issue', label: 'Break Issue' },
  { value: 'oil-leak', label: 'Oil Leak' },
  { value: 'other', label: 'Other' },
]

import type { SelectOption } from '@/types'

export type EquipmentCardStatus = 'Active' | 'Service Soon' | 'Not Available'

export interface EquipmentCardData {
  id: string
  projectName: string
  status: EquipmentCardStatus
  equipmentType: string
  plate: string
  mileage: string
  lastService: string
  nextService: string
}

export const EQUIPMENT_STATUS_CONFIG: Record<
  EquipmentCardStatus,
  { dotColor: string; badgeClass: string }
> = {
  Active: { dotColor: 'bg-blue-500', badgeClass: 'bg-green-100 text-green-800' },
  'Service Soon': {
    dotColor: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-800',
  },
  'Not Available': {
    dotColor: 'bg-red-500',
    badgeClass: 'bg-red-100 text-red-800',
  },
}

export const EQUIPMENT_NAME_OPTIONS: SelectOption[] = [
  { value: 'pickup-truck', label: 'Pickup Truck' },
  { value: 'excavator', label: 'Excavator' },
  { value: 'bulldozer', label: 'Bulldozer' },
  { value: 'crane', label: 'Crane' },
  { value: 'loader', label: 'Loader' },
  { value: 'other', label: 'Other' },
]

export const EQUIPMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'pickup-truck', label: 'Pickup Truck' },
  { value: 'heavy-machinery', label: 'Heavy Machinery' },
  { value: 'light-equipment', label: 'Light Equipment' },
  { value: 'tools', label: 'Tools' },
  { value: 'other', label: 'Other' },
]

export const PROJECT_OPTIONS: SelectOption[] = [
  { value: 'green-villa', label: 'Green Villa Project' },
  { value: 'riverside-park', label: 'Riverside Park' },
  { value: 'sunset-gardens', label: 'Sunset Gardens' },
]

export const ISSUE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'overheating', label: 'Overheating' },
  { value: 'mechanical-problem', label: 'Mechanical Problem' },
  { value: 'safety-issue', label: 'Safety Issue' },
  { value: 'oil-leak', label: 'Oil Leak' },
  { value: 'other', label: 'Other' },
]

export const URGENCY_OPTIONS: SelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const mockEquipmentData: EquipmentCardData[] = [
  {
    id: 'eq-1',
    projectName: 'Green Villa Project',
    status: 'Active',
    equipmentType: 'Pickup Truck',
    plate: 'TX-9920',
    mileage: '2346 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'eq-2',
    projectName: 'Green Villa Project',
    status: 'Service Soon',
    equipmentType: 'Pickup Truck',
    plate: 'TX-9921',
    mileage: '2346 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'eq-3',
    projectName: 'Green Villa Project',
    status: 'Not Available',
    equipmentType: 'Pickup Truck',
    plate: 'TX-9922',
    mileage: '2346 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'eq-4',
    projectName: 'Green Villa Project',
    status: 'Active',
    equipmentType: 'Pickup Truck',
    plate: 'TX-9923',
    mileage: '2100 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'eq-5',
    projectName: 'Green Villa Project',
    status: 'Active',
    equipmentType: 'Pickup Truck',
    plate: 'TX-9924',
    mileage: '2500 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
]

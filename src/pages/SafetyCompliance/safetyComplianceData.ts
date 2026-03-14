import type { SelectOption } from '@/types'

export interface DailyChecklistItem {
  id: string
  projectName: string
  order: number
  isCompleted: boolean
}

export const mockDailyChecklistItems: DailyChecklistItem[] = [
  { id: '1', projectName: 'Green Villa Project', order: 1, isCompleted: false },
  { id: '2', projectName: 'Green Villa Project', order: 2, isCompleted: false },
  { id: '3', projectName: 'Green Villa Project', order: 3, isCompleted: true },
  { id: '4', projectName: 'Green Villa Project', order: 4, isCompleted: true },
  { id: '5', projectName: 'Green Villa Project', order: 5, isCompleted: true },
  { id: '6', projectName: 'Green Villa Project', order: 6, isCompleted: true },
  { id: '7', projectName: 'Green Villa Project', order: 7, isCompleted: true },
]

export const PPE_CHECK_ITEMS = [
  'PPE worn by all staff',
  'PPE worn by all staff',
  'PPE worn by all staff',
  'PPE worn by all staff',
  'PPE worn by all staff',
  'PPE worn by all staff',
]

export const INCIDENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'injury', label: 'Injury' },
  { value: 'near-miss', label: 'Near Miss' },
  { value: 'property-damage', label: 'Property Damage' },
  { value: 'equipment-failure', label: 'Equipment Failure' },
  { value: 'hazard', label: 'Hazard' },
  { value: 'other', label: 'Other' },
]

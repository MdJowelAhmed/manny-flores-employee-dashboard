import type { SelectOption } from '@/types'

export type VehicleCardStatus = 'Active' | 'Service Soon' | 'Not Available'

export interface VehicleCardData {
  id: string
  projectName: string
  status: VehicleCardStatus
  vehicleType: string
  plate: string
  mileage: string
  lastService: string
  nextService: string
}

export const VEHICLE_STATUS_CONFIG: Record<
  VehicleCardStatus,
  { dotColor: string; badgeClass: string }
> = {
  Active: { dotColor: 'bg-green-500', badgeClass: 'bg-green-100 text-green-800' },
  'Service Soon': {
    dotColor: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-800',
  },
  'Not Available': {
    dotColor: 'bg-red-500',
    badgeClass: 'bg-red-100 text-red-800',
  },
}

export const VEHICLE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'pickup-truck', label: 'Pickup Truck' },
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
]

export const PROJECT_OPTIONS: SelectOption[] = [
  { value: 'green-villa', label: 'Green Villa Project' },
  { value: 'riverside-park', label: 'Riverside Park' },
  { value: 'sunset-gardens', label: 'Sunset Gardens' },
]

export const ISSUE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'engine-problem', label: 'Engine Problem' },
  { value: 'tire-damage', label: 'Tire Damage' },
  { value: 'brake-issue', label: 'Break Issue' },
  { value: 'oil-leak', label: 'Oil Leak' },
  { value: 'other', label: 'Other' },
]

export const URGENCY_OPTIONS: SelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const mockVehiclesData: VehicleCardData[] = [
  {
    id: 'v-1',
    projectName: 'Green Villa Project',
    status: 'Active',
    vehicleType: 'Pickup Truck',
    plate: 'TX-9920',
    mileage: '2346 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'v-2',
    projectName: 'Green Villa Project',
    status: 'Service Soon',
    vehicleType: 'Pickup Truck',
    plate: 'TX-9921',
    mileage: '2346 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'v-3',
    projectName: 'Green Villa Project',
    status: 'Not Available',
    vehicleType: 'Pickup Truck',
    plate: 'TX-9922',
    mileage: '2346 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'v-4',
    projectName: 'Green Villa Project',
    status: 'Active',
    vehicleType: 'Pickup Truck',
    plate: 'TX-9923',
    mileage: '2100 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'v-5',
    projectName: 'Green Villa Project',
    status: 'Active',
    vehicleType: 'Pickup Truck',
    plate: 'TX-9924',
    mileage: '2500 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
  {
    id: 'v-6',
    projectName: 'Green Villa Project',
    status: 'Active',
    vehicleType: 'Pickup Truck',
    plate: 'TX-9925',
    mileage: '2346 miles',
    lastService: 'Jan 15, 2026',
    nextService: 'Apr 15, 2026',
  },
]

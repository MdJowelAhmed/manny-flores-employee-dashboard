export type EstimateCardAction = 'review' | 'view'

export interface EstimateListItem {
  id: string
  title: string
  companyName: string
  deadlineFrom: string
  deadlineTo: string
  location: string
  paymentMethod: string
  description: string
  action: EstimateCardAction
}

export const MOCK_ESTIMATE_ITEMS: EstimateListItem[] = [
  {
    id: 'est-1',
    title: 'Plant 10 Plum Tree',
    companyName: 'Startech BD',
    deadlineFrom: '01 Feb, 2026',
    deadlineTo: '12 Feb, 2026',
    location: '123 Riverside Drive, Park Section A',
    paymentMethod: 'Google pay',
    description:
      'Complete lawn mowing for Section A, edge trimming along walkways, and debris removal. Ensure all equipment is cleaned and stored after use.',
    action: 'review',
  },
  {
    id: 'est-2',
    title: 'Landscape Section B',
    companyName: 'Green Valley LLC',
    deadlineFrom: '15 Feb, 2026',
    deadlineTo: '28 Feb, 2026',
    location: '88 Oak Street, North Wing',
    paymentMethod: 'Bank transfer',
    description:
      'Soil preparation, mulching, and seasonal planting per client specification. Coordinate with site supervisor for access hours.',
    action: 'view',
  },
  {
    id: 'est-3',
    title: 'Irrigation System Check',
    companyName: 'AquaFlow Inc.',
    deadlineFrom: '03 Mar, 2026',
    deadlineTo: '05 Mar, 2026',
    location: '200 Garden Plaza, Lot 4',
    paymentMethod: 'Card',
    description:
      'Inspect drip lines, test controller zones, and document any leaks or valve issues for maintenance follow-up.',
    action: 'view',
  },
  {
    id: 'est-4',
    title: 'Tree Pruning — Main Avenue',
    companyName: 'Urban Parks Dept',
    deadlineFrom: '10 Mar, 2026',
    deadlineTo: '20 Mar, 2026',
    location: 'Main Avenue, Blocks 12–14',
    paymentMethod: 'Google pay',
    description:
      'Safety pruning of overhanging branches, disposal of cuttings, and compliance with city arborist guidelines.',
    action: 'view',
  },
]

export const ESTIMATE_MATERIAL_OPTIONS = [
  { value: 'topsoil', labelKey: 'estimate.options.topsoil' },
  { value: 'mulch', labelKey: 'estimate.options.mulch' },
  { value: 'seed', labelKey: 'estimate.options.seed' },
  { value: 'fertilizer', labelKey: 'estimate.options.fertilizer' },
] as const

export const ESTIMATE_EQUIPMENT_OPTIONS = [
  { value: 'mower', labelKey: 'estimate.options.mower' },
  { value: 'trimmer', labelKey: 'estimate.options.trimmer' },
  { value: 'aerator', labelKey: 'estimate.options.aerator' },
  { value: 'sprayer', labelKey: 'estimate.options.sprayer' },
] as const

export const ESTIMATE_VEHICLE_OPTIONS = [
  { value: 'van', labelKey: 'estimate.options.van' },
  { value: 'pickup', labelKey: 'estimate.options.pickup' },
  { value: 'flatbed', labelKey: 'estimate.options.flatbed' },
] as const

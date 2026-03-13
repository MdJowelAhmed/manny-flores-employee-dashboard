export type ProjectMaterialStatus = 'Delivered' | 'Taken'

export interface ProjectMaterial {
  id: string
  projectName: string
  materialName: string
  required: string
  delivered: string
  status: ProjectMaterialStatus
}

export const mockProjectMaterialsData: ProjectMaterial[] = [
  {
    id: 'pm-1',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Taken',
  },
  {
    id: 'pm-2',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Taken',
  },
  {
    id: 'pm-3',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Delivered',
  },
  {
    id: 'pm-4',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Delivered',
  },
  {
    id: 'pm-5',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Delivered',
  },
  {
    id: 'pm-6',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Delivered',
  },
  {
    id: 'pm-7',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Delivered',
  },
  {
    id: 'pm-8',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Delivered',
  },
  {
    id: 'pm-9',
    projectName: 'Green Villa Project',
    materialName: 'String Trimmer',
    required: '1 Unit',
    delivered: '1 Unit',
    status: 'Delivered',
  },
]

export const MATERIAL_OPTIONS = [
  { value: 'string-trimmer', label: 'String Trimmer' },
  { value: 'lawn-mower', label: 'Lawn Mower' },
  { value: 'hedge-trimmer', label: 'Hedge Trimmer' },
  { value: 'sprinkler-head', label: 'Sprinkler Head' },
  { value: 'pvc-pipe', label: 'PVC Pipe' },
]

export function getMaterialLabel(value: string): string {
  return MATERIAL_OPTIONS.find((o) => o.value === value)?.label ?? value
}

export const URGENCY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const PROJECT_OPTIONS = [
  { value: 'green-villa', label: 'Green Villa Project' },
  { value: 'riverside-park', label: 'Riverside Park' },
  { value: 'sunset-gardens', label: 'Sunset Gardens' },
]

export const TASK_OPTIONS = [
  { value: 'plant-trees', label: 'Plant 10 Plum Tree' },
  { value: 'install-pavers', label: 'Install Concrete Pavers' },
  { value: 'lawn-mowing', label: 'Lawn Mowing Section B' },
  { value: 'prune-hedges', label: 'Prune Hedges' },
]

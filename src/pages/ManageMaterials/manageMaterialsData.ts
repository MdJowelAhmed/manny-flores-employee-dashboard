export interface Material {
  id: string
  materialName: string
  category: string
  unit: string
  currentStock: number
  supplier: string
  costPrice: number
  projectRate: number
  assignedProject: string
  unitPrice: number
  minimumStock: number
  supplierEmail: string
  supplierContact: string
  lastPurchaseDate: string
  assignedProjects: string[]
}

export const mockMaterialsData: Material[] = [
  {
    id: 'mat-1',
    materialName: 'Topsoil',
    category: 'Soil',
    unit: 'bag',
    currentStock: 120,
    supplier: 'Agro Co.',
    costPrice: 5,
    projectRate: 10,
    assignedProject: 'Tree Planting Project',
    unitPrice: 12,
    minimumStock: 2,
    supplierEmail: 'agro@mail.com',
    supplierContact: '+2847 4387 2389',
    lastPurchaseDate: '10 Feb, 2025',
    assignedProjects: ['Westside Park Renovation', 'Tree Planting Project'],
  },
  {
    id: 'mat-2',
    materialName: 'Mulch',
    category: 'Soil',
    unit: 'bag',
    currentStock: 85,
    supplier: 'Landscape Supply',
    costPrice: 4,
    projectRate: 8,
    assignedProject: 'Garden Design',
    unitPrice: 8,
    minimumStock: 5,
    supplierEmail: 'landscape@mail.com',
    supplierContact: '+2847 4387 2390',
    lastPurchaseDate: '15 Jan, 2025',
    assignedProjects: ['Garden Design', 'Residential Backyard'],
  },
  {
    id: 'mat-3',
    materialName: 'Concrete Mix',
    category: 'Raw Material',
    unit: 'kg',
    currentStock: 500,
    supplier: 'BuildCo',
    costPrice: 0.15,
    projectRate: 0.25,
    assignedProject: 'Patio Installation',
    unitPrice: 0.2,
    minimumStock: 100,
    supplierEmail: 'buildco@mail.com',
    supplierContact: '+2847 4387 2400',
    lastPurchaseDate: '20 Feb, 2025',
    assignedProjects: ['Patio Installation', 'Westside Park Renovation'],
  },
]

export type DocumentStatus = 'pending' | 'approved' | 'rejected'

export interface DocumentEntry {
  id: string
  projectTitle: string
  category: string
  project: string
  uploadDate: string
  uploadedBy: string
  timeline: string
  status: DocumentStatus
  customer: string
  email: string
  company: string
  projectName: string
  startDate: string
  totalBudget: number
  amountSpent: number
  duration: string
  remaining: number
  description: string
}

export const mockDocumentStats = {
  totalDocuments: 248,
  pendingApproval: 7,
  approved: 215,
  rejected: 25,
}

export const mockDocumentsData: DocumentEntry[] = [
  {
    id: 'doc-1',
    projectTitle: 'Residential Backyard Renovation',
    category: 'Garden Design & Installation',
    project: 'Backyard Renovation',
    uploadDate: 'Feb 18, 2026',
    uploadedBy: 'John Davis',
    timeline: '8 weeks',
    status: 'pending',
    customer: 'John Smith',
    email: 'john.smith@email.com',
    company: 'Smith & Co',
    projectName: 'Residential Backyard Renovation',
    startDate: 'Feb 1, 2026',
    totalBudget: 45000,
    amountSpent: 28500,
    duration: '8 weeks',
    remaining: 16500,
    description:
      'Complete backyard renovation including new patio installation, landscaping with native plants, and a custom pergola. The project will transform the existing lawn into a modern outdoor living space with sustainable materials.',
  },
  {
    id: 'doc-2',
    projectTitle: 'Office Building Facade Upgrade',
    category: 'Commercial Renovation',
    project: 'Facade Upgrade',
    uploadDate: 'Feb 15, 2026',
    uploadedBy: 'Sarah Miller',
    timeline: '12 weeks',
    status: 'approved',
    customer: 'ABC Corp',
    email: 'contact@abccorp.com',
    company: 'ABC Corporation',
    projectName: 'Office Building Facade Upgrade',
    startDate: 'Jan 20, 2026',
    totalBudget: 125000,
    amountSpent: 45000,
    duration: '12 weeks',
    remaining: 80000,
    description: 'Modernization of the building exterior with energy-efficient windows and improved insulation.',
  },
  {
    id: 'doc-3',
    projectTitle: 'Kitchen Remodel – Downtown Apartment',
    category: 'Interior Renovation',
    project: 'Kitchen Remodel',
    uploadDate: 'Feb 12, 2026',
    uploadedBy: 'Mike Johnson',
    timeline: '4 weeks',
    status: 'approved',
    customer: 'Emily Brown',
    email: 'emily.brown@email.com',
    company: 'N/A',
    projectName: 'Kitchen Remodel – Downtown Apartment',
    startDate: 'Feb 5, 2026',
    totalBudget: 25000,
    amountSpent: 12000,
    duration: '4 weeks',
    remaining: 13000,
    description: 'Full kitchen renovation with custom cabinets and granite countertops.',
  },
  {
    id: 'doc-4',
    projectTitle: 'Warehouse Floor Coating',
    category: 'Industrial Maintenance',
    project: 'Floor Coating',
    uploadDate: 'Feb 10, 2026',
    uploadedBy: 'Tom Wilson',
    timeline: '2 weeks',
    status: 'rejected',
    customer: 'Logistics Inc',
    email: 'ops@logistics.com',
    company: 'Logistics Inc',
    projectName: 'Warehouse Floor Coating',
    startDate: 'Feb 8, 2026',
    totalBudget: 35000,
    amountSpent: 0,
    duration: '2 weeks',
    remaining: 35000,
    description: 'Epoxy floor coating for warehouse facility to improve durability.',
  },
]

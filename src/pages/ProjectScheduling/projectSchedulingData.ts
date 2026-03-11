export interface ScheduledProject {
  id: string
  scheduledDate: string // e.g. "Feb 19, 2026"
  projectTitle: string
  category: string
  project: string
  uploadDate: string
  uploadedBy: string
  team: string
  customer: string
  email: string
  company: string
}

export const mockScheduledProjects: ScheduledProject[] = [
  {
    id: 'sch-1',
    scheduledDate: 'Feb 19, 2026',
    projectTitle: 'Residential Backyard Renovation',
    category: 'Garden Design & Installation',
    project: 'Backyard Renovation',
    uploadDate: 'Feb 18, 2026',
    uploadedBy: 'John Davis',
    team: 'Team A',
    customer: 'John Davis',
    email: 'john@email.com',
    company: 'Garden Design & Installation',
  },
  {
    id: 'sch-2',
    scheduledDate: 'Feb 25, 2026',
    projectTitle: 'Green Villa Project',
    category: 'Green Garden',
    project: 'Green Villa Project',
    uploadDate: 'Feb 28, 2026',
    uploadedBy: 'Jhon Lura',
    team: 'Team B',
    customer: 'Jhon Lura',
    email: 'jhon@email.com',
    company: 'Green Villa Inc',
  },
  {
    id: 'sch-3',
    scheduledDate: 'Feb 25, 2026',
    projectTitle: 'Office Park Landscaping',
    category: 'Commercial Landscaping',
    project: 'Office Park',
    uploadDate: 'Feb 22, 2026',
    uploadedBy: 'Sarah Miller',
    team: 'Team A',
    customer: 'Sarah Miller',
    email: 'sarah@email.com',
    company: 'Office Park Corp',
  },
]

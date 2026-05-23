export type MyTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export type TaskPriority = 'High' | 'Medium' | 'Low'

export interface TaskMaterial {
  id: string
  name: string
  quantity: string
}

export interface MyTaskProject {
  id: string
  estimateId?: string
  invoiceWithSignaturesId?: string
  status?: string
  clientId?: string
  createdAt?: string
  updatedAt?: string
}

export interface MyTask {
  id: string
  projectId: string
  employeeId: string
  title: string
  taskStatus: MyTaskStatus
  date: string
  createdAt?: string
  updatedAt?: string
  project?: MyTaskProject
  // Optional UI-only fields (not provided by API yet, kept for forward-compat)
  priority?: TaskPriority
  location?: string
  description?: string
  instructions?: string[]
  materials?: TaskMaterial[]
}

export const TASK_STATUS_LABEL: Record<MyTaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

/** Derive a human-friendly project label from the API task. */
export function getProjectLabel(task: MyTask): string {
  const id = task.project?.id ?? task.projectId
  if (!id) return 'Project'
  return `Project #${id.slice(0, 8)}`
}

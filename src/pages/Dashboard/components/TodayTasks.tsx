import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import {
  CheckCircle2, Circle, Clock4, Loader2, X,
  CalendarDays, FolderKanban, Tag, ArrowUpRight, ListTodo,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'

// ── Types ──────────────────────────────────────────────────────────────────
interface Project {
  id: string
  status: string
  clientId: string
  createdAt: string
}

interface Task {
  id: string
  projectId: string
  employeeId: string
  title: string
  taskStatus: 'COMPLETED' | 'PENDING' | 'IN_PROGRESS' | string
  date: string
  createdAt: string
  updatedAt: string
  project: Project
}

interface TodayTasksProps {
  tasks: Task[]
  isLoading?: boolean
}

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
  label: string
  icon: React.ReactNode
  badge: string
  dot: string
}> = {
  COMPLETED: {
    label: 'Completed',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  PENDING: {
    label: 'Pending',
    icon: <Circle className="w-4 h-4 text-amber-500" />,
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
  },
}

const PROJECT_STATUS_CONFIG: Record<string, string> = {
  SCHEDULED: 'bg-violet-50 text-violet-700 border-violet-200',
  ACTIVE:    'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
}

function getStatus(key: string) {
  return STATUS_CONFIG[key] ?? {
    label: key,
    icon: <Circle className="w-4 h-4 text-gray-400" />,
    badge: 'bg-gray-50 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
  }
}

// ── Summary strip ──────────────────────────────────────────────────────────
function SummaryStrip({ tasks }: { tasks: Task[] }) {
  const total     = tasks.length
  const completed = tasks.filter(t => t.taskStatus === 'COMPLETED').length
  const inProg    = tasks.filter(t => t.taskStatus === 'IN_PROGRESS').length
  const pending   = tasks.filter(t => t.taskStatus === 'PENDING').length
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {[
        { label: 'Total',       value: total,     color: 'text-gray-700'    },
        { label: 'Completed',   value: completed, color: 'text-emerald-600' },
        { label: 'In Progress', value: inProg,    color: 'text-blue-600'    },
        { label: 'Pending',     value: pending,   color: 'text-amber-600'   },
      ].map(s => (
        <div key={s.label} className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">{s.label}</span>
          <span className={cn('font-bold', s.color)}>{s.value}</span>
        </div>
      ))}
      {total > 0 && (
        <div className="ml-auto flex items-center gap-2">
          <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
          <span className="text-xs font-medium text-emerald-600">{pct}%</span>
        </div>
      )}
    </div>
  )
}

// ── Task card ──────────────────────────────────────────────────────────────
function TaskCard({ task, index, onView }: { task: Task; index: number; onView: (t: Task) => void }) {
  const status = getStatus(task.taskStatus)
  const projectStatusStyle = PROJECT_STATUS_CONFIG[task.project?.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'
  const isCompleted = task.taskStatus === 'COMPLETED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.1 + index * 0.06 }}
      className={cn(
        'group relative flex items-start gap-3.5 p-4 rounded-xl border bg-white',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default',
        isCompleted ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100'
      )}
    >
      {/* Status icon */}
      <div className="mt-0.5 shrink-0">{status.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            'font-semibold text-sm text-gray-900 leading-snug',
            isCompleted && 'line-through text-gray-400'
          )}>
            {task.title}
          </p>
          {/* Status badge */}
          <span className={cn(
            'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
            status.badge
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
            {status.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="w-3 h-3" />
            {format(new Date(task.date), 'd MMM yyyy')}
          </span>
          {task.project?.status && (
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', projectStatusStyle)}>
              {task.project.status.charAt(0) + task.project.status.slice(1).toLowerCase()}
            </span>
          )}
        </div>
      </div>

      {/* View details button — appears on hover */}
      <button
        onClick={() => onView(task)}
        className={cn(
          'shrink-0 flex items-center gap-1 text-xs font-medium text-primary',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          'hover:underline'
        )}
      >
        Details <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

// ── Detail modal ───────────────────────────────────────────────────────────
function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const status = getStatus(task.taskStatus)
  const projectStatusStyle = PROJECT_STATUS_CONFIG[task.project?.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Task Details</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Title + status */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Task</p>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-gray-900 leading-snug">{task.title}</h2>
              <span className={cn(
                'shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                status.badge
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                {status.label}
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Details grid */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Details</p>

            {[
              {
                icon: <CalendarDays className="w-4 h-4 text-blue-500" />,
                label: 'Task Date',
                value: format(new Date(task.date), 'd MMMM, yyyy'),
                bg: 'bg-blue-50',
              },
              {
                icon: <Clock4 className="w-4 h-4 text-violet-500" />,
                label: 'Created',
                value: format(new Date(task.createdAt), 'd MMM yyyy, h:mm a'),
                bg: 'bg-violet-50',
              },
              {
                icon: <Clock4 className="w-4 h-4 text-amber-500" />,
                label: 'Last Updated',
                value: format(new Date(task.updatedAt), 'd MMM yyyy, h:mm a'),
                bg: 'bg-amber-50',
              },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', row.bg)}>
                  {row.icon}
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-xs font-medium text-gray-800">{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Project section */}
          {task.project && (
            <>
              <div className="h-px bg-gray-100" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Project
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-gray-900">Project Info</span>
                    </div>
                    {task.project.status && (
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', projectStatusStyle)}>
                        {task.project.status.charAt(0) + task.project.status.slice(1).toLowerCase()}
                      </span>
                    )}
                  </div>

                  {[
                    { label: 'Project ID', value: task.projectId, icon: <Tag className="w-3 h-3" /> },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        {row.icon} {row.label}
                      </span>
                      <span className="font-mono text-gray-600 truncate max-w-[180px]">{row.value}</span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Project Created</span>
                    <span className="text-gray-700 font-medium">
                      {format(new Date(task.project.createdAt), 'd MMM yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* IDs for reference */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-2 bg-gray-50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference IDs</p>
            {[
              { label: 'Task ID', value: task.id },
              { label: 'Employee ID', value: task.employeeId },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-mono text-gray-500 truncate max-w-[200px]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            className="w-full h-9 text-sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export function TodayTasks({ tasks = [], isLoading }: TodayTasksProps) {
  const { t } = useTranslation()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Card header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-base font-bold text-gray-900">{t('dashboard.todaysTask')}</h2>
            </div>
            <span className="text-xs text-muted-foreground bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1 font-medium">
              {format(new Date(), 'd MMM')}
            </span>
          </div>

          {/* Summary strip */}
          {!isLoading && tasks.length > 0 && <SummaryStrip tasks={tasks} />}
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-1">
                <CheckCircle2 className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-700">All clear!</p>
              <p className="text-xs text-muted-foreground">No tasks assigned for today.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={i}
                  onView={setSelectedTask}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail modal */}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  )
}
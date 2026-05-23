import { Calendar, CheckCircle2, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatDateDayMonth } from '@/utils/formatters'
import { parseISO } from 'date-fns'
import { getProjectLabel, type MyTask } from '../myTaskData'

interface TaskCardProps {
  task: MyTask
  onComplete: (task: MyTask) => void
  isCompleting?: boolean
}

const priorityClasses: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-gray-100 text-gray-700',
}

export function TaskCard({
  task,
  onComplete,
  isCompleting = false,
}: TaskCardProps) {
  const { t } = useTranslation()
  const isInProgress = task.taskStatus === 'IN_PROGRESS'
  const isCompleted = task.taskStatus === 'COMPLETED'

  const projectLabel = getProjectLabel(task)

  return (
    <Card className="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-accent">{projectLabel}</h3>
            {task.priority && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  priorityClasses[task.priority] ??
                    'bg-gray-100 text-gray-700'
                )}
              >
                {task.priority}
              </span>
            )}
          </div>
          {isInProgress && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 shrink-0">
              {t('myTask.inProgress')}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          <span className="font-medium text-foreground">
            {t('myTask.taskName')}{' '}
          </span>
          {task.title}
        </p>

        <div className="space-y-5 mb-3">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="bg-secondary-foreground p-1 rounded-full">
                <Calendar className="h-4 w-4 text-success shrink-0" />
              </div>
              <span className="font-medium text-foreground">
                {t('myTask.deadline')}{' '}
              </span>
            </div>
            <span>{formatDateDayMonth(parseISO(task.date))}</span>
          </div>

          {task.location && (
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="bg-secondary-foreground p-1 rounded-full">
                  <MapPin className="h-4 w-4 text-success shrink-0 mt-0.5" />
                </div>
                <span className="font-medium text-foreground">
                  {t('myTask.location')}{' '}
                </span>
              </div>
              <span>{task.location}</span>
            </div>
          )}
        </div>

        {task.description && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-1">
              {t('myTask.description')}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {task.description}
            </p>
          </div>
        )}

        <div className="flex">
          <Button
            size="sm"
            className={cn(
              'w-full rounded-lg gap-2',
              isCompleted
                ? 'bg-success/15 text-success hover:bg-success/15 cursor-default'
                : 'bg-primary text-white hover:bg-primary/90'
            )}
            onClick={() => !isCompleted && onComplete(task)}
            disabled={isCompleted || isCompleting}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isCompleted ? t('myTask.completed') : t('myTask.complete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { getStatus, PROJECT_STATUS_CONFIG, Task } from './TodayTasks';
import {
    CalendarDays, ListTodo, Clock4,
    FolderKanban, Tag,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';


export function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
    const status = getStatus(task.taskStatus)
    const projectStatusStyle =
        PROJECT_STATUS_CONFIG[task.project?.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden bg-white">
                {/* Header */}
                <DialogHeader className="flex-row items-center gap-2.5 px-5 py-4 border-b border-gray-100 space-y-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ListTodo className="w-4 h-4 text-primary" />
                    </div>
                    <DialogTitle className="text-sm font-semibold text-gray-900">Task Details</DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Title + status */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Task</p>
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="text-base font-bold text-gray-900 leading-snug">{task.title}</h2>
                            <span
                                className={cn(
                                    'shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                                    status.badge
                                )}
                            >
                                <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                                {status.label}
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Details */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            Details
                        </p>
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
                        ].map((row) => (
                            <div
                                key={row.label}
                                className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
                            >
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
                                            <span
                                                className={cn(
                                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                                    projectStatusStyle
                                                )}
                                            >
                                                {task.project.status.charAt(0) + task.project.status.slice(1).toLowerCase()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> Project ID
                                        </span>
                                        <span className="font-mono text-gray-600 truncate max-w-[180px]">{task.projectId}</span>
                                    </div>

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

                    {/* Reference IDs */}
                    <div className="rounded-xl border border-gray-100 p-4 space-y-2 bg-gray-50">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Reference IDs
                        </p>
                        {[
                            { label: 'Task ID', value: task.id },
                            { label: 'Employee ID', value: task.employeeId },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{row.label}</span>
                                <span className="font-mono text-gray-500 truncate max-w-[200px]">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="px-5 py-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full h-9 text-sm" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
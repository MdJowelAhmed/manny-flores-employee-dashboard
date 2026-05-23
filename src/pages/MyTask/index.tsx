import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pagination } from '@/components/common/Pagination'
import { TaskCard, TaskDetailsModal } from './components'
import type { MyTask, MyTaskStatus } from './myTaskData'
import { toast } from 'sonner'
import {
  useGetMyTasksQuery,
  useUpdateMyTaskStatusMutation,
} from '@/redux/api/myTaskApi'

export default function MyTask() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const itemsPerPage = parseInt(searchParams.get('limit') || '4', 10) || 4

  const [selectedTask, setSelectedTask] = useState<MyTask | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [modalShowForm, setModalShowForm] = useState(false)

  const { data, isLoading, isFetching } = useGetMyTasksQuery({
    page: currentPage,
    limit: itemsPerPage,
  })
  const [updateMyTaskStatus, { isLoading: isUpdating }] =
    useUpdateMyTaskStatusMutation()

  const tasks: MyTask[] = data?.data ?? []
  const totalItems = data?.meta?.total ?? tasks.length
  const totalPages = Math.max(
    1,
    data?.meta?.totalPages ?? Math.ceil(totalItems / itemsPerPage)
  )

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    p > 1 ? next.set('page', String(p)) : next.delete('page')
    setSearchParams(next, { replace: true })
  }

  const setLimit = (l: number) => {
    const next = new URLSearchParams(searchParams)
    l !== 4 ? next.set('limit', String(l)) : next.delete('limit')
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) setPage(1)
  }, [totalPages, currentPage])

  const handleViewDetails = (task: MyTask) => {
    setSelectedTask(task)
    setModalShowForm(false)
    setShowDetailsModal(true)
  }

  const handleStartOrCompleteClick = (task: MyTask) => {
    setSelectedTask(task)
    setModalShowForm(true)
    setShowDetailsModal(true)
  }

  const handleSubmitFromModal = async (
    task: MyTask,
    _data: { beforePhoto?: File; afterPhoto?: File; note?: string }
  ) => {
    const isPending = task.taskStatus === 'PENDING'
    const nextStatus: MyTaskStatus = isPending ? 'IN_PROGRESS' : 'COMPLETED'

    try {
      await updateMyTaskStatus({ id: task.id, taskStatus: nextStatus }).unwrap()
      setShowDetailsModal(false)
      setSelectedTask(null)
      toast.success(
        isPending ? t('myTask.taskStarted') : t('myTask.taskSubmitted')
      )
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        'Failed to update task status'
      toast.error(message)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-accent">
        {t('myTask.allTask')}
      </h1>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 rounded-xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-muted-foreground">
          No tasks found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={handleViewDetails}
              onStart={handleStartOrCompleteClick}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
        showItemsPerPage
      />

      <TaskDetailsModal
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        showForm={modalShowForm}
        onSubmit={handleSubmitFromModal}
        isSubmitting={isUpdating || isFetching}
      />
    </div>
  )
}

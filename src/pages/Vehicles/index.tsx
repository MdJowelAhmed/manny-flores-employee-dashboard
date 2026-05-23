import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { VehicleCard } from './components/VehicleCard'
import {
  RequestVehicleModal,
  type RequestVehiclePayload,
} from './components/RequestVehicleModal'
import type { RequestVehicle } from './vehiclesData'
import { toast } from '@/utils/toast'
import {
  useGetRequestVehiclesQuery,
  useCreateRequestVehicleMutation,
  useDeleteRequestVehicleMutation,
} from '@/redux/api/requestVehiclesApi'

export default function Vehicles() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const itemsPerPage = parseInt(searchParams.get('limit') || '9', 10) || 9

  const [showRequestModal, setShowRequestModal] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] =
    useState<RequestVehicle | null>(null)

  const { data, isLoading } = useGetRequestVehiclesQuery({
    page: currentPage,
    limit: itemsPerPage,
  })
  const [createRequestVehicle, { isLoading: isCreating }] =
    useCreateRequestVehicleMutation()
  const [deleteRequestVehicle, { isLoading: isDeleting }] =
    useDeleteRequestVehicleMutation()

  const vehicles: RequestVehicle[] = data?.data ?? []
  const pagination = data?.pagination ?? data?.meta
  const totalItems = pagination?.total ?? vehicles.length
  const totalPages = Math.max(
    1,
    pagination?.totalPage ??
      pagination?.totalPages ??
      Math.ceil(totalItems / itemsPerPage)
  )

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    p > 1 ? next.set('page', String(p)) : next.delete('page')
    setSearchParams(next, { replace: true })
  }

  const setLimit = (l: number) => {
    const next = new URLSearchParams(searchParams)
    l !== 9 ? next.set('limit', String(l)) : next.delete('limit')
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) setPage(1)
  }, [totalPages, currentPage])

  const handleRequestVehicle = async (payload: RequestVehiclePayload) => {
    try {
      await createRequestVehicle(payload).unwrap()
      setShowRequestModal(false)
      toast({
        title: t('vehicles.vehicleRequestSubmitted'),
        description: t('vehicles.vehicleRequestDescription'),
        variant: 'success',
      })
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        'Failed to submit vehicle request'
      toast({ title: message, variant: 'destructive' })
    }
  }

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return
    try {
      await deleteRequestVehicle(vehicleToDelete.id).unwrap()
      toast({
        title: 'Vehicle request deleted',
        description: `Request for “${vehicleToDelete.projectName}” was removed.`,
        variant: 'success',
      })
      setVehicleToDelete(null)
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        'Failed to delete vehicle request'
      toast({ title: message, variant: 'destructive' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-accent">
          {t('vehicles.title')}
        </h1>
        <Button
          onClick={() => setShowRequestModal(true)}
          className="bg-primary text-white shrink-0 hover:bg-primary/90"
        >
          {t('vehicles.requestVehicle')}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 rounded-xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-muted-foreground">
          No vehicle requests yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onDelete={setVehicleToDelete}
              isDeleting={isDeleting && vehicleToDelete?.id === vehicle.id}
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

      <RequestVehicleModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onRequest={handleRequestVehicle}
        isSubmitting={isCreating}
      />

      <ConfirmDialog
        open={!!vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete vehicle request"
        description={
          vehicleToDelete
            ? `Are you sure you want to delete the request for “${vehicleToDelete.projectName}”? This action cannot be undone.`
            : ''
        }
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { MaterialCard } from './components/MaterialCard'
import {
  RequestMaterialModal,
  type RequestMaterialPayload,
} from './components/RequestMaterialModal'
import type { RequestMaterial } from './materialsData'
import { toast } from '@/utils/toast'
import {
  useGetRequestMaterialsQuery,
  useCreateRequestMaterialMutation,
} from '@/redux/api/requestMaterialsApi'

export default function ManageMaterials() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const itemsPerPage = parseInt(searchParams.get('limit') || '9', 10) || 9

  const [showRequestModal, setShowRequestModal] = useState(false)

  const { data, isLoading } = useGetRequestMaterialsQuery({
    page: currentPage,
    limit: itemsPerPage,
  })
  const [createRequestMaterial, { isLoading: isCreating }] =
    useCreateRequestMaterialMutation()

  const materials: RequestMaterial[] = data?.data ?? []
  const meta = data?.meta ?? data?.pagination
  const totalItems = meta?.total ?? materials.length
  const totalPages = Math.max(
    1,
    meta?.totalPages ?? meta?.totalPage ?? Math.ceil(totalItems / itemsPerPage)
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

  const handleRequestMaterial = async (payload: RequestMaterialPayload) => {
    try {
      await createRequestMaterial(payload).unwrap()
      setShowRequestModal(false)
      toast({
        title: t('materials.requestSubmitted'),
        variant: 'success',
      })
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        'Failed to submit material request'
      toast({ title: message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-accent">
          {t('materials.trackProjectMaterials')}
        </h1>
        <Button
          onClick={() => setShowRequestModal(true)}
          className="bg-primary text-white shrink-0"
        >
          {t('materials.requestMaterial')}
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
      ) : materials.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-muted-foreground">
          No material requests yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
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

      <RequestMaterialModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onRequest={handleRequestMaterial}
        isSubmitting={isCreating}
      />
    </div>
  )
}

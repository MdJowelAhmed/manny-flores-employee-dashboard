import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pagination } from '@/components/common/Pagination'
import { EstimateItemCard } from './components/EstimateItemCard'
import { EstimateItemModal } from './components/EstimateItemModal'
import { MOCK_ESTIMATE_ITEMS, type EstimateListItem } from './estimateData'

export default function EstimatePage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const itemsPerPage = parseInt(searchParams.get('limit') || '6', 10) || 6

  const [items] = useState<EstimateListItem[]>(MOCK_ESTIMATE_ITEMS)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<EstimateListItem | null>(null)

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    p > 1 ? next.set('page', String(p)) : next.delete('page')
    setSearchParams(next, { replace: true })
  }

  const setLimit = (l: number) => {
    const next = new URLSearchParams(searchParams)
    l !== 6 ? next.set('limit', String(l)) : next.delete('limit')
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) setPage(1)
  }, [totalPages, currentPage])

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
  }, [items, currentPage, itemsPerPage])

  const openModal = (item: EstimateListItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('estimate.pageTitle')}</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {paginatedItems.map((item) => (
          <EstimateItemCard key={item.id} item={item} onAction={openModal} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
        showItemsPerPage
      />

      <EstimateItemModal open={modalOpen} onClose={closeModal} item={selectedItem} />
    </div>
  )
}

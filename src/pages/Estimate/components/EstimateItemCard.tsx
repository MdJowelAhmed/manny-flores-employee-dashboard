import { Calendar, MapPin, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { EstimateListItem } from '../estimateData'

interface EstimateItemCardProps {
  item: EstimateListItem
  onAction: (item: EstimateListItem) => void
}

export function EstimateItemCard({ item, onAction }: EstimateItemCardProps) {
  const { t } = useTranslation()
  const isReview = item.action === 'review'

  const metaRows = [
    {
      icon: Calendar,
      label: t('estimate.deadline'),
      value: `${item.deadlineFrom} ${t('estimate.dateRangeTo')} ${item.deadlineTo}`,
    },
    {
      icon: MapPin,
      label: t('estimate.location'),
      value: item.location,
    },
    {
      icon: Wallet,
      label: t('estimate.paymentMethod'),
      value: item.paymentMethod,
    },
  ]

  return (
    <Card
      className={cn(
        'rounded-2xl border border-gray-100 bg-white shadow-sm',
        'transition-shadow hover:shadow-md'
      )}
    >
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('estimate.companyName')}: {item.companyName}
        </p>

        <div className="mt-5 space-y-4">
          {metaRows.map((row) => (
            <div key={row.label} className="flex gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  'bg-emerald-50 text-emerald-600'
                )}
              >
                <row.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{row.label}</p>
                <p className="text-sm font-medium text-gray-800">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-500">{t('estimate.descriptionLabel')}</p>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className={cn(
            'mt-6 w-full rounded-xl border-2 border-primary text-primary',
            'bg-white hover:bg-primary hover:text-white'
          )}
          onClick={() => onAction(item)}
        >
          {isReview ? t('estimate.reviewRequest') : t('estimate.viewDetails')}
        </Button>
      </CardContent>
    </Card>
  )
}

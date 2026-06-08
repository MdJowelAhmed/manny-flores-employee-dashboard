import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatDateDayMonth } from '@/utils/formatters'
import { parseISO } from 'date-fns'
import {
  STATUS_CLASSES,
  STATUS_DOT_CLASSES,
  STATUS_LABEL,
  URGENCY_CLASSES,
  URGENCY_LABEL,
  type RequestMaterial,
} from '../materialsData'

interface MaterialCardProps {
  material: RequestMaterial
  onDelete: (material: RequestMaterial) => void
  isDeleting?: boolean
}

export function MaterialCard({
  material,
  onDelete,
  isDeleting = false,
}: MaterialCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              URGENCY_CLASSES[material.urgencyLevel]
            )}
          >
            {URGENCY_LABEL[material.urgencyLevel]}
          </span>
          <span
            className={cn(
              'h-2.5 w-2.5 shrink-0 rounded-full mt-1.5',
              STATUS_DOT_CLASSES[material.status]
            )}
            title={STATUS_LABEL[material.status]}
          />
        </div>

        <h3 className="font-bold text-accent mb-2">{material.materialName}</h3>

        {material.createdAt && (
          <p className="text-xs text-muted-foreground mb-3">
            {formatDateDayMonth(parseISO(material.createdAt))}
          </p>
        )}

        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>
            {t('materials.quantityNeeded')}{' '}
            <span className="font-medium text-black">
              {material.quantityNeeded}
            </span>
          </span>
        </div>

        {material.reason && (
          <div className="mb-4">
            <p className="text-xs font-medium text-black mb-1">
              {t('materials.reason')}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {material.reason}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <span
            className={cn(
              'inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium h-8',
              STATUS_CLASSES[material.status]
            )}
          >
            {STATUS_LABEL[material.status]}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0 h-8"
            onClick={() => onDelete(material)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t('common.delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

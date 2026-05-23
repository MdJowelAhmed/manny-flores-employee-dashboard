import { Trash2, Wrench } from 'lucide-react'
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
  type RequestEquipment,
} from '../equipmentData'

interface EquipmentCardProps {
  equipment: RequestEquipment
  onDelete: (equipment: RequestEquipment) => void
  isDeleting?: boolean
}

export function EquipmentCard({
  equipment,
  onDelete,
  isDeleting = false,
}: EquipmentCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-xl bg-white shadow-sm overflow-hidden border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              URGENCY_CLASSES[equipment.urgencyLevel]
            )}
          >
            {URGENCY_LABEL[equipment.urgencyLevel]}
          </span>
          <span
            className={cn(
              'h-2.5 w-2.5 shrink-0 rounded-full mt-1.5',
              STATUS_DOT_CLASSES[equipment.status]
            )}
            title={STATUS_LABEL[equipment.status]}
          />
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold text-accent pt-1 line-clamp-2">
            {equipment.equipmentName}
          </h3>
        </div>

        {equipment.reason && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-1">
              {t('equipment.reason')}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {equipment.reason}
            </p>
          </div>
        )}

        {equipment.createdAt && (
          <p className="text-xs text-muted-foreground mb-3">
            {formatDateDayMonth(parseISO(equipment.createdAt))}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <span
            className={cn(
              'inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium',
              STATUS_CLASSES[equipment.status]
            )}
          >
            {STATUS_LABEL[equipment.status]}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0 h-8"
            onClick={() => onDelete(equipment)}
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

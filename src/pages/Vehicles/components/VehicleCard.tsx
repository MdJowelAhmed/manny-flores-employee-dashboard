import { Trash2, Truck } from 'lucide-react'
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
  getVehicleTypeLabel,
  type RequestVehicle,
} from '../vehiclesData'

interface VehicleCardProps {
  vehicle: RequestVehicle
  onDelete: (vehicle: RequestVehicle) => void
  isDeleting?: boolean
}

export function VehicleCard({
  vehicle,
  onDelete,
  isDeleting = false,
}: VehicleCardProps) {
  const { t } = useTranslation()
  const vehicleTypeLabel = getVehicleTypeLabel(vehicle.vehicleType)

  return (
    <Card className="rounded-xl bg-white shadow-sm overflow-hidden border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm text-muted-foreground line-clamp-1">
            {vehicle.projectName}
          </p>
          <span
            className={cn(
              'h-2.5 w-2.5 shrink-0 rounded-full mt-1.5',
              STATUS_DOT_CLASSES[vehicle.status]
            )}
            title={STATUS_LABEL[vehicle.status]}
          />
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1 pt-0.5">
            <h3 className="font-bold text-accent">{vehicleTypeLabel}</h3>
            <span
              className={cn(
                'inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                URGENCY_CLASSES[vehicle.urgencyLevel]
              )}
            >
              {URGENCY_LABEL[vehicle.urgencyLevel]}
            </span>
          </div>
        </div>

        {vehicle.reason && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-1">
              {t('vehicles.reason')}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {vehicle.reason}
            </p>
          </div>
        )}

        {vehicle.createdAt && (
          <p className="text-xs text-muted-foreground mb-3">
            {formatDateDayMonth(parseISO(vehicle.createdAt))}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium',
              STATUS_CLASSES[vehicle.status]
            )}
          >
            {STATUS_LABEL[vehicle.status]}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0 h-8"
            onClick={() => onDelete(vehicle)}
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

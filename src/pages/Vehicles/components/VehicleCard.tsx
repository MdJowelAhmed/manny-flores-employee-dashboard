import { Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
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
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
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

        <div className="flex items-center justify-between gap-2 pt-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium',
              STATUS_CLASSES[vehicle.status]
            )}
          >
            {STATUS_LABEL[vehicle.status]}
          </span>
          {vehicle.createdAt && (
            <span className="text-xs text-muted-foreground">
              {formatDateDayMonth(parseISO(vehicle.createdAt))}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

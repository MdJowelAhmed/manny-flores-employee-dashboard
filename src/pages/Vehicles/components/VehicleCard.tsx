import { Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  VEHICLE_STATUS_CONFIG,
  type VehicleCardData,
} from '../vehiclesData'

interface VehicleCardProps {
  vehicle: VehicleCardData
  onReportIssue: (vehicle: VehicleCardData) => void
}

export function VehicleCard({ vehicle, onReportIssue }: VehicleCardProps) {
  const statusConfig = VEHICLE_STATUS_CONFIG[vehicle.status]

  return (
    <Card className="rounded-xl bg-white shadow-sm overflow-hidden border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm text-muted-foreground">{vehicle.projectName}</p>
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusConfig.dotColor} mt-1.5`}
            title={vehicle.status}
          />
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold text-accent pt-1">{vehicle.vehicleType}</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Plate: {vehicle.plate} • {vehicle.mileage}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">Last Service</p>
            <p className="font-medium text-foreground">{vehicle.lastService}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Service</p>
            <p className="font-medium text-foreground">{vehicle.nextService}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <span
            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium ${statusConfig.badgeClass}`}
          >
            {vehicle.status}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 shrink-0 h-8"
            onClick={() => onReportIssue(vehicle)}
          >
            Report Issue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormSelect, FormTextarea } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  VEHICLE_TYPE_OPTIONS,
  URGENCY_OPTIONS,
  type VehicleUrgencyLevel,
} from '../vehiclesData'

const requestVehicleSchema = z.object({
  vehicleType: z.string().min(1, 'Please select vehicle type'),
  projectName: z.string().min(1, 'Project name is required'),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Please select urgency level' }),
  }),
  reason: z.string().min(1, 'Reason is required'),
})

export type RequestVehicleFormData = z.infer<typeof requestVehicleSchema>

export interface RequestVehiclePayload {
  vehicleType: string
  projectName: string
  urgencyLevel: VehicleUrgencyLevel
  reason: string
}

interface RequestVehicleModalProps {
  open: boolean
  onClose: () => void
  onRequest: (data: RequestVehiclePayload) => void | Promise<void>
  isSubmitting?: boolean
}

const defaultFormValues: RequestVehicleFormData = {
  vehicleType: '',
  projectName: '',
  urgencyLevel: '' as VehicleUrgencyLevel,
  reason: '',
}

export function RequestVehicleModal({
  open,
  onClose,
  onRequest,
  isSubmitting = false,
}: RequestVehicleModalProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RequestVehicleFormData>({
    resolver: zodResolver(requestVehicleSchema),
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    if (open) {
      reset(defaultFormValues)
    }
  }, [open, reset])

  const handleFormSubmit = async (data: RequestVehicleFormData) => {
    await onRequest({
      vehicleType: data.vehicleType,
      projectName: data.projectName.trim(),
      urgencyLevel: data.urgencyLevel,
      reason: data.reason.trim(),
    })
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t('vehicles.requestVehicle')}
      size="lg"
      className="max-w-xl bg-white"
      footer={
        <Button
          type="submit"
          form="request-vehicle-form"
          className="w-full bg-primary text-white rounded-lg hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? '...' : t('vehicles.request')}
        </Button>
      }
    >
      <form
        id="request-vehicle-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <Controller
          name="vehicleType"
          control={control}
          render={({ field }) => (
            <FormSelect
              label={t('vehicles.vehicleType')}
              value={field.value}
              options={VEHICLE_TYPE_OPTIONS}
              onChange={field.onChange}
              placeholder={t('vehicles.selectVehicleType')}
              error={errors.vehicleType?.message}
              required
            />
          )}
        />
        <FormInput
          label={t('vehicles.projectName')}
          placeholder={t('vehicles.selectProject')}
          {...register('projectName')}
          error={errors.projectName?.message}
          required
        />
        <Controller
          name="urgencyLevel"
          control={control}
          render={({ field }) => (
            <FormSelect
              label={t('vehicles.urgencyLevel')}
              value={field.value}
              options={URGENCY_OPTIONS}
              onChange={field.onChange}
              placeholder={t('vehicles.selectUrgency')}
              error={errors.urgencyLevel?.message}
              required
            />
          )}
        />
        <FormTextarea
          label={t('vehicles.reason')}
          placeholder={t('vehicles.writeReason')}
          {...register('reason')}
          error={errors.reason?.message}
          className="min-h-[100px] resize-none bg-gray-50"
          required
        />
      </form>
    </ModalWrapper>
  )
}

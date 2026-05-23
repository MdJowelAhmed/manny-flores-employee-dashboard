import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormSelect, FormTextarea } from '@/components/common'
import { Button } from '@/components/ui/button'
import { URGENCY_OPTIONS, type EquipmentUrgencyLevel } from '../equipmentData'

const requestEquipmentSchema = z.object({
  equipmentName: z.string().min(1, 'Equipment name is required'),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Please select urgency level' }),
  }),
  reason: z.string().min(1, 'Reason is required'),
})

export type RequestEquipmentFormData = z.infer<typeof requestEquipmentSchema>

export interface RequestEquipmentPayload {
  equipmentName: string
  urgencyLevel: EquipmentUrgencyLevel
  reason: string
}

interface RequestEquipmentModalProps {
  open: boolean
  onClose: () => void
  onRequest: (data: RequestEquipmentPayload) => void | Promise<void>
  isSubmitting?: boolean
}

const defaultFormValues: RequestEquipmentFormData = {
  equipmentName: '',
  urgencyLevel: '' as EquipmentUrgencyLevel,
  reason: '',
}

export function RequestEquipmentModal({
  open,
  onClose,
  onRequest,
  isSubmitting = false,
}: RequestEquipmentModalProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RequestEquipmentFormData>({
    resolver: zodResolver(requestEquipmentSchema),
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    if (open) {
      reset(defaultFormValues)
    }
  }, [open, reset])

  const handleFormSubmit = async (data: RequestEquipmentFormData) => {
    await onRequest({
      equipmentName: data.equipmentName.trim(),
      urgencyLevel: data.urgencyLevel,
      reason: data.reason.trim(),
    })
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t('equipment.requestEquipmentTitle')}
      size="lg"
      className="max-w-xl bg-white"
      footer={
        <Button
          type="submit"
          form="request-equipment-form"
          className="w-full bg-primary text-white rounded-lg hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? '...' : t('equipment.request')}
        </Button>
      }
    >
      <form
        id="request-equipment-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormInput
          label={t('equipment.equipmentName')}
          placeholder={t('equipment.selectEquipmentName')}
          {...register('equipmentName')}
          error={errors.equipmentName?.message}
          required
        />
        <Controller
          name="urgencyLevel"
          control={control}
          render={({ field }) => (
            <FormSelect
              label={t('equipment.urgencyLevel')}
              value={field.value}
              options={URGENCY_OPTIONS}
              onChange={field.onChange}
              placeholder={t('equipment.selectUrgency')}
              error={errors.urgencyLevel?.message}
              required
            />
          )}
        />
        <FormTextarea
          label={t('equipment.reason')}
          placeholder={t('equipment.writeReason')}
          {...register('reason')}
          error={errors.reason?.message}
          className="min-h-[100px] resize-none bg-gray-50"
          required
        />
      </form>
    </ModalWrapper>
  )
}

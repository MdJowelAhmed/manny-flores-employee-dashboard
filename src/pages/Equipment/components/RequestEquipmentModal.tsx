import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormSelect, FormTextarea } from '@/components/common'
import { Button } from '@/components/ui/button'
import { URGENCY_OPTIONS, type EquipmentUrgencyLevel } from '../equipmentData'
import { useGetEquipmentQuery } from '@/redux/api/requestEquipmentApi'

const requestEquipmentSchema = z.object({
  equipmentId: z.string().min(1, 'Please select equipment'),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Please select urgency level' }),
  }),
  reason: z.string().min(1, 'Reason is required'),
})

export type RequestEquipmentFormData = z.infer<typeof requestEquipmentSchema>

export interface RequestEquipmentPayload {
  equipmentId: string
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
  equipmentId: '',
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
  const { data: equipmentRes, isLoading: isEquipmentLoading } = useGetEquipmentQuery(
    { page: 1, limit: 150 },
    { skip: !open }
  )

  const equipmentOptions = useMemo(
    () =>
      (equipmentRes?.data ?? [])
        .filter((item) => !item.isDeleted)
        .map((item) => ({
          value: item.id,
          label: item.equipmentName,
        })),
    [equipmentRes?.data]
  )

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
      equipmentId: data.equipmentId,
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
          disabled={isSubmitting || isEquipmentLoading}
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
        <Controller
          name="equipmentId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label={t('equipment.equipmentName')}
              value={field.value}
              options={equipmentOptions}
              onChange={field.onChange}
              placeholder={
                isEquipmentLoading
                  ? 'Loading equipment...'
                  : t('equipment.selectEquipmentName')
              }
              error={errors.equipmentId?.message}
              disabled={isEquipmentLoading}
              required
            />
          )}
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

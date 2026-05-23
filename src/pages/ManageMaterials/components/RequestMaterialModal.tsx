import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ModalWrapper, FormInput, FormSelect, FormTextarea } from '@/components/common'
import { Button } from '@/components/ui/button'
import { URGENCY_OPTIONS, type UrgencyLevel } from '../materialsData'

const requestMaterialSchema = z.object({
  materialName: z.string().min(1, 'Material name is required'),
  quantityNeeded: z
    .string()
    .min(1, 'Quantity is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: 'Quantity must be a positive number',
    }),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Please select urgency level' }),
  }),
  reason: z.string().min(1, 'Reason is required'),
})

export type RequestMaterialFormData = z.infer<typeof requestMaterialSchema>

export interface RequestMaterialPayload {
  materialName: string
  quantityNeeded: number
  urgencyLevel: UrgencyLevel
  reason: string
}

interface RequestMaterialModalProps {
  open: boolean
  onClose: () => void
  onRequest: (data: RequestMaterialPayload) => void | Promise<void>
  isSubmitting?: boolean
}

const defaultFormValues: RequestMaterialFormData = {
  materialName: '',
  quantityNeeded: '',
  urgencyLevel: '' as UrgencyLevel,
  reason: '',
}

export function RequestMaterialModal({
  open,
  onClose,
  onRequest,
  isSubmitting = false,
}: RequestMaterialModalProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RequestMaterialFormData>({
    resolver: zodResolver(requestMaterialSchema),
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    if (open) {
      reset(defaultFormValues)
    }
  }, [open, reset])

  const onSubmit = async (data: RequestMaterialFormData) => {
    await onRequest({
      materialName: data.materialName.trim(),
      quantityNeeded: Number(data.quantityNeeded),
      urgencyLevel: data.urgencyLevel,
      reason: data.reason.trim(),
    })
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t('materials.requestMaterial')}
      size="lg"
      className="max-w-3xl bg-white"
      footer={
        <Button
          type="submit"
          form="request-material-form"
          className="w-full bg-primary text-white rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? '...' : t('materials.request')}
        </Button>
      }
    >
      <form
        id="request-material-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('materials.materialName')}
            placeholder={t('materials.selectMaterial')}
            {...register('materialName')}
            error={errors.materialName?.message}
            required
          />
          <FormInput
            label={t('materials.quantityNeeded')}
            placeholder={t('materials.enterQuantity')}
            type="number"
            min={1}
            {...register('quantityNeeded')}
            error={errors.quantityNeeded?.message}
            required
          />
        </div>

        <Controller
          name="urgencyLevel"
          control={control}
          render={({ field }) => (
            <FormSelect
              label={t('materials.urgencyLevel')}
              value={field.value}
              options={URGENCY_OPTIONS}
              onChange={field.onChange}
              placeholder={t('materials.selectUrgency')}
              error={errors.urgencyLevel?.message}
              required
            />
          )}
        />

        <FormTextarea
          label={t('materials.reason')}
          placeholder={t('materials.writeReason')}
          {...register('reason')}
          error={errors.reason?.message}
          required
          className="min-h-[100px] resize-none"
        />
      </form>
    </ModalWrapper>
  )
}

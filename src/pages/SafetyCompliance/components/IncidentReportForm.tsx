import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormInput, FormSelect, FormTextarea } from '@/components/common/Form'
import { INCIDENT_TYPE_OPTIONS } from '../safetyComplianceData'
import { format } from 'date-fns'
import { toast } from '@/utils/toast'

const incidentReportSchema = z.object({
  dateTime: z.string(),
  location: z.string().min(1, 'Location is required'),
  involvedPerson: z.string().min(1, 'Involved person name is required'),
  witnessName: z.string().optional(),
  incidentType: z.string().min(1, 'Please select an incident type'),
  description: z.string().min(1, 'Description is required'),
})

type IncidentReportFormData = z.infer<typeof incidentReportSchema>

export function IncidentReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<IncidentReportFormData>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      dateTime: format(new Date(), 'MMM d, yyyy - h:mm a'),
      location: '',
      involvedPerson: '',
      witnessName: '',
      incidentType: '',
      description: '',
    },
  })

  const incidentType = watch('incidentType')

  const onSubmit = async (_data: IncidentReportFormData) => {
    setIsSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast({
        variant: 'success',
        title: 'Incident Report Submitted',
        description: 'Your incident report has been submitted successfully.',
      })
      reset({
        dateTime: format(new Date(), 'MMM d, yyyy - h:mm a'),
        location: '',
        involvedPerson: '',
        witnessName: '',
        incidentType: '',
        description: '',
      })
    } catch {
      toast({ title: 'Submission failed', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-foreground">Logistics</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Date & Time <span className="text-muted-foreground text-xs">(auto filled)</span>
            </label>
            <input
              {...register('dateTime')}
              readOnly
              className="flex h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-muted-foreground"
            />
          </div>
          <FormInput
            label="Location"
            placeholder="Enter location"
            error={errors.location?.message}
            {...register('location')}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-foreground">People Involved</h3>
        <div className="space-y-4">
          <FormInput
            label="Involved Person"
            placeholder="Full Name"
            error={errors.involvedPerson?.message}
            {...register('involvedPerson')}
            className="rounded-lg"
          />
          <FormInput
            label="Witness Name"
            placeholder="Full name (optional)"
            error={errors.witnessName?.message}
            {...register('witnessName')}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-foreground">Incident Details</h3>
        <div className="space-y-4">
          <FormSelect
            label="Incident Type"
            value={incidentType}
            onChange={(v) => setValue('incidentType', v)}
            options={INCIDENT_TYPE_OPTIONS}
            placeholder="select"
            error={errors.incidentType?.message}
          />
          <FormTextarea
            label="Description"
            placeholder="Describe exactly what happened..."
            error={errors.description?.message}
            {...register('description')}
            className="min-h-[120px] rounded-lg"
            rows={5}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium rounded-lg h-12 text-base"
        disabled={isSubmitting}
        isLoading={isSubmitting}
      >
        Submit
      </Button>
    </form>
  )
}

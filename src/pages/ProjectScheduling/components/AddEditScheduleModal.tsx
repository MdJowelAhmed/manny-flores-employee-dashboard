import { useState, useEffect } from 'react'
import { ModalWrapper } from '@/components/common'
import { FormInput, DatePicker } from '@/components/common/Form'
import { Button } from '@/components/ui/button'
import type { ScheduledProject } from '../projectSchedulingData'
import { toast } from '@/utils/toast'
import { parseFlexibleDate, formatDateDisplay } from '@/utils/formatters'

interface AddEditScheduleModalProps {
  open: boolean
  onClose: () => void
  schedule: ScheduledProject | null
  onSave: (data: Partial<ScheduledProject>) => void
}

export function AddEditScheduleModal({
  open,
  onClose,
  schedule,
  onSave,
}: AddEditScheduleModalProps) {
  const isEdit = !!schedule?.id

  const [projectName, setProjectName] = useState('')
  const [uploadDate, setUploadDate] = useState<Date | undefined>(undefined)
  const [uploadedBy, setUploadedBy] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [team, setTeam] = useState('')

  useEffect(() => {
    if (schedule) {
      setProjectName(schedule.projectTitle)
      setUploadDate(parseFlexibleDate(schedule.uploadDate) ?? undefined)
      setUploadedBy(schedule.uploadedBy)
      setEmail(schedule.email)
      setCompany(schedule.company)
      setTeam(schedule.team)
    } else {
      setProjectName('')
      setUploadDate(undefined)
      setUploadedBy('')
      setEmail('')
      setCompany('')
      setTeam('')
    }
  }, [schedule, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: schedule?.id,
      projectTitle: projectName.trim(),
      uploadDate: uploadDate ? formatDateDisplay(uploadDate) : '',
      uploadedBy: uploadedBy.trim(),
      email: email.trim(),
      company: company.trim(),
      team: team.trim(),
    })
    toast({
      title: 'Success',
      description: isEdit ? 'Schedule updated successfully.' : 'Schedule added successfully.',
      variant: 'success',
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Schedule' : 'Add New Schedule'}
      size="lg"
      className="max-w-xl bg-white"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Project Name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <DatePicker
              label="Upload Date"
              value={uploadDate}
              onChange={setUploadDate}
            />
            <FormInput
              label="Upload by"
              placeholder="Enter name"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
            />
            <FormInput
              label="Email"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
              label="Company"
              placeholder="Enter company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <FormInput
              label="Team"
              placeholder="e.g. Team A"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
            Save
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}


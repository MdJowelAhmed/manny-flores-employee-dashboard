import { useState, useEffect } from 'react'
import { ModalWrapper } from '@/components/common'
import { FormInput, DatePicker } from '@/components/common/Form'
import { Button } from '@/components/ui/button'
import type { CustomerProject } from '@/types'
import { toast } from '@/utils/toast'
import { parseFlexibleDate, formatDateForInput } from '@/utils/formatters'

interface AddProjectModalProps {
  open: boolean
  onClose: () => void
  project: CustomerProject | null
  onSave: (data: Omit<CustomerProject, 'id'>) => void
}

export function AddProjectModal({
  open,
  onClose,
  project,
  onSave,
}: AddProjectModalProps) {
  const isEdit = !!project?.id

  const [customerName, setCustomerName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDate, setProjectDate] = useState<Date | undefined>(undefined)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (project) {
      setCustomerName(project.customerName)
      setProjectName(project.project)
      setProjectDate(parseFlexibleDate(project.projectDate) ?? undefined)
      setAmount(String(project.amount))
    } else {
      setCustomerName('')
      setProjectName('')
      setProjectDate(undefined)
      setAmount('')
    }
  }, [project, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !projectName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Customer Name and Project are required.',
        variant: 'destructive',
      })
      return
    }

    onSave({
      customerName: customerName.trim(),
      project: projectName.trim(),
      projectDate: projectDate ? formatDateForInput(projectDate) : '',
      amount: parseFloat(amount) || 0,
    })
    toast({
      title: 'Success',
      description: isEdit ? 'Project updated successfully.' : 'Project added successfully.',
      variant: 'success',
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit project' : 'Add project'}
      size="lg"
      className="max-w-2xl bg-white"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Customer Name"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <FormInput
            label="Project"
            placeholder="Enter project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <DatePicker
            label="Project dates"
            value={projectDate}
            onChange={setProjectDate}
            placeholder="Pick a date"
          />
          <FormInput
            label="Amount"
            placeholder="Enter amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          {/* <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button> */}
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
            {isEdit ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

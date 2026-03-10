import { useState, useEffect } from 'react'
import { ModalWrapper } from '@/components/common'
import { FormInput } from '@/components/common/Form'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import type { CustomerProject } from '@/types'
import { toast } from '@/utils/toast'

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
  const [customerName, setCustomerName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDate, setProjectDate] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (project) {
      setCustomerName(project.customerName)
      setProjectName(project.project)
      setProjectDate(project.projectDate)
      setAmount(String(project.amount))
    } else {
      setCustomerName('')
      setProjectName('')
      setProjectDate('')
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
      projectDate: projectDate.trim() || '',
      amount: parseFloat(amount) || 0,
    })
    toast({
      title: 'Success',
      description: 'Project added successfully.',
      variant: 'success',
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Add project"
      size="lg"
      className="max-w-lg bg-white"
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
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Project dates</label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                className="flex h-11 w-full rounded-sm border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <FormInput
            label="Amount"
            placeholder="Enter amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
            Submit
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

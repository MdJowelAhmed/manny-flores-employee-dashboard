import { ModalWrapper } from '@/components/common'
import type { CustomerProject } from '@/types'
import { formatCurrency } from '@/utils/formatters'

interface ViewProjectDetailsModalProps {
  open: boolean
  onClose: () => void
  project: CustomerProject | null
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

export function ViewProjectDetailsModal({
  open,
  onClose,
  project,
}: ViewProjectDetailsModalProps) {
  if (!project) return null

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`Project #${project.id}`}
      size="md"
      className="max-w-xl bg-white"
    >
      <div className="space-y-3">
        <DetailRow label="ID" value={`#${project.id}`} />
        <DetailRow label="Customer Name" value={project.customerName} />
        <DetailRow label="Project" value={project.project} />
        <DetailRow label="Amount" value={formatCurrency(project.amount, 'EUR')} />
        <DetailRow label="Project dates" value={project.projectDate} />
      </div>

      {/* <div className="flex justify-end pt-6 border-t mt-6">
        <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-white">
          Close
        </Button>
      </div> */}
    </ModalWrapper>
  )
}

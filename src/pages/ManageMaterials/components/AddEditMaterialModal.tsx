import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { ModalWrapper } from '@/components/common'
import { FormInput } from '@/components/common/Form'
import { Button } from '@/components/ui/button'
import type { Material } from '../manageMaterialsData'
import { toast } from '@/utils/toast'

interface AddEditMaterialModalProps {
  open: boolean
  onClose: () => void
  material: Material | null
  onSave: (data: Partial<Material>) => void
}

export function AddEditMaterialModal({
  open,
  onClose,
  material,
  onSave,
}: AddEditMaterialModalProps) {
  const isEdit = !!material?.id

  const [materialName, setMaterialName] = useState('')
  const [category, setCategory] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [currentStock, setCurrentStock] = useState('')
  const [minimumStock, setMinimumStock] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [supplierContact, setSupplierContact] = useState('')
  const [lastPurchaseDate, setLastPurchaseDate] = useState('')

  useEffect(() => {
    if (material) {
      setMaterialName(material.materialName)
      setCategory(material.category)
      setUnitPrice(String(material.unitPrice ?? material.costPrice))
      setCurrentStock(String(material.currentStock))
      setMinimumStock(String(material.minimumStock ?? 0))
      setSupplierName(material.supplier)
      setSupplierEmail(material.supplierEmail)
      setSupplierContact(material.supplierContact)
      setLastPurchaseDate(formatToInput(material.lastPurchaseDate))
    } else {
      setMaterialName('')
      setCategory('')
      setUnitPrice('')
      setCurrentStock('')
      setMinimumStock('')
      setSupplierName('')
      setSupplierEmail('')
      setSupplierContact('')
      setLastPurchaseDate('')
    }
  }, [material, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cost = parseFloat(unitPrice) || 0
    const stock = parseInt(currentStock, 10) || 0
    const minStock = parseInt(minimumStock, 10) || 0
    onSave({
      id: material?.id,
      materialName: materialName.trim(),
      category: category.trim(),
      unitPrice: cost,
      costPrice: cost,
      projectRate: cost * 2,
      currentStock: stock,
      minimumStock: minStock,
      supplier: supplierName.trim(),
      supplierEmail: supplierEmail.trim(),
      supplierContact: supplierContact.trim(),
      lastPurchaseDate: formatFromInput(lastPurchaseDate),
      unit: material?.unit ?? 'unit',
      assignedProject: material?.assignedProject ?? '',
      assignedProjects: material?.assignedProjects ?? [],
    })
    toast({
      title: 'Success',
      description: isEdit ? 'Material updated successfully.' : 'Material added successfully.',
      variant: 'success',
    })
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Material' : 'Add Material'}
      size="lg"
      className="max-w-xl bg-white"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Information */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Material Name"
              placeholder="e.g. Topsoil"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              required
            />
            <FormInput
              label="Category"
              placeholder="e.g. Raw Material"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        {/* Price & Rate */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Price & Rate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Unit Price"
              placeholder="e.g. $12"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              type="text"
            />
            <FormInput
              label="Current Stock"
              placeholder="e.g. 10"
              value={currentStock}
              onChange={(e) => setCurrentStock(e.target.value)}
              type="number"
            />
            <FormInput
              label="Minimum Stock"
              placeholder="e.g. 2"
              value={minimumStock}
              onChange={(e) => setMinimumStock(e.target.value)}
              type="number"
            />
          </div>
        </div>

        {/* Supplier Details */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Supplier Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name"
              placeholder="e.g. Agro Co."
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
            <FormInput
              label="Email"
              placeholder="e.g. agro@mail.com"
              type="email"
              value={supplierEmail}
              onChange={(e) => setSupplierEmail(e.target.value)}
            />
            <FormInput
              label="Contact"
              placeholder="e.g. +2847 4387 2389"
              value={supplierContact}
              onChange={(e) => setSupplierContact(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last Purchase Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={lastPurchaseDate}
                  onChange={(e) => setLastPurchaseDate(e.target.value)}
                  className="flex h-11 w-full rounded-sm border border-input bg-background px-3 py-2 pl-9 text-sm"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

function formatToInput(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr.replace(/(\d+)\s+(\w+),\s*(\d+)/, '$2 $1 $3'))
    if (isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

function formatFromInput(isoDate: string): string {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  const day = d.getDate()
  const month = d.toLocaleString('default', { month: 'short' })
  const year = d.getFullYear()
  return `${day} ${month}, ${year}`
}

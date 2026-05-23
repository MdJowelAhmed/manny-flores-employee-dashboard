import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Download, Wallet, Clock, TrendingUp, CalendarDays,
  BadgeCheck, Hourglass, ArrowUpRight,
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { formatCurrency } from '@/utils/formatters'
import { toast } from '@/utils/toast'
import { useGetPayrollDataQuery } from '@/redux/slices/employee/payrollApi'
import Spinner from '@/components/common/Spinner'
import { cn } from '@/utils/cn'

// ── Helpers ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function monthLabel(m: number, y: number) {
  return `${MONTH_NAMES[m] ?? m} ${y}`
}

const PAY_TYPE_META: Record<string, { label: string; color: string }> = {
  MONTHLY: { label: 'Monthly', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  WEEKLY: { label: 'Weekly', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  PROJECT_BASED: { label: 'Project Based', color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

// ── Summary card ───────────────────────────────────────────────────────────
interface SummaryCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  accent: string
  delay?: number
}

function SummaryCard({ icon, label, value, sub, accent, delay = 0 }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3.5"
    >
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', accent)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const paid = status === 'PAID'
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      paid
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', paid ? 'bg-emerald-500' : 'bg-amber-400')} />
      {paid ? 'Paid' : 'Pending'}
    </span>
  )
}

// ── Pay type badge ─────────────────────────────────────────────────────────
function PayTypeBadge({ type }: { type: string }) {
  const meta = PAY_TYPE_META[type] ?? { label: type, color: 'bg-gray-50 text-gray-600 border-gray-200' }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', meta.color)}>
      {meta.label}
    </span>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Payroll() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const itemsPerPage = parseInt(searchParams.get('limit') || '10', 10) || 10

  const { data: payrollData, isLoading } = useGetPayrollDataQuery({
    page: currentPage,
    limit: itemsPerPage,
  })

  const records = payrollData?.data ?? []
  const pagination = payrollData?.pagination
  const totalItems = pagination?.total ?? records.length
  const totalPages = pagination?.totalPage ?? Math.max(1, Math.ceil(totalItems / itemsPerPage))

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    p > 1 ? next.set('page', String(p)) : next.delete('page')
    setSearchParams(next, { replace: true })
  }

  const setLimit = (l: number) => {
    const next = new URLSearchParams(searchParams)
    l !== 10 ? next.set('limit', String(l)) : next.delete('limit')
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

  // ── Summary stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalSalary = records.reduce((s: number, r: any) => s + (r.finalSalary ?? 0), 0)
    const totalOvertime = records.reduce((s: number, r: any) => s + (r.overTimeAmount ?? 0), 0)
    const totalOTHours = records.reduce((s: number, r: any) => s + (r.overTimeHours ?? 0), 0)
    const paidCount = records.filter((r: any) => r.paymentTypeStatus === 'PAID').length
    return { totalSalary, totalOvertime, totalOTHours, paidCount }
  }, [records])

  // ── PDF export ───────────────────────────────────────────────────────────
  const handleDownload = () => {
    try {
      const doc = new jsPDF()
      doc.setFontSize(20)
      doc.text('Payment History', 105, 20, { align: 'center' })
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        105, 28, { align: 'center' }
      )
      doc.setTextColor(0, 0, 0)

      autoTable(doc, {
        startY: 38,
        head: [['Period', 'Pay Type', 'Salary', 'Overtime (hrs)', 'OT Amount', 'Final Salary', 'Status']],
        body: records.map((r: any) => [
          monthLabel(r.month, r.year),
          PAY_TYPE_META[r.payType]?.label ?? r.payType,
          formatCurrency(r.salary),
          String(r.overTimeHours),
          formatCurrency(r.overTimeAmount),
          formatCurrency(r.finalSalary),
          r.paymentTypeStatus === 'PAID' ? 'Paid' : 'Pending',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94], textColor: '#fff', fontStyle: 'bold', fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 4 },
      })

      doc.save(`payslips-${new Date().toISOString().slice(0, 10)}.pdf`)
      toast({ title: 'Downloaded', description: `${records.length} records exported.`, variant: 'success' })
    } catch {
      toast({ title: 'Download failed', description: 'Could not generate PDF.', variant: 'destructive' })
    }
  }

  if (isLoading) return <Spinner />

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('payroll.paymentHistory')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track your salary, overtime, and payment records
          </p>
        </div>
        <Button
          onClick={handleDownload}
          className="bg-primary text-white hover:bg-primary/90 gap-2 shrink-0 h-9 px-4 text-sm rounded-lg"
        >
          <Download className="h-4 w-4" />
          {t('payroll.downloadPayslip')}
        </Button>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          icon={<Wallet className="w-5 h-5 text-emerald-600" />}
          label="Total Earned"
          value={formatCurrency(stats.totalSalary)}
          sub={`${records.length} payroll record${records.length !== 1 ? 's' : ''}`}
          accent="bg-emerald-50"
          delay={0}
        />
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          label="Overtime Pay"
          value={formatCurrency(stats.totalOvertime)}
          sub={`${stats.totalOTHours} hours total`}
          accent="bg-blue-50"
          delay={0.05}
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-violet-600" />}
          label="Overtime Hours"
          value={`${stats.totalOTHours} hrs`}
          accent="bg-violet-50"
          delay={0.1}
        />
        <SummaryCard
          icon={<BadgeCheck className="w-5 h-5 text-amber-600" />}
          label="Paid Records"
          value={`${stats.paidCount} / ${records.length}`}
          sub={records.length - stats.paidCount > 0 ? `${records.length - stats.paidCount} pending` : 'All cleared'}
          accent="bg-amber-50"
          delay={0.15}
        />
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Period
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Pay Type
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Base Salary
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Overtime
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Final Salary
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarDays className="w-8 h-8 text-gray-200" />
                      <p className="text-sm text-muted-foreground">No payroll records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((r: any, i: number) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 + i * 0.04 }}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Period */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                          <CalendarDays className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{monthLabel(r.month, r.year)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pay type */}
                    <td className="px-5 py-3.5">
                      <PayTypeBadge type={r.payType} />
                    </td>

                    {/* Base salary */}
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{formatCurrency(r.salary)}</p>
                      {r.hourlyRate > 0 && (
                        <p className="text-xs text-muted-foreground">{formatCurrency(r.hourlyRate)}/hr</p>
                      )}
                    </td>

                    {/* Overtime */}
                    <td className="px-5 py-3.5">
                      {r.overTimeHours > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Hourglass className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">{formatCurrency(r.overTimeAmount)}</p>
                            <p className="text-xs text-muted-foreground">{r.overTimeHours} hrs</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Final salary */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-gray-900">{formatCurrency(r.finalSalary)}</p>
                        {r.overTimeAmount > 0 && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={r.paymentTypeStatus} />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="border-t border-gray-100 px-5 py-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onItemsPerPageChange={setLimit}
              showItemsPerPage
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
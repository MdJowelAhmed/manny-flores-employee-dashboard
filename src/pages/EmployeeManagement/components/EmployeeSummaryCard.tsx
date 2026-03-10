import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface EmployeeSummaryCardProps {
  title: string
  value: number
  icon: React.ElementType
  iconBgColor: string
  iconColor: string
  index?: number
}

export function EmployeeSummaryCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  index = 0,
}: EmployeeSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl px-6 py-8 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mt-1">{value}</h3>
        </div>
        <div className={cn('p-3 rounded-lg', iconBgColor)}>
          <Icon className={cn('h-8 w-8', iconColor)} />
        </div>
      </div>
    </motion.div>
  )
}

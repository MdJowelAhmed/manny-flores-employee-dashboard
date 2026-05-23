import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface DashboardStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  index?: number
  badge?: string
  badgeColor?: string
}

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  index = 0,
  badge,
  badgeColor = 'bg-slate-100 text-slate-500',
}: DashboardStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group cursor-default"
    >
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          {badge && (
            <span className={cn('text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full', badgeColor)}>
              {badge}
            </span>
          )}
        </div>

        {/* Value */}
        <p className="text-2xl font-bold text-slate-800 leading-none tracking-tight mb-1">
          {value}
        </p>

        {/* Title */}
        <p className="text-sm font-medium text-slate-500">{title}</p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 leading-snug">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
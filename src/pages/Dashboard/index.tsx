import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapPin, Sunrise, Sunset, Timer } from 'lucide-react'
import { DashboardQuickAction, TodayTasks } from './components'
import { useGetMyProfileQuery } from '@/redux/api/authApi'
import {
  useGetOverviewHeaderQuery,
  useGetTasksQuery,
} from '@/redux/slices/employee/dashboardApi'

function TimeChip({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { data: userRes }          = useGetMyProfileQuery()
  const { data: overviewHeaderRes } = useGetOverviewHeaderQuery({})
  const { data: getTasksRes, isLoading: tasksLoading } = useGetTasksQuery({})

  const attendance = overviewHeaderRes?.data?.attendanceTime
  console.log(attendance)

  const checkIn = overviewHeaderRes?.data?.attendanceTime?.checkInTime
  ? format(new Date(overviewHeaderRes.data.attendanceTime.checkInTime), 'h:mm a')
  : '—'
  const checkOut = overviewHeaderRes?.data?.attendanceTime?.checkOutTime
    ? format(new Date(overviewHeaderRes.data.attendanceTime.checkOutTime), 'h:mm a')
    : '—'
  const workingHours = attendance?.workingHours ?? '—'

  return (
    <div className="space-y-5">
      {/* ── Welcome banner ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm"
      >
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/6 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-500/6 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 p-5">
          {/* Greeting */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg select-none">
              {userRes?.data?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {format(new Date(), 'd MMMM, yyyy')}
              </p>
              <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                {t('dashboard.welcome')},{' '}
                <span className="text-primary">{userRes?.data?.name ?? '—'}</span> 👋
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Here's what's happening with your work today.
              </p>
            </div>
          </div>

          {/* Time chips */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 bg-gray-50 rounded-xl px-5 py-3.5 border border-gray-100">
            <TimeChip
              icon={<Sunrise className="w-4 h-4 text-emerald-600" />}
              label={t('dashboard.checkIn')}
              value={checkIn}
              accent="bg-emerald-50"
            />
            <div className="hidden sm:block h-8 w-px bg-gray-200" />
            <TimeChip
              icon={<Sunset className="w-4 h-4 text-amber-500" />}
              label={t('dashboard.checkOut')}
              value={checkOut}
              accent="bg-amber-50"
            />
            <div className="hidden sm:block h-8 w-px bg-gray-200" />
            <TimeChip
              icon={<Timer className="w-4 h-4 text-blue-500" />}
              label={t('dashboard.todayWorkingPeriod')}
              value={workingHours}
              accent="bg-blue-50"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Quick action stat cards ────────────────────────────────────── */}
      <DashboardQuickAction />

      {/* ── Today's tasks ─────────────────────────────────────────────── */}
      <TodayTasks tasks={getTasksRes?.data ?? []} isLoading={tasksLoading} />
    </div>
  )
}
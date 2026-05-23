import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ClipboardList, Clock, FolderKanban, Timer } from 'lucide-react'
import { DashboardStatCard } from './DashboardStatCard'
import { useGetQuickActionsQuery } from '@/redux/slices/employee/dashboardApi'

function formatCheckIn(isoString: string | null): string {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getAttendanceSubtitle(attendance: {
  checkInTime: string | null
  checkOutTime: string | null
  workingHours: number
}): string {
  if (!attendance?.checkInTime) return 'Not checked in yet'
  const checkIn = formatCheckIn(attendance.checkInTime)
  if (!attendance.checkOutTime) return `Checked in at ${checkIn}`
  return `${attendance.workingHours}h worked today`
}

function getAttendanceValue(attendance: {
  checkInTime: string | null
  checkOutTime: string | null
  workingHours: number
}): string {
  if (!attendance?.checkInTime) return 'Absent'
  if (!attendance?.checkOutTime) return 'Active'
  return `${attendance.workingHours}h`
}

export function DashboardQuickAction() {
  const { t } = useTranslation()
  const { data: quickActionsRes } = useGetQuickActionsQuery({})

  const attendance = quickActionsRes?.data?.todayAttendance
  const pendingCount = quickActionsRes?.data?.pendingTaskCount ?? 0

  const quickActionCardsConfig = useMemo(
    () => [
      {
        title: t('dashboard.todaysTasks'),
        value: quickActionsRes?.data?.todayTaskCount ?? '—',
        subtitle: 'Scheduled for today',
        icon: ClipboardList,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        badge: 'Today',
        badgeColor: 'bg-blue-50 text-blue-400',
      },
      {
        title: t('dashboard.pendingTasks'),
        value: pendingCount,
        subtitle: pendingCount > 10 ? 'Needs attention' : 'Looking good',
        icon: Clock,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        badge: pendingCount > 10 ? 'High' : undefined,
        badgeColor: 'bg-amber-50 text-amber-400',
      },
      {
        title: t('dashboard.attendance'),
        value: attendance ? getAttendanceValue(attendance) : '—',
        subtitle: attendance ? getAttendanceSubtitle(attendance) : 'No data',
        icon: Timer,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
        badge: attendance?.checkInTime ? 'Present' : undefined,
        badgeColor: 'bg-emerald-50 text-emerald-500',
      },
      {
        title: t('dashboard.assignedProjects'),
        value: quickActionsRes?.data?.assignedProjectCount ?? '—',
        subtitle: 'Active projects',
        icon: FolderKanban,
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-500',
        badge: 'Projects',
        badgeColor: 'bg-violet-50 text-violet-400',
      },
    ],
    [t, quickActionsRes, attendance, pendingCount]
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-accent">{t('dashboard.quickAction')}</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActionCardsConfig.map((item, index) => (
          <DashboardStatCard key={item.title} {...item} index={index} />
        ))}
      </div>
    </div>
  )
}
import { useMemo, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import {
  createEmptyDaySession,
  getLocalDateKey,
  mockAttendanceRecords,
  type AttendanceRecord,
  type AttendanceDaySession,
} from './attendanceData'
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'

function formatDurationMs(ms: number) {
  if (ms < 0) ms = 0
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h} hr ${m} min`
}

function formatTimeLabel(iso: string) {
  return format(parseISO(iso), 'hh:mm a')
}

function buildTodayRecord(
  session: AttendanceDaySession,
  dateLabel: string,
  nowMs: number
): AttendanceRecord {
  const { checkInIso, checkOutIso } = session
  if (!checkInIso) {
    return {
      id: `today-${session.workDate}`,
      date: dateLabel,
      checkIn: '--:--',
      checkOut: '--:--',
      workHour: '--:--',
      attendance: 'Absent',
    }
  }

  const checkInStr = formatTimeLabel(checkInIso)
  if (!checkOutIso) {
    const elapsed = nowMs - parseISO(checkInIso).getTime()
    return {
      id: `today-${session.workDate}`,
      date: dateLabel,
      checkIn: checkInStr,
      checkOut: '--:--',
      workHour: formatDurationMs(elapsed),
      attendance: 'Present',
    }
  }

  const checkOutStr = formatTimeLabel(checkOutIso)
  const worked = parseISO(checkOutIso).getTime() - parseISO(checkInIso).getTime()
  return {
    id: `today-${session.workDate}`,
    date: dateLabel,
    checkIn: checkInStr,
    checkOut: checkOutStr,
    workHour: formatDurationMs(worked),
    attendance: 'Present',
  }
}

export default function Attendance() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const itemsPerPage = parseInt(searchParams.get('limit') || '10', 10) || 10

  const [session, setSession] = useState<AttendanceDaySession>(createEmptyDaySession)
  const [nowTick, setNowTick] = useState(() => Date.now())

  const todayLabel = format(new Date(), 'dd MMMM, yyyy')

  useEffect(() => {
    if (!session.checkInIso || session.checkOutIso) return
    const id = window.setInterval(() => setNowTick(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [session.checkInIso, session.checkOutIso])

  const headerCheckIn = session.checkInIso ? formatTimeLabel(session.checkInIso) : '--:--'
  const headerCheckOut = session.checkOutIso ? formatTimeLabel(session.checkOutIso) : '--:--'
  const headerWorkingPeriod = useMemo(() => {
    if (!session.checkInIso) return '--:--'
    if (session.checkOutIso) {
      const ms = parseISO(session.checkOutIso).getTime() - parseISO(session.checkInIso).getTime()
      return formatDurationMs(ms)
    }
    const ms = nowTick - parseISO(session.checkInIso).getTime()
    return formatDurationMs(ms)
  }, [session.checkInIso, session.checkOutIso, nowTick])

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

  const [filterStatus, setFilterStatus] = useState('all')

  const filterOptions = useMemo(
    () => [
      { value: 'all', label: t('attendance.all') },
      { value: 'Present', label: t('attendance.present') },
      { value: 'Absent', label: t('attendance.absent') },
    ],
    [t]
  )

  const allRecords = useMemo(() => {
    const todayRow = buildTodayRecord(session, todayLabel, nowTick)
    const rest = mockAttendanceRecords.filter((r) => r.date !== todayLabel)
    return [todayRow, ...rest]
  }, [session, todayLabel, nowTick])

  const filteredRecords = useMemo(() => {
    if (filterStatus === 'all') return allRecords
    return allRecords.filter((r) => r.attendance === filterStatus)
  }, [allRecords, filterStatus])

  const totalItems = filteredRecords.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) setPage(1)
  }, [totalPages, currentPage])

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRecords.slice(start, start + itemsPerPage)
  }, [filteredRecords, currentPage, itemsPerPage])

  const handleCheckIn = useCallback(() => {
    const today = getLocalDateKey()
    if (session.checkInIso) {
      toast({ title: t('attendance.alreadyCheckedIn'), variant: 'warning' })
      return
    }
    if (session.checkOutIso) {
      toast({ title: t('attendance.dayComplete'), variant: 'info' })
      return
    }
    const next: AttendanceDaySession = {
      workDate: today,
      checkInIso: new Date().toISOString(),
      checkOutIso: null,
    }
    setSession(next)
    setNowTick(Date.now())
    toast({ title: t('attendance.checkedInSuccess'), variant: 'success' })
  }, [session.checkInIso, session.checkOutIso, t])

  const handleCheckOut = useCallback(() => {
    if (!session.checkInIso) {
      toast({ title: t('attendance.checkInFirst'), variant: 'destructive' })
      return
    }
    if (session.checkOutIso) {
      toast({ title: t('attendance.alreadyCheckedOut'), variant: 'warning' })
      return
    }
    const next: AttendanceDaySession = {
      ...session,
      checkOutIso: new Date().toISOString(),
    }
    setSession(next)
    setNowTick(Date.now())
    toast({ title: t('attendance.checkedOutSuccess'), variant: 'success' })
  }, [session, t])

  const canCheckIn = !session.checkInIso && !session.checkOutIso
  const canCheckOut = !!session.checkInIso && !session.checkOutIso
  const dayFinished = !!session.checkOutIso

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Calendar className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {todayLabel}
              </h2>
            </div>

            <div className="flex flex-1 flex-wrap items-stretch justify-center gap-0 min-w-0 xl:justify-center xl:px-4">
              <div className="flex flex-1 min-w-[100px] flex-col items-center justify-center gap-1 px-3 sm:px-6 border-r-2 border-emerald-500/70">
                <span className="text-xs sm:text-sm text-gray-500">{t('attendance.checkIn')}</span>
                <span className="text-base sm:text-lg font-bold text-gray-900 tabular-nums">
                  {headerCheckIn}
                </span>
              </div>
              <div className="flex flex-1 min-w-[100px] flex-col items-center justify-center gap-1 px-3 sm:px-6 border-r-2 border-orange-400/80">
                <span className="text-xs sm:text-sm text-gray-500">{t('attendance.checkOut')}</span>
                <span className="text-base sm:text-lg font-bold text-gray-900 tabular-nums">
                  {headerCheckOut}
                </span>
              </div>
              <div className="flex flex-1 min-w-[120px] flex-col items-center justify-center gap-1 px-3 sm:px-6">
                <span className="text-xs sm:text-sm text-gray-500 text-center">
                  {t('attendance.todayWorkingPeriod')}
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-900 tabular-nums text-center">
                  {headerWorkingPeriod}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 justify-center xl:justify-end">
              {canCheckIn && (
                <Button
                  type="button"
                  onClick={handleCheckIn}
                  className="min-w-[140px] rounded-xl bg-emerald-600 px-8 text-white hover:bg-emerald-700 h-11"
                >
                  {t('attendance.checkInButton')}
                </Button>
              )}
              {canCheckOut && (
                <Button
                  type="button"
                  onClick={handleCheckOut}
                  className="min-w-[140px] rounded-xl bg-orange-500 px-8 text-white hover:bg-orange-600 h-11"
                >
                  {t('attendance.checkOutButton')}
                </Button>
              )}
              {dayFinished && (
                <Button
                  type="button"
                  disabled
                  variant="secondary"
                  className="min-w-[140px] rounded-xl h-11"
                >
                  {t('attendance.dayCompleteShort')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end">
        <FilterDropdown
          value={filterStatus}
          options={filterOptions}
          onChange={setFilterStatus}
          placeholder={t('attendance.all')}
        />
      </div>

      <div className="rounded-2xl shadow-sm bg-white overflow-hidden border border-gray-100">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-[#E6F4EA] text-left">
                <th className="px-5 sm:px-6 py-4 text-sm font-bold text-gray-800">
                  {t('attendance.date')}
                </th>
                <th className="px-5 sm:px-6 py-4 text-sm font-bold text-gray-800">
                  {t('attendance.checkIn')}
                </th>
                <th className="px-5 sm:px-6 py-4 text-sm font-bold text-gray-800">
                  {t('attendance.checkOut')}
                </th>
                <th className="px-5 sm:px-6 py-4 text-sm font-bold text-gray-800">
                  {t('attendance.workHour')}
                </th>
                <th className="px-5 sm:px-6 py-4 text-sm font-bold text-gray-800">
                  {t('attendance.attendance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={cn(
                    'border-t border-gray-200 transition-colors',
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40',
                    'hover:bg-gray-50/80'
                  )}
                >
                  <td className="px-5 sm:px-6 py-4 text-sm text-gray-900">{record.date}</td>
                  <td className="px-5 sm:px-6 py-4 text-sm text-gray-800 tabular-nums">
                    {record.checkIn}
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-sm text-gray-800 tabular-nums">
                    {record.checkOut}
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-sm text-gray-800 tabular-nums">
                    {record.workHour}
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-sm">
                    <span
                      className={cn(
                        'font-semibold',
                        record.attendance === 'Present' ? 'text-emerald-600' : 'text-red-600'
                      )}
                    >
                      {record.attendance === 'Present'
                        ? t('attendance.present')
                        : t('attendance.absent')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalItems > 0 && (
          <div className="border-t border-gray-100">
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
      </div>
    </div>
  )
}

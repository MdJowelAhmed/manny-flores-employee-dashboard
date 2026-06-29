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
  buildTodayRecord,
  createEmptyDaySession,
  formatDurationMs,
  formatTimeLabel,
  getLocalDateKey,
  mapRecordFromApi,
  sessionFromTodayApi,
} from './attendanceData'
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetAttendenceQuery,
  useTodayAttendenceQuery,
} from '@/redux/api/attendenceApi'
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'
import { getCurrentLocation, getGeolocationErrorMessage } from '@/utils/geolocation'

export default function Attendance() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const itemsPerPage = parseInt(searchParams.get('limit') || '10', 10) || 10

  const { data: monthRes, isLoading: isMonthLoading } = useGetAttendenceQuery()
  const { data: todayRes, isLoading: isTodayLoading } = useTodayAttendenceQuery()
  const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation()
  const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation()

  const todayApi = todayRes?.data
  const session = useMemo(
    () => (todayApi ? sessionFromTodayApi(todayApi) : createEmptyDaySession()),
    [todayApi]
  )

  const [nowTick, setNowTick] = useState(() => Date.now())

  const todayLabel = todayApi
    ? format(parseISO(todayApi.todayDate), 'dd MMMM, yyyy')
    : format(new Date(), 'dd MMMM, yyyy')

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
    const items = [...(monthRes?.data ?? [])].sort(
      (a, b) => parseISO(b.todayDate).getTime() - parseISO(a.todayDate).getTime()
    )
    const todayKey = todayApi
      ? getLocalDateKey(parseISO(todayApi.todayDate))
      : getLocalDateKey()

    return items.map((item) => {
      const itemDateKey = getLocalDateKey(parseISO(item.todayDate))
      if (todayApi && itemDateKey === todayKey) {
        return buildTodayRecord(
          sessionFromTodayApi(todayApi),
          format(parseISO(item.todayDate), 'dd MMMM, yyyy'),
          nowTick
        )
      }
      return mapRecordFromApi(item)
    })
  }, [monthRes, todayApi, nowTick])

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

  const handleCheckIn = useCallback(async () => {
    if (session.checkInIso) {
      toast({ title: t('attendance.alreadyCheckedIn'), variant: 'warning' })
      return
    }
    if (session.checkOutIso) {
      toast({ title: t('attendance.dayComplete'), variant: 'info' })
      return
    }
    try {
      const location = await getCurrentLocation()
      await checkIn({
        checkInLatitude: location.latitude,
        checkInLongitude: location.longitude,
        checkInAccuracy: location.accuracy,
      }).unwrap()
      setNowTick(Date.now())
      toast({ title: t('attendance.checkedInSuccess'), variant: 'success' })
    } catch (err) {
      const geoMessage = getGeolocationErrorMessage(err)
      const apiMessage = (err as { data?: { message?: string } })?.data?.message
      const message =
        apiMessage ??
        (err instanceof GeolocationPositionError || err instanceof Error
          ? geoMessage
          : 'Failed to check in')
      toast({ title: message, variant: 'destructive' })
    }
  }, [session.checkInIso, session.checkOutIso, checkIn, t])

  const handleCheckOut = useCallback(async () => {
    if (!session.checkInIso) {
      toast({ title: t('attendance.checkInFirst'), variant: 'destructive' })
      return
    }
    if (session.checkOutIso) {
      toast({ title: t('attendance.alreadyCheckedOut'), variant: 'warning' })
      return
    }
    try {
      const location = await getCurrentLocation()
      await checkOut({
        checkOutLatitude: location.latitude,
        checkOutLongitude: location.longitude,
        checkOutAccuracy: location.accuracy,
      }).unwrap()
      setNowTick(Date.now())
      toast({ title: t('attendance.checkedOutSuccess'), variant: 'success' })
    } catch (err) {
      const geoMessage = getGeolocationErrorMessage(err)
      const apiMessage = (err as { data?: { message?: string } })?.data?.message
      const message =
        apiMessage ??
        (err instanceof GeolocationPositionError || err instanceof Error
          ? geoMessage
          : 'Failed to check out')
      toast({ title: message, variant: 'destructive' })
    }
  }, [session, checkOut, t])

  const canCheckIn = !session.checkInIso && !session.checkOutIso
  const canCheckOut = !!session.checkInIso && !session.checkOutIso
  const dayFinished = !!session.checkOutIso
  const isHeaderLoading = isTodayLoading

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
                  {isHeaderLoading ? '...' : headerCheckIn}
                </span>
              </div>
              <div className="flex flex-1 min-w-[100px] flex-col items-center justify-center gap-1 px-3 sm:px-6 border-r-2 border-orange-400/80">
                <span className="text-xs sm:text-sm text-gray-500">{t('attendance.checkOut')}</span>
                <span className="text-base sm:text-lg font-bold text-gray-900 tabular-nums">
                  {isHeaderLoading ? '...' : headerCheckOut}
                </span>
              </div>
              <div className="flex flex-1 min-w-[120px] flex-col items-center justify-center gap-1 px-3 sm:px-6">
                <span className="text-xs sm:text-sm text-gray-500 text-center">
                  {t('attendance.todayWorkingPeriod')}
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-900 tabular-nums text-center">
                  {isHeaderLoading ? '...' : headerWorkingPeriod}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 justify-center xl:justify-end">
              {canCheckIn && (
                <Button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn || isHeaderLoading}
                  className="min-w-[140px] rounded-xl bg-emerald-600 px-8 text-white hover:bg-emerald-700 h-11"
                >
                  {isCheckingIn ? '...' : t('attendance.checkInButton')}
                </Button>
              )}
              {canCheckOut && (
                <Button
                  type="button"
                  onClick={handleCheckOut}
                  disabled={isCheckingOut || isHeaderLoading}
                  className="min-w-[140px] rounded-xl bg-orange-500 px-8 text-white hover:bg-orange-600 h-11"
                >
                  {isCheckingOut ? '...' : t('attendance.checkOutButton')}
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
              {isMonthLoading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-5 sm:px-6 py-4">
                        <div className="h-4 rounded bg-gray-100 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 sm:px-6 py-10 text-center text-sm text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => (
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
                ))
              )}
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

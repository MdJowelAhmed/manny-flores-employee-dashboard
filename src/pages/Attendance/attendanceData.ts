import { format, parseISO } from 'date-fns'

export type AttendanceStatus = 'Present' | 'Absent'

export interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut: string
  workHour: string
  attendance: AttendanceStatus
}

export interface AttendanceDaySession {
  workDate: string
  checkInIso: string | null
  checkOutIso: string | null
}

export interface AttendanceUserApi {
  id: string
  name: string
  email: string
  profile: string
}

export interface AttendanceRecordApi {
  id: string
  checkInTime: string | null
  checkOutTime: string | null
  userId: string
  todayDate: string
  createdAt: string
  status: string
  updatedAt: string
  workingHours: number
  user?: AttendanceUserApi
}

export interface AttendanceDayApi {
  userId: string
  todayDate: string
  checkInTime: string | null
  checkOutTime: string | null
  workingHours: number
  status: string
}

export function getLocalDateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function createEmptyDaySession(): AttendanceDaySession {
  return {
    workDate: getLocalDateKey(),
    checkInIso: null,
    checkOutIso: null,
  }
}

export function sessionFromTodayApi(data: AttendanceDayApi): AttendanceDaySession {
  return {
    workDate: getLocalDateKey(parseISO(data.todayDate)),
    checkInIso: data.checkInTime,
    checkOutIso: data.checkOutTime,
  }
}

export function mapApiStatus(status: string): AttendanceStatus {
  return status === 'PRESENT' ? 'Present' : 'Absent'
}

export function formatDurationMs(ms: number) {
  if (ms < 0) ms = 0
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h} hr ${m} min`
}

export function formatWorkingHours(hours: number) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h} hr ${m} min`
}

export function formatTimeLabel(iso: string) {
  return format(parseISO(iso), 'hh:mm a')
}

export function buildTodayRecord(
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

export function mapRecordFromApi(item: AttendanceRecordApi): AttendanceRecord {
  const dateLabel = format(parseISO(item.todayDate), 'dd MMMM, yyyy')
  const attendance = mapApiStatus(item.status)

  if (!item.checkInTime) {
    return {
      id: item.id,
      date: dateLabel,
      checkIn: '--:--',
      checkOut: '--:--',
      workHour: '--:--',
      attendance,
    }
  }

  const checkIn = formatTimeLabel(item.checkInTime)
  const checkOut = item.checkOutTime ? formatTimeLabel(item.checkOutTime) : '--:--'
  const workHour = item.checkOutTime
    ? formatWorkingHours(item.workingHours)
    : '--:--'

  return {
    id: item.id,
    date: dateLabel,
    checkIn,
    checkOut,
    workHour,
    attendance,
  }
}

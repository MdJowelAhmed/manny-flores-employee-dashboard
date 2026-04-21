export type AttendanceStatus = 'Present' | 'Absent'

export interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut: string
  workHour: string
  attendance: AttendanceStatus
}

/** In-memory check-in/out for the current workday (local date). */
export interface AttendanceDaySession {
  workDate: string
  checkInIso: string | null
  checkOutIso: string | null
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

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '21 February, 2025',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workHour: '9 hr 0 min',
    attendance: 'Present',
  },
  {
    id: 'att-2',
    date: '20 February, 2025',
    checkIn: '09:05 AM',
    checkOut: '06:10 PM',
    workHour: '9 hr 5 min',
    attendance: 'Present',
  },
  {
    id: 'att-3',
    date: '19 February, 2025',
    checkIn: '--:--',
    checkOut: '--:--',
    workHour: '--:--',
    attendance: 'Absent',
  },
  {
    id: 'att-4',
    date: '18 February, 2025',
    checkIn: '08:55 AM',
    checkOut: '05:45 PM',
    workHour: '8 hr 50 min',
    attendance: 'Present',
  },
  {
    id: 'att-5',
    date: '17 February, 2025',
    checkIn: '--:--',
    checkOut: '--:--',
    workHour: '--:--',
    attendance: 'Absent',
  },
  {
    id: 'att-6',
    date: '16 February, 2025',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workHour: '9 hr 0 min',
    attendance: 'Present',
  },
]

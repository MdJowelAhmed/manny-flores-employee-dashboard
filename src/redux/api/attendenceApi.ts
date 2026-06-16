import { baseApi } from '../baseApi'
import type {
  AttendanceDayApi,
  AttendanceRecordApi,
} from '@/pages/Attendance/attendanceData'

export interface AttendenceListResponse {
  success: boolean
  statusCode?: number
  message: string
  data: AttendanceRecordApi[]
}

export interface TodayAttendenceResponse {
  success: boolean
  statusCode?: number
  message: string
  data: AttendanceDayApi
}

export interface CheckInPayload {
  checkInLatitude: number | null
  checkInLongitude: number | null
  checkInAccuracy: number | null
}

export interface CheckOutPayload {
  checkOutLatitude: number | null
  checkOutLongitude: number | null
  checkOutAccuracy: number | null
}

export interface CheckInResponse {
  success: boolean
  statusCode?: number
  message: string
  data: AttendanceDayApi
}

export interface CheckOutResponse {
  success: boolean
  statusCode?: number
  message: string
  data: AttendanceDayApi
}

const attendenceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendence: builder.query<AttendenceListResponse, void>({
      query: () => ({
        url: '/attendance/this-month',
        method: 'GET',
      }),
      providesTags: ['Attendence'],
    }),

    todayAttendence: builder.query<TodayAttendenceResponse, void>({
      query: () => ({
        url: '/attendance/me',
        method: 'GET',
      }),
      providesTags: ['Attendence'],
    }),

    checkIn: builder.mutation<CheckInResponse, CheckInPayload>({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendence'],
    }),

    checkOut: builder.mutation<CheckOutResponse, CheckOutPayload>({
      query: (body) => ({
        url: '/attendance/checkout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendence'],
    }),
  }),
})

export const {
  useGetAttendenceQuery,
  useTodayAttendenceQuery,
  useCheckInMutation,
  useCheckOutMutation,
} = attendenceApi

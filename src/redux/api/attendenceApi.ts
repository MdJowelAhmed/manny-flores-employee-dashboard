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

    checkIn: builder.mutation<CheckInResponse, void>({
      query: () => ({
        url: '/attendance',
        method: 'POST',
      }),
      invalidatesTags: ['Attendence'],
    }),

    checkOut: builder.mutation<CheckOutResponse, void>({
      query: () => ({
        url: '/attendance/checkout',
        method: 'POST',
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

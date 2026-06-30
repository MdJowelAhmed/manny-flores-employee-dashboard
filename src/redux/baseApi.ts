import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_V1_URL } from '@/config/api'
import type { RootState } from './store'

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_V1_URL,
        prepareHeaders: (headers, { getState, endpoint, type }) => {
            const stateToken = (getState() as RootState).auth.token
            const token =
                stateToken ??
                (typeof localStorage !== 'undefined'
                    ? localStorage.getItem('token')
                    : null)
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            // Let the browser set multipart boundary for profile updates
            if (endpoint === 'updateMyProfile' && type === 'mutation') {
                headers.delete('content-type')
            }
            return headers
        },
    }),
    tagTypes: [
        'Auth',
        'Users',
        'Transactions',
        'Orders',
        'Faqs',
        'Subscribers',
        'PushNotifications',
        'MyTask',
        'Attendence',
        'RequestMaterials',
        'RequestVehicles',
        'RequestEquipment',
        'RequestVehicles',
        'chats',
    ],
    endpoints: () => ({}),
})

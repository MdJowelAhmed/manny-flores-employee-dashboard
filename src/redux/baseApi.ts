import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'

const backendOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://10.10.7.28:5000').replace(/\/$/, '')
const apiBaseUrl = import.meta.env.DEV ? '/api/v1' : `${backendOrigin}/api/v1`

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,
        prepareHeaders: (headers, { getState, endpoint, type }) => {
            const token = (getState() as RootState).auth.token
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
        "chats"
    ],
    endpoints: () => ({}),
}) 
export const socketUrl = backendOrigin
export const imageUrl = backendOrigin 
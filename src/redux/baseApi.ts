import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/v1',
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
        'RequestMaterials',
        'RequestVehicles', 
        "chats"
    ],
    endpoints: () => ({}),
}) 
export const socketUrl = import.meta.env.VITE_API_BASE_URL 
export const imageUrl = import.meta.env.VITE_API_BASE_URL 
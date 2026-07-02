import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { API_V1_URL } from '@/config/api'
import type { RootState } from './store'
import {
  getApiErrorMessage,
  isAuthEndpoint,
  isForbiddenError,
  isUnauthorizedError,
} from '@/utils/apiError'
import { isTokenExpired } from '@/utils/jwt'
import { handleSessionExpired } from '@/utils/sessionHandler'
import { toast } from '@/utils/toast'

function getRequestUrl(args: string | FetchArgs): string {
  if (typeof args === 'string') return args
  return args.url ?? ''
}

const rawBaseQuery = fetchBaseQuery({
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
})

const baseQueryWithGlobalErrors: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = getRequestUrl(args)
  const skipAuthHandling = isAuthEndpoint(url)
  const state = api.getState() as RootState
  const token =
    state.auth.token ??
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem('token')
      : null)

  if (token && isTokenExpired(token) && !skipAuthHandling) {
    handleSessionExpired(api.dispatch, {
      onCleanup: () => api.dispatch(baseApi.util.resetApiState()),
    })
    return {
      error: {
        status: 401,
        data: { message: 'Session expired' },
      } as FetchBaseQueryError,
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error) {
    if (isUnauthorizedError(result.error) && !skipAuthHandling && token) {
      const message = getApiErrorMessage(
        result.error,
        'Your session has expired. Please log in again.'
      )
      handleSessionExpired(api.dispatch, {
        onCleanup: () => api.dispatch(baseApi.util.resetApiState()),
        message,
      })
    } else if (isForbiddenError(result.error) && !skipAuthHandling && token) {
      toast({
        title: 'Access denied',
        description: getApiErrorMessage(
          result.error,
          'You do not have permission to perform this action.'
        ),
        variant: 'destructive',
      })
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithGlobalErrors,
  tagTypes: [
    'Auth',
    'Notification',
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

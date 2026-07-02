import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { baseApi } from '@/redux/baseApi'
import { getTokenExpiryMs } from '@/utils/jwt'
import {
  handleSessionExpired,
  registerAuthNavigator,
} from '@/utils/sessionHandler'

/**
 * Registers navigation for session expiry and proactively logs out
 * when the JWT expires (before the next API call).
 */
export function SessionManager() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { token, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    registerAuthNavigator(navigate)
    return () => registerAuthNavigator(null)
  }, [navigate])

  useEffect(() => {
    if (!isAuthenticated || !token) return

    const msUntilExpiry = getTokenExpiryMs(token)
    if (msUntilExpiry === null) return

    if (msUntilExpiry <= 0) {
      handleSessionExpired(dispatch, {
        onCleanup: () => dispatch(baseApi.util.resetApiState()),
      })
      return
    }

    const timer = window.setTimeout(() => {
      handleSessionExpired(dispatch, {
        onCleanup: () => dispatch(baseApi.util.resetApiState()),
      })
    }, msUntilExpiry)

    return () => window.clearTimeout(timer)
  }, [token, isAuthenticated, dispatch])

  return null
}

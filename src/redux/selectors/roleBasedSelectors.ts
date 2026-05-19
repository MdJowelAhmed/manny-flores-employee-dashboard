import { RootState } from '../store'
import { UserRole, hasFeatureAccess, type FeatureKey } from '@/types/roles'

/**
 * Check if user has access to a feature.
 */
export const selectHasFeatureAccess =
  (feature: FeatureKey) =>
  (state: RootState): boolean => {
    const { user } = state.auth
    if (!user) return false
    return hasFeatureAccess(user.role as UserRole, feature)
  }

/**
 * Get current user's role.
 */
export const selectUserRole = (state: RootState): UserRole | null => {
  const { user } = state.auth
  return user ? (user.role as UserRole) : null
}

/**
 * Permission: employee can modify own items only (read-only for shared resources).
 */
export const selectCanModifyItem = (
  state: RootState,
  _itemBusinessId?: string
): boolean => {
  const { user } = state.auth

  if (!user) return false

  return user.role === UserRole.EMPLOYEE
}

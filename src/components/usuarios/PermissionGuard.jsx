import { useAuth } from './AuthContext'

function PermissionGuard({
  permission,
  children,
  fallback = null,
}) {
  const {
    loading,
    isAuthorized,
    hasPermission,
  } = useAuth()

  if (loading || !isAuthorized) {
    return fallback
  }

  if (permission && !hasPermission(permission)) {
    return fallback
  }

  return children
}

export default PermissionGuard
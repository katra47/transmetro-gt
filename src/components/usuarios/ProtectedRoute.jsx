import { Navigate, useLocation } from 'react-router-dom'

import {
  Box,
  CircularProgress,
} from '@mui/material'

import { useAuth } from './AuthContext'
import protectedRouteStyles from './ProtectedRoute.styles'

function ProtectedRoute({
  children,
  requiredPermission = null,
}) {
  const location = useLocation()

  const {
    loading,
    isAuthenticated,
    isAuthorized,
    hasPermission,
  } = useAuth()

  if (loading) {
    return (
      <Box sx={protectedRouteStyles.loadingContainer}>
        <CircularProgress sx={{ color: '#008F87' }} />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/iniciar-sesion"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />
  }

  if (
    requiredPermission &&
    !hasPermission(requiredPermission)
  ) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
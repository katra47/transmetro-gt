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
  passengerOnly = false,
}) {
  const location = useLocation()

  const {
    loading,
    isAuthenticated,
    isAuthorized,
    isPassenger,
    hasPermission,
  } = useAuth()

  // Mientras Firebase verifica la sesión
  if (loading) {
    return (
      <Box sx={protectedRouteStyles.loadingContainer}>
        <CircularProgress sx={{ color: '#008F87' }} />
      </Box>
    )
  }

  // Si no inició sesión
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/iniciar-sesion"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // ========================================
  // RUTAS PARA PASAJEROS
  // ========================================

  if (passengerOnly) {
    if (!isPassenger) {
      return (
        <Navigate
          to="/pasajeros/inicio"
          replace
        />
      )
    }

    return children
  }

  // ========================================
  // RUTAS ADMINISTRATIVAS
  // ========================================

  if (!isAuthorized) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  // Verificar permiso administrativo
  if (
    requiredPermission &&
    !hasPermission(requiredPermission)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute
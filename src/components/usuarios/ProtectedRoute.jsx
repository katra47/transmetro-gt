import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material'

import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'

import { useAuth } from './AuthContext'
import protectedRouteStyles from './ProtectedRoute.styles'

function ProtectedRoute({
  children,
  requiredPermission = null,
}) {
  const location = useLocation()
  const navigate = useNavigate()

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

  if (!isAuthenticated || !isAuthorized) {
    return (
      <Navigate
        to="/iniciar-sesion"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (
    requiredPermission &&
    !hasPermission(requiredPermission)
  ) {
    return (
      <Box sx={protectedRouteStyles.deniedContainer}>
        <Paper
          elevation={0}
          sx={protectedRouteStyles.deniedCard}
        >
          <Box sx={protectedRouteStyles.deniedIcon}>
            <LockPersonRoundedIcon sx={{ fontSize: 38 }} />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            sx={protectedRouteStyles.deniedTitle}
          >
            Acceso restringido
          </Typography>

          <Typography sx={protectedRouteStyles.deniedDescription}>
            Tu cuenta inició sesión correctamente, pero el rol
            asignado no tiene permiso para acceder a este módulo.
          </Typography>

          <Button
            type="button"
            variant="contained"
            startIcon={<HomeRoundedIcon />}
            onClick={() => navigate('/')}
            sx={protectedRouteStyles.homeButton}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    )
  }

  return children
}

export default ProtectedRoute
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from '@mui/material'

import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'

import logo from '../../img/logo.png'
import { useAuth } from './AuthContext'
import loginPageStyles from './LoginPage.styles'

function LoginPage() {
  const navigate = useNavigate()

  const {
    firebaseUser,
    isAuthorized,
    loading,
    authError,
    loginWithGoogle,
  } = useAuth()

  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    if (isAuthorized) {
      navigate('/', { replace: true })
    }
  }, [isAuthorized, navigate])

  const handleGoogleLogin = async () => {
        setSigningIn(true)

        try {
            await loginWithGoogle()
        } catch (error) {
            console.error(error)
        } finally {
            setSigningIn(false)
        }
    }

  const handleGuestAccess = () => {
    navigate('/')
  }

  if (loading || signingIn) {
    return (
      <Box sx={loginPageStyles.page}>
        <Box sx={loginPageStyles.pattern} />

        <CircularProgress
          size={52}
          thickness={4}
          sx={{ color: '#FFFFFF' }}
        />
      </Box>
    )
  }

  return (
    <Box sx={loginPageStyles.page}>
      <Box sx={loginPageStyles.pattern} />
      <Box sx={loginPageStyles.decorativeCircle} />

      <Paper
        component="main"
        elevation={0}
        sx={loginPageStyles.card}
      >
        <Box sx={loginPageStyles.logoContainer}>
          <Box
            component="img"
            src={logo}
            alt="Logo Transmetro GT"
            sx={loginPageStyles.logo}
          />
        </Box>

        <Typography
          component="h1"
          sx={loginPageStyles.title}
        >
          Bienvenido
        </Typography>

        <Typography sx={loginPageStyles.subtitle}>
          Inicia sesión con tu cuenta de Google para acceder a las
          funciones administrativas de Transmetro GT.
        </Typography>

        <Button
          type="button"
          variant="contained"
          fullWidth
          startIcon={
            signingIn ? (
              <CircularProgress
                size={20}
                sx={{ color: '#FFFFFF' }}
              />
            ) : (
              <GoogleIcon />
            )
          }
          disabled={signingIn}
          onClick={handleGoogleLogin}
          sx={loginPageStyles.googleButton}
        >
          {signingIn
            ? 'Iniciando sesión...'
            : 'Continuar con Google'}
        </Button>

        <Divider sx={loginPageStyles.divider}>
          o
        </Divider>

        <Button
          type="button"
          variant="outlined"
          fullWidth
          startIcon={<PersonOutlineRoundedIcon />}
          onClick={handleGuestAccess}
          sx={loginPageStyles.guestButton}
        >
          Continuar como visitante
        </Button>

        {authError && (
          <Alert
            severity="warning"
            sx={loginPageStyles.message}
          >
            {authError}
          </Alert>
        )}

        {firebaseUser && !isAuthorized && !authError && (
          <Alert
            severity="info"
            sx={loginPageStyles.message}
          >
            La cuenta está autenticada, pero todavía no tiene acceso
            administrativo.
          </Alert>
        )}

        <Typography sx={loginPageStyles.securityText}>
          <LockOutlinedIcon sx={{ fontSize: 16 }} />

          Autenticación segura mediante Google y Firebase
        </Typography>
      </Paper>
    </Box>
  )
}

export default LoginPage
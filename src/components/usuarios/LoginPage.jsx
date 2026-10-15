import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'

import logo from '../../img/logo.png'
import { useAuth } from './AuthContext'
import loginPageStyles from './LoginPage.styles'

const claveEntrada = 'transmetro.tipoEntrada'

function leerEntradaGuardada() {
  try {
    return localStorage.getItem(claveEntrada)
  } catch {
    return null
  }
}

function guardarEntrada(tipo) {
  try {
    if (tipo) {
      localStorage.setItem(claveEntrada, tipo)
    } else {
      localStorage.removeItem(claveEntrada)
    }
  } catch {
    // La página funciona aunque el navegador
    // no permita recordar la opción de visitante.
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    firebaseUser,
    isAuthorized,
    isPassenger,
    loading,
    signingIn,
    authError,
    loginWithGoogle,
    loginPassengerWithGoogle,
    logout,
  } = useAuth()

  const [modo, setModo] = useState('SELECCION')
  const [procesando, setProcesando] = useState(false)
  const [errorLocal, setErrorLocal] = useState('')

  const ocupado = loading || signingIn || procesando

  useEffect(() => {
    if (ocupado) return

    if (isAuthorized) {
      navigate('/administracion', { replace: true })
      return
    }

    if (
      isPassenger &&
      (
        location.pathname === '/' ||
        modo === 'PASAJERO'
      )
    ) {
      navigate('/pasajeros/inicio', { replace: true })
      return
    }

    // Solo omite la selección en la entrada principal.
    // /iniciar-sesion permite volver a elegir el acceso.
    if (
      location.pathname === '/' &&
      modo === 'SELECCION' &&
      !firebaseUser &&
      leerEntradaGuardada() === 'VISITANTE'
    ) {
      navigate('/pasajeros/inicio', { replace: true })
    }
  }, [
    ocupado,
    isAuthorized,
    isPassenger,
    firebaseUser,
    location.pathname,
    modo,
    navigate,
  ])

  const iniciarComoPasajero = async () => {
  if (ocupado) return

  setProcesando(true)
  setErrorLocal('')
  setModo('PASAJERO')
  guardarEntrada(null)

  try {
    await loginPassengerWithGoogle()
  } catch (error) {
    console.error('Error al ingresar como pasajero:', error)

    setErrorLocal(
      `${error.code || 'Error'}: ${
        error.message || 'No fue posible iniciar sesión.'
      }`,
    )
  } finally {
    setProcesando(false)
  }
}

  const iniciarComoAdministrador = async () => {
    if (ocupado) return

    setProcesando(true)
    setErrorLocal('')
    guardarEntrada(null)

    try {
      await loginWithGoogle()
    } catch {
      // AuthContext proporciona el mensaje de error.
    } finally {
      setProcesando(false)
    }
  }

  

  const entrarComoVisitante = async () => {
    if (ocupado) return

    setProcesando(true)
    setErrorLocal('')

    try {
      // Visitante entra sin una sesión autenticada.
      await logout()

      guardarEntrada('VISITANTE')

      navigate('/pasajeros/inicio', {
        replace: true,
      })
    } catch {
      setErrorLocal(
        'No fue posible cambiar al acceso de visitante.',
      )
    } finally {
      setProcesando(false)
    }
  }

  const abrirAdministracion = () => {
    setModo('ADMINISTRADOR')
    setErrorLocal('')
    guardarEntrada(null)
  }

  const volverASeleccion = () => {
    setModo('SELECCION')
    setErrorLocal('')
  }

  const esAdministrador = modo === 'ADMINISTRADOR'

  return (
    <Box sx={loginPageStyles.page}>
      <Box sx={loginPageStyles.pattern} />
      <Box sx={loginPageStyles.decorativeCircle} />

      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          zIndex: 2,
        }}
      >
        <Button
          onClick={
            esAdministrador
              ? volverASeleccion
              : abrirAdministracion
          }
          disabled={ocupado}
          startIcon={
            esAdministrador
              ? <ArrowBackRoundedIcon />
              : <AdminPanelSettingsRoundedIcon />
          }
          sx={{
            color: '#FFFFFF',
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: '0.82rem',
            px: 2,

            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.22)',
            },

            '&.Mui-disabled': {
              color: 'rgba(255,255,255,0.5)',
            },
          }}
        >
          {esAdministrador ? 'Volver' : 'Administradores'}
        </Button>
      </Box>

      <Paper
        component="main"
        elevation={0}
        sx={{
          ...loginPageStyles.card,
          position: 'relative',
          zIndex: 1,
          mt: 8,
          mb: 3,
        }}
      >
        <Box sx={loginPageStyles.logoContainer}>
          <Box
            component="img"
            src={logo}
            alt="Transmetro GT"
            sx={loginPageStyles.logo}
          />
        </Box>

        <Typography
          component="h1"
          sx={loginPageStyles.title}
        >
          {esAdministrador
            ? 'Acceso administrativo'
            : 'Bienvenido al Transmetro'}
        </Typography>

        <Typography sx={loginPageStyles.subtitle}>
          {esAdministrador
            ? 'Inicia sesión con Google. Tu cuenta debe tener un rol administrativo autorizado.'
            : 'Ingresa como pasajero o consulta las líneas y estaciones como visitante.'}
        </Typography>

        {esAdministrador ? (
          <>
            <Button
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              disabled={ocupado}
              onClick={iniciarComoAdministrador}
              sx={loginPageStyles.googleButton}
            >
              Entrar como administrador
            </Button>

            <Typography
              sx={{
                mt: 2,
                color: '#64748B',
                fontSize: '0.85rem',
                textAlign: 'center',
              }}
            >
              La sesión administrativa termina al
              recargar o cerrar esta página.
            </Typography>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              disabled={ocupado}
              onClick={iniciarComoPasajero}
              sx={loginPageStyles.googleButton}
            >
              Ingresar como pasajero con Google
            </Button>

            <Typography
              sx={{
                mt: 1.5,
                color: '#64748B',
                fontSize: '0.85rem',
                textAlign: 'center',
              }}
            >
              Tu sesión quedará guardada en este navegador.
            </Typography>

            <Divider sx={loginPageStyles.divider}>
              o
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonOutlineRoundedIcon />}
              disabled={ocupado}
              onClick={entrarComoVisitante}
              sx={loginPageStyles.guestButton}
            >
              Continuar como visitante
            </Button>
          </>
        )}

        {ocupado && (
          <Box
            role="status"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.5,
              mt: 3,
            }}
          >
            <CircularProgress size={22} />
            <Typography sx={{ fontSize: '0.9rem' }}>
              {loading
                ? 'Comprobando sesión...'
                : 'Procesando acceso...'}
            </Typography>
          </Box>
        )}

        {(errorLocal || authError) && (
          <Alert
            severity="warning"
            sx={loginPageStyles.message}
          >
            {errorLocal || authError}
          </Alert>
        )}
      </Paper>
    </Box>
  )
}

export default LoginPage
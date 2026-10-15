import { useState } from 'react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import TrainRoundedIcon from '@mui/icons-material/TrainRounded'
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

import logo from '../img/logo.png'

import { useAuth } from './usuarios/AuthContext'
import { headerStyles } from './Header.styles'


// ========================================
// MENÚ ADMINISTRADOR
// ========================================

const menuAdministrador = [
  {
    title: 'Inicio',
    path: '/administracion',
    icon: <HomeRoundedIcon />,
  },
  {
    title: 'Líneas',
    path: '/lineas',
    icon: <AltRouteRoundedIcon />,
    permission: 'lineas.consultar',
  },
  {
    title: 'Estaciones',
    path: '/estaciones',
    icon: <TrainRoundedIcon />,
    permission: 'estaciones.consultar',
  },
  {
    title: 'Recorridos',
    path: '/recorridos',
    icon: <RouteRoundedIcon />,
    permission: 'recorridos.consultar',
  },
  {
    title: 'Buses',
    path: '/buses',
    icon: <DirectionsBusRoundedIcon />,
    permission: 'buses.consultar',
  },
  {
    title: 'Pilotos',
    path: '/pilotos',
    icon: <BadgeRoundedIcon />,
    permission: 'pilotos.consultar',
  },
  {
    title: 'Parqueos',
    path: '/parqueos',
    icon: <LocalParkingRoundedIcon />,
    permission: 'parqueos.consultar',
  },
  {
    title: 'Pagos',
    path: '/pagos',
    icon: <CreditCardRoundedIcon />,
    permission: 'pagos.consultar',
  },
  {
    title: 'Usuarios',
    path: '/usuarios',
    icon: <ManageAccountsRoundedIcon />,
    permission: 'usuarios.consultar',
  },
  {
    title: 'Roles y permisos',
    path: '/roles',
    icon: <AdminPanelSettingsRoundedIcon />,
    permission: 'roles.consultar',
  },
  {
    title: 'Reportes',
    path: '/reportes',
    icon: <AssessmentRoundedIcon />,
    permission: 'reportes.consultar',
  },
]


// ========================================
// MENÚ PASAJERO
// ========================================

const menuPasajeros = [
  {
    title: 'Inicio',
    path: '/pasajeros/inicio',
    icon: <HomeRoundedIcon />,
  },
  {
    title: 'Líneas',
    path: '/pasajeros',
    icon: <AltRouteRoundedIcon />,
  },
  {
    title: 'Mis pagos',
    path: '/pasajeros/pagos',
    icon: <CreditCardRoundedIcon />,
  },
]


function getInitials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('') || 'U'
  )
}


function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    firebaseUser,
    userProfile,
    role,
    loading,
    isAuthenticated,
    isAuthorized,
    isPassenger,
    hasPermission,
    logout,
  } = useAuth()

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [userAnchor, setUserAnchor] = useState(null)
  const [cerrandoSesion, setCerrandoSesion] = useState(false)
  const [error, setError] = useState('')

  const menuOpen = Boolean(menuAnchor)
  const userMenuOpen = Boolean(userAnchor)

  const rutaPasajeros = (
    location.pathname === '/pasajeros' ||
    location.pathname.startsWith('/pasajeros/')
  )

  const vistaAdministrativa = (
    isAuthorized && !rutaPasajeros
  )

  const visibleMenuItems = vistaAdministrativa
    ? menuAdministrador.filter((item) => (
        !item.permission ||
        hasPermission(item.permission)
      ))
    : menuPasajeros

  const displayName = (
    userProfile?.nombres ||
    firebaseUser?.displayName ||
    'Usuario'
  )

  const displayEmail = (
    userProfile?.correo ||
    firebaseUser?.email ||
    ''
  )

  const displayPhoto = (
    userProfile?.fotoURL ||
    firebaseUser?.photoURL ||
    ''
  )

  const displayRole = isAuthorized
    ? role?.nombre || 'Administrador'
    : isPassenger
      ? 'Pasajero'
      : isAuthenticated
        ? 'Acceso administrativo pendiente'
        : 'Visitante'

  const subtitulo = vistaAdministrativa
    ? 'Sistema de control y administración'
    : 'Líneas, estaciones y trayectos'

  const cerrarMenu = () => {
    setMenuAnchor(null)
  }

  const cerrarMenuUsuario = () => {
    setUserAnchor(null)
  }

  const isCurrentPage = (path) => (
    location.pathname === path
  )

  const cambiarAcceso = () => {
    cerrarMenu()
    cerrarMenuUsuario()

    navigate('/iniciar-sesion')
  }

  const handleLogout = async () => {
    if (cerrandoSesion) return

    cerrarMenuUsuario()
    cerrarMenu()

    setError('')
    setCerrandoSesion(true)

    try {
      await logout()

      try {
        localStorage.removeItem('transmetro.tipoEntrada')
      } catch {
        // El navegador puede impedir usar localStorage.
      }

      navigate('/iniciar-sesion', {
        replace: true,
      })
    } catch (logoutError) {
      console.error(
        'No fue posible cerrar la sesión:',
        logoutError,
      )

      setError(
        'No fue posible cerrar la sesión. Intenta nuevamente.',
      )
    } finally {
      setCerrandoSesion(false)
    }
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={[
        headerStyles.appBar,

        !vistaAdministrativa && {
          background:
            'linear-gradient(110deg, #075E60 0%, #008C7A 100%)',
        },
      ]}
    >
      <Toolbar sx={headerStyles.toolbar}>

        {/* LOGO Y BOTÓN DE MENÚ */}
        <Box sx={headerStyles.logoWrapper}>
          <Tooltip title="Abrir menú">
            <IconButton
              type="button"
              onClick={(event) => {
                setMenuAnchor(event.currentTarget)
              }}
              aria-label="Abrir menú de navegación"
              aria-controls={
                menuOpen ? 'main-navigation' : undefined
              }
              aria-haspopup="true"
              aria-expanded={menuOpen || undefined}
              sx={headerStyles.logoButton}
            >
              <Box
                component="img"
                src={logo}
                alt="Transmetro GT"
                sx={headerStyles.logoImage}
              />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              ...headerStyles.arrowBadge,
              pointerEvents: 'none',
            }}
          >
            <KeyboardArrowDownRoundedIcon
              sx={headerStyles.arrowIcon}
            />
          </Box>
        </Box>


        {/* MENÚ PRINCIPAL */}
        <Menu
          id="main-navigation"
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={cerrarMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: headerStyles.menuPaper,
            },
          }}
        >
          <Typography sx={headerStyles.menuTitle}>
            {vistaAdministrativa
              ? 'Administración'
              : 'Consulta de pasajeros'}
          </Typography>

          {visibleMenuItems.map((item) => {
            const selected = isCurrentPage(item.path)

            return (
              <MenuItem
                key={item.path}
                component={Link}
                to={item.path}
                selected={selected}
                onClick={cerrarMenu}
                sx={headerStyles.menuItem}
              >
                <ListItemIcon
                  sx={
                    selected
                      ? headerStyles.selectedMenuIcon
                      : headerStyles.menuIcon
                  }
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.title} />
              </MenuItem>
            )
          })}


          {/* ADMINISTRADOR PUEDE VOLVER A SU PANEL */}
          {!vistaAdministrativa && isAuthorized && (
            <MenuItem
              component={Link}
              to="/administracion"
              onClick={cerrarMenu}
              sx={headerStyles.menuItem}
            >
              <ListItemIcon sx={headerStyles.menuIcon}>
                <AdminPanelSettingsRoundedIcon />
              </ListItemIcon>

              <ListItemText primary="Panel administrativo" />
            </MenuItem>
          )}


          {/* ADMINISTRADOR PUEDE VER LA VISTA DE PASAJEROS */}
          {vistaAdministrativa && (
            <MenuItem
              component={Link}
              to="/pasajeros/inicio"
              onClick={cerrarMenu}
              sx={headerStyles.menuItem}
            >
              <ListItemIcon sx={headerStyles.menuIcon}>
                <DirectionsBusRoundedIcon />
              </ListItemIcon>

              <ListItemText primary="Vista de pasajeros" />
            </MenuItem>
          )}


          {/* USUARIO NO AUTENTICADO */}
          {!isAuthenticated && (
            <MenuItem
              onClick={cambiarAcceso}
              sx={headerStyles.menuItem}
            >
              <ListItemIcon sx={headerStyles.menuIcon}>
                <LoginRoundedIcon />
              </ListItemIcon>

              <ListItemText primary="Elegir tipo de acceso" />
            </MenuItem>
          )}
        </Menu>


        {/* IDENTIDAD DEL SISTEMA */}
        <Box sx={headerStyles.identity}>
          <Box sx={headerStyles.titleRow}>
            <Typography
              component="div"
              sx={headerStyles.title}
            >
              Transmetro GT
            </Typography>

            <Chip
              label={
                vistaAdministrativa
                  ? 'Administración'
                  : isPassenger
                    ? 'Pasajeros'
                    : isAuthorized
                      ? 'Consulta pública'
                      : 'Visitante'
              }
              size="small"
              sx={headerStyles.countryChip}
            />
          </Box>

          <Typography sx={headerStyles.subtitle}>
            {subtitulo}
          </Typography>
        </Box>


        {/* USUARIO */}
        {loading || cerrandoSesion ? (
          <Box sx={headerStyles.loadingUser}>
            <CircularProgress
              size={24}
              sx={{ color: '#FFFFFF' }}
            />
          </Box>
        ) : !isAuthenticated ? (
          <ButtonBase
            component={Link}
            to="/iniciar-sesion"
            sx={headerStyles.loginButton}
          >
            <LoginRoundedIcon />

            <Typography sx={headerStyles.loginText}>
              Ingresar
            </Typography>
          </ButtonBase>
        ) : (
          <ButtonBase
            type="button"
            onClick={(event) => {
              setUserAnchor(event.currentTarget)
            }}
            aria-label="Abrir menú de usuario"
            aria-controls={
              userMenuOpen ? 'user-navigation' : undefined
            }
            aria-haspopup="true"
            aria-expanded={userMenuOpen || undefined}
            sx={headerStyles.userBox}
          >
            <Avatar
              src={displayPhoto || undefined}
              alt={displayName}
              sx={headerStyles.avatar}
            >
              {getInitials(displayName)}
            </Avatar>

            <Box sx={headerStyles.userInformation}>
              <Typography sx={headerStyles.userName}>
                {displayName}
              </Typography>

              <Typography sx={headerStyles.userRole}>
                {displayRole}
              </Typography>
            </Box>

            <KeyboardArrowDownRoundedIcon
              sx={headerStyles.userArrow}
            />
          </ButtonBase>
        )}


        {/* MENÚ DEL USUARIO */}
        <Menu
          id="user-navigation"
          anchorEl={userAnchor}
          open={userMenuOpen && isAuthenticated}
          onClose={cerrarMenuUsuario}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: headerStyles.accountMenuPaper,
            },
          }}
        >
          <Box sx={headerStyles.accountHeader}>
            <Avatar
              src={displayPhoto || undefined}
              alt={displayName}
              sx={headerStyles.accountAvatar}
            >
              {getInitials(displayName)}
            </Avatar>

            <Typography sx={headerStyles.accountName}>
              {displayName}
            </Typography>

            <Typography sx={headerStyles.accountEmail}>
              {displayEmail}
            </Typography>

            <Chip
              label={displayRole}
              size="small"
              sx={headerStyles.accountRole}
            />
          </Box>

          <Divider sx={headerStyles.accountDivider} />

          <MenuItem
            onClick={handleLogout}
            disabled={cerrandoSesion}
            sx={headerStyles.logoutMenuItem}
          >
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Cerrar sesión" />
          </MenuItem>
        </Menu>
      </Toolbar>


      {/* ERROR */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
    </AppBar>
  )
}

export default Header
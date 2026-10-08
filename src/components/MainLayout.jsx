import { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
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
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import logo from '../img/logo.png'
import { useAuth } from './usuarios/AuthContext'
import { headerStyles } from './Header.styles'

const menuItems = [
  {
    title: 'Inicio',
    path: '/',
    icon: <HomeRoundedIcon />,
    public: true,
  },
  {
    title: 'Líneas',
    path: '/lineas',
    icon: <AltRouteRoundedIcon />,
    public: true,
  },
  {
    title: 'Estaciones',
    path: '/estaciones',
    icon: <TrainRoundedIcon />,
    public: true,
  },
  {
    title: 'Recorridos',
    path: '/recorridos',
    icon: <RouteRoundedIcon />,
    public: true,
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
    title: 'Personal administrativo',
    path: '/personal-administrativo',
    icon: <GroupsRoundedIcon />,
    permission: 'personal.consultar',
  },
  {
    title: 'Reportes',
    path: '/reportes',
    icon: <AssessmentRoundedIcon />,
    permission: 'reportes.consultar',
  },
]

function getInitials(name) {
  if (!name) {
    return 'U'
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

function Header() {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [userAnchor, setUserAnchor] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()

  const {
    firebaseUser,
    userProfile,
    role,
    loading,
    isAuthenticated,
    isAuthorized,
    hasPermission,
    logout,
  } = useAuth()

  const menuOpen = Boolean(menuAnchor)
  const userMenuOpen = Boolean(userAnchor)

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.public) {
      return true
    }

    return (
      isAuthorized &&
      hasPermission(item.permission)
    )
  })

  const displayName =
    userProfile?.nombres ||
    firebaseUser?.displayName ||
    'Usuario'

  const displayEmail =
    userProfile?.correo ||
    firebaseUser?.email ||
    ''

  const displayPhoto =
    userProfile?.fotoURL ||
    firebaseUser?.photoURL ||
    ''

  const displayRole =
    role?.nombre ||
    (userProfile?.estado === 'PENDIENTE'
      ? 'Acceso pendiente'
      : 'Sin rol asignado')

  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget)
  }

  const closeMenu = () => {
    setMenuAnchor(null)
  }

  const openUserMenu = (event) => {
    setUserAnchor(event.currentTarget)
  }

  const closeUserMenu = () => {
    setUserAnchor(null)
  }

  const isCurrentPage = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname.startsWith(path)
  }

  const handleEditProfile = () => {
    closeUserMenu()
    navigate('/perfil')
  }

  const handleLogout = async () => {
    closeUserMenu()

    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error(
        'No fue posible cerrar la sesión:',
        error,
      )
    }
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={headerStyles.appBar}
    >
      <Toolbar sx={headerStyles.toolbar}>
        <Box sx={headerStyles.logoWrapper}>
          <Tooltip title="Abrir menú">
            <IconButton
              onClick={openMenu}
              aria-label="Abrir menú de navegación"
              aria-controls={
                menuOpen
                  ? 'main-navigation'
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                menuOpen ? 'true' : undefined
              }
              sx={headerStyles.logoButton}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo de Transmetro GT"
                sx={headerStyles.logoImage}
              />
            </IconButton>
          </Tooltip>

          <Box sx={headerStyles.arrowBadge}>
            <KeyboardArrowDownRoundedIcon
              sx={headerStyles.arrowIcon}
            />
          </Box>
        </Box>

        <Menu
          id="main-navigation"
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
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
            Navegación
          </Typography>

          {visibleMenuItems.map((item) => {
            const selected = isCurrentPage(item.path)

            return (
              <MenuItem
                key={item.path}
                component={Link}
                to={item.path}
                selected={selected}
                onClick={closeMenu}
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
        </Menu>

        <Box sx={headerStyles.identity}>
          <Box sx={headerStyles.titleRow}>
            <Typography
              component="h1"
              sx={headerStyles.title}
            >
              Transmetro GT
            </Typography>

            <Chip
              label="Guatemala"
              size="small"
              sx={headerStyles.countryChip}
            />
          </Box>

          <Typography sx={headerStyles.subtitle}>
            Sistema de control y administración
          </Typography>
        </Box>

        <Tooltip title="Notificaciones">
          <IconButton
            aria-label="Ver notificaciones"
            sx={headerStyles.notificationButton}
          >
            <NotificationsNoneRoundedIcon />
          </IconButton>
        </Tooltip>

        {loading ? (
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
              Iniciar sesión
            </Typography>
          </ButtonBase>
        ) : (
          <ButtonBase
            onClick={openUserMenu}
            aria-label="Abrir menú de usuario"
            aria-controls={
              userMenuOpen
                ? 'user-navigation'
                : undefined
            }
            aria-haspopup="true"
            aria-expanded={
              userMenuOpen ? 'true' : undefined
            }
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

        <Menu
          id="user-navigation"
          anchorEl={userAnchor}
          open={userMenuOpen}
          onClose={closeUserMenu}
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
            onClick={handleEditProfile}
            sx={headerStyles.accountMenuItem}
          >
            <ListItemIcon>
              <EditRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Editar perfil" />
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            sx={headerStyles.logoutMenuItem}
          >
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Cerrar sesión" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
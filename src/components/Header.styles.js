export const headerStyles = {
  appBar: {
    background:
      'linear-gradient(110deg, #082F49 0%, #0B5361 62%, #008C7A 100%)',
    boxShadow: '0 8px 30px rgba(4, 29, 48, 0.20)',
    overflow: 'visible',

    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: 4,
      background:
        'repeating-linear-gradient(90deg, #13B8A6 0 30px, #D6A84B 30px 50px, #B4533C 50px 70px, #F8F4E8 70px 80px)',
    },
  },

  toolbar: {
    minHeight: '76px !important',
    px: {
      xs: 2,
      md: 4,
    },
    gap: {
      xs: 1,
      sm: 2,
    },
  },

  logoWrapper: {
    position: 'relative',
    flexShrink: 0,
  },

  logoButton: {
    width: 54,
    height: 54,
    p: '4px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.45)',
    borderRadius: '15px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 8px 22px rgba(0,0,0,0.20)',
    transition: 'transform 0.2s ease',

    '&:hover': {
      backgroundColor: '#FFFFFF',
      transform: 'translateY(-2px)',
    },
  },

  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '11px',
  },

  arrowBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    display: 'grid',
    placeItems: 'center',
    border: '2px solid #0B5361',
    borderRadius: '50%',
    backgroundColor: '#D6A84B',
    pointerEvents: 'none',
  },

  arrowIcon: {
    color: '#082F49',
    fontSize: 16,
  },

  menuPaper: {
    width: 285,
    maxHeight: 'calc(100vh - 105px)',
    mt: 1.5,
    p: 1,
    overflowY: 'auto',
    border: '1px solid #DFE9E5',
    borderRadius: '18px',
    backgroundColor: '#FFFEFA',
    boxShadow: '0 20px 50px rgba(7, 47, 62, 0.20)',
  },

  menuTitle: {
    px: 2,
    pt: 1,
    pb: 1.5,
    color: '#64748B',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  menuItem: {
    mb: 0.5,
    py: 1.1,
    borderRadius: '11px',

    '&.Mui-selected': {
      color: '#006F63',
      backgroundColor: '#DDF5EE',
    },

    '&.Mui-selected:hover': {
      backgroundColor: '#CFEEE5',
    },
  },

  menuIcon: {
    color: '#64748B',
  },

  selectedMenuIcon: {
    color: '#008C7A',
  },

  identity: {
    flexGrow: 1,
    minWidth: 0,
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },

  title: {
    overflow: 'hidden',
    color: '#FFFFFF',
    fontSize: {
      xs: '1rem',
      md: '1.25rem',
    },
    fontWeight: 800,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  countryChip: {
    display: {
      xs: 'none',
      sm: 'flex',
    },
    color: '#FFE29B',
    backgroundColor: 'rgba(214,168,75,0.14)',
    border: '1px solid rgba(214,168,75,0.35)',
    fontWeight: 700,
  },

  subtitle: {
    display: {
      xs: 'none',
      sm: 'block',
    },
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.75rem',
  },

  notificationButton: {
    flexShrink: 0,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.09)',

    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
  },

  loadingUser: {
    minWidth: 52,
    minHeight: 48,
    display: 'grid',
    placeItems: 'center',
  },

  loginButton: {
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: {
      xs: 1.2,
      sm: 2,
    },
    py: 1,
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '13px',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.10)',
    transition: 'background-color 0.2s ease',

    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
  },

  loginText: {
    display: {
      xs: 'none',
      sm: 'block',
    },
    color: '#FFFFFF',
    fontSize: '0.82rem',
    fontWeight: 800,
  },

  userBox: {
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    gap: 1.2,
    px: 1.2,
    py: 0.7,
    textAlign: 'left',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.09)',
    transition: 'background-color 0.2s ease',

    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
  },

  avatar: {
    width: 35,
    height: 35,
    color: '#082F49',
    backgroundColor: '#D6A84B',
    fontSize: '0.85rem',
    fontWeight: 800,
  },

  userInformation: {
    display: {
      xs: 'none',
      md: 'block',
    },
    maxWidth: 180,
  },

  userName: {
    overflow: 'hidden',
    color: '#FFFFFF',
    fontSize: '0.82rem',
    fontWeight: 700,
    lineHeight: 1.2,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  userRole: {
    overflow: 'hidden',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.70rem',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  userArrow: {
    display: {
      xs: 'none',
      sm: 'block',
    },
    color: 'rgba(255,255,255,0.72)',
    fontSize: 20,
  },

  accountMenuPaper: {
    width: 290,
    mt: 1.5,
    p: 1,
    border: '1px solid #DFE9E5',
    borderRadius: '18px',
    backgroundColor: '#FFFEFA',
    boxShadow: '0 20px 50px rgba(7, 47, 62, 0.22)',
  },

  accountHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 2,
    pt: 1.5,
    pb: 2,
    textAlign: 'center',
  },

  accountAvatar: {
    width: 62,
    height: 62,
    mb: 1.2,
    color: '#082F49',
    backgroundColor: '#D6A84B',
    fontSize: '1.1rem',
    fontWeight: 800,
    boxShadow: '0 8px 20px rgba(8,47,73,0.16)',
  },

  accountName: {
    color: '#082F49',
    fontSize: '0.96rem',
    fontWeight: 800,
  },

  accountEmail: {
    width: '100%',
    mt: 0.3,
    overflow: 'hidden',
    color: '#71808A',
    fontSize: '0.76rem',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  accountRole: {
    mt: 1.2,
    color: '#006F63',
    backgroundColor: '#DDF5EE',
    border: '1px solid #C3E9DF',
    fontWeight: 800,
  },

  accountDivider: {
    mb: 1,
    borderColor: '#E4EBE8',
  },

  accountMenuItem: {
    borderRadius: '11px',
    color: '#234A5D',

    '& .MuiListItemIcon-root': {
      color: '#008C7A',
    },

    '&:hover': {
      backgroundColor: '#EDF7F4',
    },
  },

  logoutMenuItem: {
    mt: 0.5,
    borderRadius: '11px',
    color: '#B54747',

    '& .MuiListItemIcon-root': {
      color: '#B54747',
    },

    '&:hover': {
      backgroundColor: '#FBEAEA',
    },
  },
}
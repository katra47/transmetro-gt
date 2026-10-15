const loginPageStyles = {
  page: {
    position: 'relative',
    isolation: 'isolate',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '100vh',

    '@supports (min-height: 100dvh)': {
      minHeight: '100dvh',
    },

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'hidden',

    px: {
      xs: 5,
      sm: 3,
    },

    pt: 7,
    pb: 4,

    background:
      'linear-gradient(135deg, #071D32 0%, #073E55 45%, #008B85 100%)',
  },

  pattern: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    opacity: 0.08,
    pointerEvents: 'none',

    backgroundImage: `
      linear-gradient(30deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%),
      linear-gradient(150deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%)
    `,

    backgroundSize: '80px 140px',
  },

  decorativeCircle: {
    position: 'absolute',
    zIndex: -1,
    width: 300,
    height: 300,
    right: -100,
    top: -100,
    borderRadius: '50%',
    pointerEvents: 'none',

    background:
      'linear-gradient(135deg, rgba(27,210,181,0.3), rgba(255,255,255,0.05))',
  },

  card: {
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 500,
    borderRadius: '24px',

    px: {
      xs: 3,
      sm: 5,
    },

    py: {
      xs: 4,
      sm: 5,
    },

    backgroundColor: 'rgba(255,255,255,0.98)',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 28px 70px rgba(0,0,0,0.25)',
  },

  logoContainer: {
    width: 82,
    height: 82,
    boxSizing: 'border-box',
    mx: 'auto',
    mb: 2.5,
    p: 1,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,139,133,0.18)',
    boxShadow: '0 12px 30px rgba(0,96,100,0.12)',
  },

  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  title: {
    color: '#082A43',
    textAlign: 'center',
    fontWeight: 800,

    fontSize: {
      xs: '1.6rem',
      sm: '2rem',
    },

    lineHeight: 1.25,
  },

  subtitle: {
    color: '#60717D',
    textAlign: 'center',
    mt: 1.5,
    mb: 3.5,
    lineHeight: 1.7,
  },

  googleButton: {
    minHeight: 52,
    px: 2,
    py: 1.5,
    borderRadius: '12px',
    textTransform: 'none',
    whiteSpace: 'normal',
    fontSize: '0.95rem',
    fontWeight: 700,
    backgroundColor: '#008F87',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: '#00766F',
      boxShadow: 'none',
    },

    '&.Mui-disabled': {
      backgroundColor: '#9CB7B5',
      color: '#FFFFFF',
    },
  },

  divider: {
    my: 3,
    color: '#8A9AA4',

    '&::before, &::after': {
      borderColor: '#DCE5E9',
    },
  },

  guestButton: {
    minHeight: 48,
    px: 2,
    py: 1.5,
    borderRadius: '12px',
    textTransform: 'none',
    whiteSpace: 'normal',
    fontWeight: 700,
    color: '#0A6070',
    borderColor: '#A8CACD',

    '&:hover': {
      borderColor: '#008F87',
      backgroundColor: 'rgba(0,143,135,0.06)',
    },
  },

  message: {
    mt: 3,
    borderRadius: '12px',
    overflowWrap: 'anywhere',
  },

  securityText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    mt: 3,
    color: '#768791',
    fontSize: '0.78rem',
    textAlign: 'center',
  },
}

export default loginPageStyles
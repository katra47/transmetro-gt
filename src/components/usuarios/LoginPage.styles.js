const loginPageStyles = {
  page: {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    px: 2,
    py: 5,
    background:
      'linear-gradient(135deg, #071D32 0%, #073E55 45%, #008B85 100%)',
  },

  pattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.08,
    backgroundImage: `
      linear-gradient(30deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%),
      linear-gradient(150deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%),
      linear-gradient(30deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%),
      linear-gradient(150deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%)
    `,
    backgroundSize: '80px 140px',
    backgroundPosition:
      '0 0, 0 0, 40px 70px, 40px 70px',
    pointerEvents: 'none',
  },

  decorativeCircle: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: '50%',
    right: -120,
    top: -140,
    background:
      'linear-gradient(135deg, rgba(27, 210, 181, 0.3), rgba(255, 255, 255, 0.05))',
    pointerEvents: 'none',
  },

  card: {
    width: '100%',
    maxWidth: 460,
    position: 'relative',
    zIndex: 1,
    borderRadius: 5,
    px: {
      xs: 3,
      sm: 5,
    },
    py: {
      xs: 4,
      sm: 5,
    },
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    boxShadow: '0 28px 70px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(12px)',
  },

  logoContainer: {
    width: 82,
    height: 82,
    mx: 'auto',
    mb: 2.5,
    p: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0, 139, 133, 0.18)',
    boxShadow: '0 12px 30px rgba(0, 96, 100, 0.16)',
  },

  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: 2,
  },

  title: {
    color: '#082A43',
    textAlign: 'center',
    fontWeight: 800,
    fontSize: {
      xs: '1.75rem',
      sm: '2rem',
    },
  },

  subtitle: {
    color: '#60717D',
    textAlign: 'center',
    mt: 1,
    mb: 3.5,
    lineHeight: 1.7,
  },

  googleButton: {
    minHeight: 52,
    borderRadius: 2.5,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 700,
    backgroundColor: '#008F87',
    boxShadow: '0 10px 24px rgba(0, 143, 135, 0.25)',

    '&:hover': {
      backgroundColor: '#00766F',
      boxShadow: '0 12px 28px rgba(0, 118, 111, 0.32)',
      transform: 'translateY(-1px)',
    },

    '&:disabled': {
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
    borderRadius: 2.5,
    textTransform: 'none',
    fontWeight: 700,
    color: '#0A6070',
    borderColor: '#A8CACD',

    '&:hover': {
      borderColor: '#008F87',
      backgroundColor: 'rgba(0, 143, 135, 0.06)',
    },
  },

  message: {
    mt: 3,
    borderRadius: 2,
  },

  securityText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0.8,
    mt: 3,
    color: '#768791',
    fontSize: '0.78rem',
    textAlign: 'center',
  },
}

export default loginPageStyles
const protectedRouteStyles = {
  loadingContainer: {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F7F9',
  },

  deniedContainer: {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 2,
    py: 5,
    backgroundColor: '#F3F7F9',
  },

  deniedCard: {
    width: '100%',
    maxWidth: 520,
    p: {
      xs: 3,
      sm: 5,
    },
    borderRadius: 4,
    textAlign: 'center',
    border: '1px solid #DCE7EB',
    boxShadow: '0 18px 45px rgba(8, 42, 67, 0.12)',
  },

  deniedIcon: {
    width: 72,
    height: 72,
    mx: 'auto',
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: '#B45309',
    backgroundColor: '#FFF4DB',
  },

  deniedTitle: {
    color: '#082A43',
    fontWeight: 800,
    mb: 1,
  },

  deniedDescription: {
    color: '#657680',
    lineHeight: 1.7,
    mb: 3,
  },

  homeButton: {
    borderRadius: 2.5,
    px: 3,
    py: 1.2,
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: '#008F87',

    '&:hover': {
      backgroundColor: '#00766F',
    },
  },
}

export default protectedRouteStyles
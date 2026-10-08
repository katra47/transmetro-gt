export const mainLayoutStyles = {
  container: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    overflowX: 'hidden',
    background:
      'linear-gradient(145deg, #EEF6F3 0%, #F8F6EF 50%, #EDF4F6 100%)',

    '&::before': {
      content: '""',
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      opacity: 0.35,
      pointerEvents: 'none',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(19,184,166,0.16), transparent 24%),
        radial-gradient(circle at 90% 80%, rgba(214,168,75,0.14), transparent 22%)
      `,
    },
  },

  headerSpace: {
    minHeight: '76px !important',
  },

  mainContent: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '1500px',
    minHeight: 'calc(100vh - 76px)',
    marginX: 'auto',
    padding: {
      xs: 2,
      sm: 3,
      md: 4,
    },
  },
}
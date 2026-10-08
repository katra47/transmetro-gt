export const modulePageStyles = {
  page: {
    width: '100%',
  },

  headerCard: {
    position: 'relative',
    overflow: 'hidden',
    padding: {
      xs: 3,
      sm: 4,
      md: 5,
    },
    border: '1px solid #DFE9E5',
    borderRadius: '24px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 14px 40px rgba(8,47,73,0.08)',

    '&::after': {
      content: '""',
      position: 'absolute',
      top: -80,
      right: -50,
      width: 220,
      height: 220,
      borderRadius: '50%',
      backgroundColor: 'rgba(19,184,166,0.07)',
    },
  },

  culturalLine: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 7,
    background:
      'repeating-linear-gradient(90deg, #13B8A6 0 35px, #D6A84B 35px 55px, #B4533C 55px 75px, #F8F4E8 75px 85px)',
  },

  headerContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: {
      xs: 'flex-start',
      sm: 'center',
    },
    gap: 2.5,
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
  },

  iconContainer: {
    width: 62,
    height: 62,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '18px',
    color: '#FFFFFF',
    background:
      'linear-gradient(135deg, #0A5968, #008C7A)',
    boxShadow: '0 12px 25px rgba(0,140,122,0.22)',

    '& svg': {
      fontSize: 32,
    },
  },

  information: {
    flexGrow: 1,
  },

  moduleChip: {
    marginBottom: 1.2,
    color: '#007166',
    backgroundColor: '#DDF5EE',
    border: '1px solid #BDE9DF',
    fontSize: '0.72rem',
    fontWeight: 800,
  },

  title: {
    color: '#082F49',
    fontSize: {
      xs: '1.8rem',
      md: '2.35rem',
    },
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
  },

  description: {
    maxWidth: 720,
    marginTop: 1.2,
    color: '#64748B',
    fontSize: {
      xs: '0.92rem',
      md: '1rem',
    },
    lineHeight: 1.7,
  },

  content: {
    marginTop: 3,
    padding: {
      xs: 2.5,
      sm: 3,
      md: 4,
    },
    border: '1px solid #DFE9E5',
    borderRadius: '22px',
    backgroundColor: 'rgba(255,255,255,0.82)',
    boxShadow: '0 10px 30px rgba(8,47,73,0.05)',
  },

  emptyContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    textAlign: 'center',
  },

  emptyTitle: {
    color: '#082F49',
    fontSize: '1.1rem',
    fontWeight: 800,
  },

  emptyDescription: {
    maxWidth: 480,
    marginTop: 1,
    color: '#64748B',
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },
}
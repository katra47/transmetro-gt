const pilotoFormStyles = {
  dialogPaper: {
    width: '100%',
    maxWidth: 820,
    borderRadius: '20px',
    backgroundColor: '#FFFEFA',
    boxShadow: '0 24px 70px rgba(7, 47, 62, 0.25)',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    paddingX: { xs: 2.5, sm: 3 },
    paddingY: 2.5,
    borderBottom: '1px solid #E3ECE9',
    background:
      'linear-gradient(120deg, #082F49 0%, #0B5361 65%, #008C7A 100%)',
  },

  headerInformation: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },

  headerIcon: {
    width: 44,
    height: 44,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    borderRadius: '13px',
    color: '#082F49',
    backgroundColor: '#D6A84B',
  },

  title: {
    color: '#FFFFFF',
    fontSize: { xs: '1.05rem', sm: '1.25rem' },
    fontWeight: 800,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.78rem',
  },

  closeButton: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.10)',

    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
  },

  content: {
    padding: { xs: 2.5, sm: 3 },
  },

  errorAlert: {
    marginBottom: 2.5,
    borderRadius: '12px',
  },

  section: {
    marginBottom: 3,
  },

  sectionTitle: {
    marginBottom: 1.5,
    color: '#0B5361',
    fontSize: '0.82rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
    },
    gap: 2,
  },

  fullWidthField: {
    gridColumn: {
      xs: 'auto',
      sm: '1 / -1',
    },
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1.5,
    paddingX: { xs: 2.5, sm: 3 },
    paddingY: 2.5,
    borderTop: '1px solid #E3ECE9',
    backgroundColor: '#F7FAF9',
  },

  cancelButton: {
    minHeight: 42,
    paddingX: 2.5,
    borderColor: '#CBD8D4',
    borderRadius: '11px',
    color: '#526763',
    fontWeight: 700,
    textTransform: 'none',

    '&:hover': {
      borderColor: '#94A9A3',
      backgroundColor: '#EFF5F3',
    },
  },

  saveButton: {
    minHeight: 42,
    minWidth: 145,
    paddingX: 2.5,
    borderRadius: '11px',
    color: '#FFFFFF',
    backgroundColor: '#008C7A',
    boxShadow: 'none',
    fontWeight: 800,
    textTransform: 'none',

    '&:hover': {
      backgroundColor: '#006F63',
      boxShadow: '0 8px 20px rgba(0, 111, 99, 0.20)',
    },

    '&.Mui-disabled': {
      color: 'rgba(255,255,255,0.70)',
      backgroundColor: '#7DB9B0',
    },
  },

  progress: {
    color: '#FFFFFF',
  },
}

export default pilotoFormStyles
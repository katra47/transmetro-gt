const lineaFormStyles = {
  dialogPaper: {
    width: '100%',
    maxWidth: 680,
    borderRadius: '22px',
    backgroundColor: '#FFFEFA',
    boxShadow: '0 24px 70px rgba(7,47,62,0.22)',
   
  },

  dialogTitle: {
    padding: 0,
    marginBottom: 2,
  },

  header: {
    padding: {
      xs: 2.5,
      sm: 3,
    },
    color: '#FFFFFF',
    background:
      'linear-gradient(120deg, #082F49 0%, #0B5361 60%, #008C7A 100%)',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    
  },

  headerIcon: {
    width: 46,
    height: 46,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    borderRadius: '14px',
    color: '#082F49',
    backgroundColor: '#D6A84B',
  },

  title: {
    fontSize: {
      xs: '1.2rem',
      sm: '1.4rem',
    },
    fontWeight: 800,
  },

  subtitle: {
    marginTop: 0.4,
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.82rem',
  },

  closeButton: {
    marginLeft: 'auto',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
  paddingX: {
    xs: 2.5,
    sm: 3,
  },
  paddingBottom: {
    xs: 2.5,
    sm: 3,
  },
  paddingTop: '32px !important',

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

  field: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',

      '&.Mui-focused fieldset': {
        borderColor: '#008C7A',
      },
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#006F63',
    },
  },

  alert: {
    marginBottom: 2,
    borderRadius: '12px',
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1.5,
    padding: {
      xs: '1 20px 22px',
      sm: '0 24px 26px',
    },
  },

  cancelButton: {
    minWidth: 110,
    borderRadius: '11px',
    color: '#475569',
    borderColor: '#CBD5E1',
    fontWeight: 700,
  },

  submitButton: {
    minWidth: 145,
    borderRadius: '11px',
    color: '#FFFFFF',
    backgroundColor: '#008C7A',
    fontWeight: 800,

    '&:hover': {
      backgroundColor: '#00766A',
    },
  },
}

export default lineaFormStyles
const usuarioFormStyles = {
  dialogPaper: {
    borderRadius: 4,
    backgroundColor: '#F8FAFB',
  },

  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    px: {
      xs: 2.5,
      sm: 3.5,
    },
    py: 2.5,
    color: '#FFFFFF',
    background:
      'linear-gradient(135deg, #073E55 0%, #008F87 100%)',
  },

  titleInformation: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },

  titleIcon: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: 2,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },

  title: {
    fontWeight: 800,
    lineHeight: 1.2,
  },

  subtitle: {
    mt: 0.4,
    color: 'rgba(255, 255, 255, 0.76)',
    fontSize: '0.84rem',
  },

  closeButton: {
    color: '#FFFFFF',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
  },

  dialogContent: {
    px: {
      xs: 2.5,
      sm: 3.5,
    },
    py: 3,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
  },

  informationAlert: {
    borderRadius: 2.5,
    backgroundColor: '#E8F4F7',

    '& .MuiAlert-icon': {
      color: '#08758A',
    },
  },

  errorAlert: {
    borderRadius: 2.5,
  },

  fieldsGrid: {
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
      borderRadius: 2.2,
      backgroundColor: '#FFFFFF',
    },
  },

  uidField: {
    gridColumn: {
      xs: 'auto',
      sm: '1 / -1',
    },

    '& .MuiOutlinedInput-root': {
      borderRadius: 2.2,
      backgroundColor: '#FFFFFF',
      fontFamily: 'monospace',
    },
  },

  roleField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.2,
      backgroundColor: '#FFFFFF',
    },
  },

  section: {
    p: 2.5,
    borderRadius: 3,
    border: '1px solid #DDE7EB',
    backgroundColor: '#FFFFFF',
  },

  sectionTitle: {
    color: '#123B52',
    fontWeight: 800,
    mb: 0.5,
  },

  sectionDescription: {
    color: '#697B86',
    fontSize: '0.86rem',
    mb: 2,
  },

  dialogActions: {
    px: {
      xs: 2.5,
      sm: 3.5,
    },
    py: 2.5,
    gap: 1,
    borderTop: '1px solid #E1E9EC',
    backgroundColor: '#FFFFFF',
  },

  cancelButton: {
    borderRadius: 2,
    px: 2.5,
    textTransform: 'none',
    fontWeight: 700,
    color: '#526670',
  },

  saveButton: {
    borderRadius: 2,
    px: 3,
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: '#008F87',

    '&:hover': {
      backgroundColor: '#00766F',
    },
  },
}

export default usuarioFormStyles
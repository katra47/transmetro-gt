const rolFormStyles = {
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

  field: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.2,
      backgroundColor: '#FFFFFF',
    },
  },

  permissionsSection: {
    p: {
      xs: 2,
      sm: 2.5,
    },
    borderRadius: 3,
    border: '1px solid #DDE7EB',
    backgroundColor: '#FFFFFF',
  },

  permissionsHeader: {
    mb: 2,
  },

  permissionsTitle: {
    color: '#123B52',
    fontWeight: 800,
  },

  permissionsDescription: {
    mt: 0.5,
    color: '#697B86',
    fontSize: '0.88rem',
  },

  moduleCard: {
    mb: 1.5,
    border: '1px solid #E1E9EC',
    borderRadius: 2.5,
    overflow: 'hidden',

    '&:last-of-type': {
      mb: 0,
    },
  },

  moduleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    px: 2,
    py: 1.3,
    backgroundColor: '#F1F6F7',
  },

  moduleName: {
    color: '#16455A',
    fontWeight: 800,
  },

  modulePermissions: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
    },
    gap: 0.5,
    px: 2,
    py: 1.5,
  },

  permissionLabel: {
    m: 0,

    '& .MuiFormControlLabel-label': {
      color: '#526670',
      fontSize: '0.9rem',
    },

    '& .MuiCheckbox-root.Mui-checked': {
      color: '#008F87',
    },
  },

  errorAlert: {
    borderRadius: 2,
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

export default rolFormStyles
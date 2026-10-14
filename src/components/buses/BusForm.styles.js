export const dialogPaperStyles = {
  borderRadius: '22px',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 24px 70px rgba(8, 47, 73, 0.22)',
}

/* ========================================
   TÍTULO / ENCABEZADO
======================================== */

export const dialogTitleStyles = {
  p: 0,
}

export const headerStyles = {
  px: {
    xs: 2.5,
    sm: 3,
  },

  py: 2.5,

  color: '#FFFFFF',

  background:
    'linear-gradient(120deg, #082F49 0%, #0B5361 58%, #008C7A 100%)',
}

export const headerContentStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
}

export const headerIconStyles = {
  width: 48,
  height: 48,

  flexShrink: 0,

  display: 'grid',
  placeItems: 'center',

  borderRadius: '14px',

  color: '#082F49',
  backgroundColor: '#D6A84B',

  '& .MuiSvgIcon-root': {
    fontSize: 27,
  },
}

export const titleStyles = {
  color: '#FFFFFF',

  fontSize: {
    xs: '1.25rem',
    sm: '1.45rem',
  },

  fontWeight: 900,

  lineHeight: 1.2,
}

export const subtitleStyles = {
  mt: 0.35,

  color: 'rgba(255,255,255,0.72)',

  fontSize: '0.8rem',

  lineHeight: 1.4,
}

export const closeButtonStyles = {
  ml: 'auto',

  width: 38,
  height: 38,

  color: '#FFFFFF',

  backgroundColor: 'rgba(255,255,255,0.10)',

  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  '&.Mui-disabled': {
    color: 'rgba(255,255,255,0.4)',
  },
}

/* ========================================
   CONTENIDO
======================================== */

export const contentStyles = {
  px: {
    xs: 2.5,
    sm: 3.5,
  },

  py: '28px !important',

  backgroundColor: '#FFFFFF',
}

export const formGridStyles = {
  display: 'grid',

  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
  },

  gap: 2.3,
}

/* ========================================
   CAMPOS
======================================== */

export const fieldStyles = {
  '& .MuiInputLabel-root': {
    color: '#64748B',
    fontSize: '0.9rem',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#008C7A',
  },

  '& .MuiOutlinedInput-root': {
    minHeight: 52,

    borderRadius: '12px',

    backgroundColor: '#F8FAFC',

    fontSize: '0.9rem',

    transition:
      'background-color 0.2s ease, box-shadow 0.2s ease',

    '& fieldset': {
      borderColor: '#D7E3E0',
    },

    '&:hover fieldset': {
      borderColor: '#94B8B0',
    },

    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',

      boxShadow:
        '0 0 0 3px rgba(0, 140, 122, 0.08)',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#008C7A',
      borderWidth: '1.5px',
    },

    '&.Mui-disabled': {
      backgroundColor: '#F1F5F4',
    },
  },

  '& .MuiFormHelperText-root': {
    mx: 0.5,
    mt: 0.7,

    color: '#94A3B8',

    fontSize: '0.7rem',
  },
}

/* ========================================
   ACCIONES
======================================== */

export const actionsStyles = {
  px: {
    xs: 2.5,
    sm: 3.5,
  },

  py: 2.2,

  gap: 1,

  borderTop: '1px solid #E7EEEC',

  backgroundColor: '#FAFCFB',
}

export const cancelButtonStyles = {
  minWidth: 110,

  px: 2,

  py: 1,

  borderRadius: '10px',

  borderColor: '#CBD5E1',

  color: '#64748B',

  fontSize: '0.78rem',

  fontWeight: 800,

  textTransform: 'uppercase',

  '&:hover': {
    borderColor: '#94A3B8',
    backgroundColor: '#F1F5F9',
  },
}

export const submitButtonStyles = {
  minWidth: 145,

  px: 2.5,

  py: 1,

  borderRadius: '10px',

  color: '#FFFFFF',

  backgroundColor: '#008C7A',

  fontSize: '0.78rem',

  fontWeight: 900,

  textTransform: 'uppercase',

  boxShadow:
    '0 5px 12px rgba(0, 140, 122, 0.20)',

  '&:hover': {
    backgroundColor: '#007466',

    boxShadow:
      '0 7px 16px rgba(0, 140, 122, 0.25)',
  },

  '&.Mui-disabled': {
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: '#86BDB5',
  },
}
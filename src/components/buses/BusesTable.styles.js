/* ==========================================
   PÁGINA
========================================== */

export const pageStyles = {
  minHeight: 'calc(100vh - 76px)',

  px: {
    xs: 2,
    md: 4,
  },

  py: 4,

  backgroundColor: '#F4F8F7',
}

export const pageContainerStyles = {
  width: '100%',
  maxWidth: 1350,
  mx: 'auto',
}

/* ==========================================
   ENCABEZADO PRINCIPAL
========================================== */

export const heroStyles = {
  mb: 3,

  px: {
    xs: 2.5,
    md: 4,
  },

  py: {
    xs: 2.5,
    md: 3.5,
  },

  borderRadius: '24px',

  color: '#FFFFFF',

  background:
    'linear-gradient(120deg, #082F49 0%, #0B5361 58%, #008C7A 100%)',

  boxShadow:
    '0 14px 35px rgba(8, 47, 73, 0.12)',
}

export const heroContentStyles = {
  display: 'flex',

  justifyContent: 'space-between',

  alignItems: {
    xs: 'flex-start',
    sm: 'center',
  },

  flexDirection: {
    xs: 'column',
    sm: 'row',
  },

  gap: 2,
}

export const heroInformationStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
}

export const heroIconStyles = {
  width: 58,
  height: 58,

  flexShrink: 0,

  display: 'grid',
  placeItems: 'center',

  borderRadius: '17px',

  color: '#082F49',

  backgroundColor: '#D6A84B',

  boxShadow:
    '0 6px 16px rgba(0,0,0,0.14)',
}

export const heroTitleStyles = {
  color: '#FFFFFF',

  fontSize: {
    xs: '1.55rem',
    md: '2rem',
  },

  fontWeight: 900,

  lineHeight: 1.15,
}

export const heroDescriptionStyles = {
  mt: 0.4,

  maxWidth: 600,

  color: 'rgba(255,255,255,0.72)',

  fontSize: {
    xs: '0.8rem',
    sm: '0.9rem',
  },
}

/* ==========================================
   BOTÓN AGREGAR BUS
========================================== */

export const addButtonStyles = {
  minHeight: 43,

  px: 2.5,

  flexShrink: 0,

  borderRadius: '12px',

  color: '#082F49',

  backgroundColor: '#D6A84B',

  fontSize: '0.78rem',

  fontWeight: 900,

  textTransform: 'uppercase',

  letterSpacing: '0.04em',

  boxShadow:
    '0 5px 12px rgba(0,0,0,0.16)',

  '&:hover': {
    backgroundColor: '#E3B95D',

    boxShadow:
      '0 7px 16px rgba(0,0,0,0.18)',

    transform: 'translateY(-1px)',
  },

  transition:
    'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
}

/* ==========================================
   TARJETAS DE ESTADÍSTICAS
========================================== */

export const statisticsGridStyles = {
  display: 'grid',

  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))',
    lg: 'repeat(5, minmax(0, 1fr))',
  },

  gap: 2,

  mb: 3,
}

export const statisticCardStyles = {
  position: 'relative',

  minHeight: 90,

  p: 2.2,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  overflow: 'hidden',

  border: '1px solid #E2ECE8',

  borderRadius: '18px',

  backgroundColor: '#FFFFFF',

  boxShadow:
    '0 4px 15px rgba(15,54,75,0.025)',

  transition:
    'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',

  '&::before': {
    content: '""',

    position: 'absolute',

    left: 0,
    top: 0,
    bottom: 0,

    width: 4,

    backgroundColor: '#008C7A',
  },

  '&:hover': {
    transform: 'translateY(-2px)',

    borderColor: '#C8DDD8',

    boxShadow:
      '0 8px 20px rgba(15,54,75,0.07)',
  },
}

export const statisticValueStyles = {
  color: '#082F49',

  fontSize: '1.5rem',

  fontWeight: 900,

  lineHeight: 1.1,
}

export const statisticLabelStyles = {
  mt: 0.5,

  color: '#64748B',

  fontSize: '0.74rem',

  fontWeight: 700,
}

/* ==========================================
   CONTENEDOR DE TABLA
========================================== */

export const tableContainerStyles = {
  width: '100%',

  overflow: 'hidden',

  border: '1px solid #E2ECE8',

  borderRadius: '20px',

  backgroundColor: '#FFFFFF',

  boxShadow:
    '0 8px 25px rgba(15,54,75,0.05)',
}

/* ==========================================
   ENCABEZADO DE TABLA
========================================== */

export const tableHeaderStyles = {
  display: 'flex',

  justifyContent: 'space-between',

  alignItems: {
    xs: 'stretch',
    sm: 'center',
  },

  flexDirection: {
    xs: 'column',
    sm: 'row',
  },

  gap: 2,

  p: {
    xs: 2,
    sm: 2.5,
  },

  backgroundColor: '#FFFFFF',
}

export const tableTitleStyles = {
  color: '#1E293B',

  fontSize: '0.95rem',

  fontWeight: 900,

  lineHeight: 1.2,
}

/* ==========================================
   BUSCADOR
========================================== */

export const searchFieldStyles = {
  width: {
    xs: '100%',
    sm: 320,
  },

  '& .MuiOutlinedInput-root': {
    height: 40,

    borderRadius: '12px',

    backgroundColor: '#F8FAFC',

    fontSize: '0.82rem',

    transition:
      'background-color 0.2s ease, box-shadow 0.2s ease',

    '& fieldset': {
      borderColor: '#CBD5E1',
    },

    '&:hover fieldset': {
      borderColor: '#94B8B0',
    },

    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',

      boxShadow:
        '0 0 0 3px rgba(0, 140, 122, 0.07)',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#008C7A',
    },
  },

  '& input::placeholder': {
    color: '#94A3B8',
    opacity: 1,
  },
}

/* ==========================================
   DATAGRID
========================================== */

export const dataGridStyles = {
  border: 'none',

  color: '#334155',

  backgroundColor: '#FFFFFF',

  fontSize: '0.8rem',

  /* ------------------------------------------
     ENCABEZADOS
  ------------------------------------------ */

  '& .MuiDataGrid-columnHeaders': {
    minHeight: '48px !important',

    color: '#47615E',

    backgroundColor:
      '#EEF6F3 !important',

    borderTop:
      '1px solid #E2ECE8',

    borderBottom:
      '1px solid #DDE8E5',
  },

  '& .MuiDataGrid-columnHeader': {
    minHeight: '48px !important',

    color: '#47615E',

    backgroundColor:
      '#EEF6F3 !important',

    outline: 'none !important',
  },

  '& .MuiDataGrid-columnHeaderTitleContainer': {
    overflow: 'visible',
  },

  '& .MuiDataGrid-columnHeaderTitle': {
    color: '#47615E',

    fontSize: '0.68rem',

    fontWeight: 900,

    textTransform: 'uppercase',

    letterSpacing: '0.04em',
  },

  '& .MuiDataGrid-columnSeparator': {
    color: '#D7E3E0',
  },

  '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
    color: '#64748B',
  },

  /* Algunas versiones nuevas de MUI X */
  '& .MuiDataGrid-filler': {
    backgroundColor:
      '#EEF6F3 !important',
  },

  '& .MuiDataGrid-scrollbarFiller': {
    backgroundColor:
      '#EEF6F3 !important',
  },

  /* ------------------------------------------
     FILAS
  ------------------------------------------ */

  '& .MuiDataGrid-row': {
    minHeight: '68px !important',

    borderBottom:
      '1px solid #E7EEEC',

    backgroundColor: '#FFFFFF',

    transition:
      'background-color 0.15s ease',
  },

  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: '#FCFDFD',
  },

  '& .MuiDataGrid-row:hover': {
    backgroundColor:
      '#F3FAF7 !important',
  },

  /* ------------------------------------------
     CELDAS
  ------------------------------------------ */

  '& .MuiDataGrid-cell': {
    minHeight: '68px !important',

    display: 'flex',

    alignItems: 'center',

    borderBottom: 'none',

    outline: 'none !important',

    color: '#334155',
  },

  '& .MuiDataGrid-cell:focus': {
    outline: 'none !important',
  },

  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },

  /* CÓDIGO */

  '& .MuiDataGrid-cell[data-field="codigoInterno"]': {
    color: '#082F49',

    fontWeight: 900,
  },

  /* PLACA */

  '& .MuiDataGrid-cell[data-field="placa"]': {
    color: '#0B5361',

    fontWeight: 800,
  },

  /* ------------------------------------------
     SELECT DE ESTADO
  ------------------------------------------ */

  '& .MuiDataGrid-cell[data-field="estado"] .MuiOutlinedInput-root':
    {
      height: 36,

      borderRadius: '10px',

      backgroundColor: '#FFFFFF',

      fontSize: '0.74rem',

      fontWeight: 700,

      '& fieldset': {
        borderColor: '#D7E3E0',
      },

      '&:hover fieldset': {
        borderColor: '#94B8B0',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#008C7A',
      },
    },

  '& .MuiDataGrid-cell[data-field="estado"] .MuiSelect-select':
    {
      py: 0.8,
    },

  /* ------------------------------------------
     CHIP ACTIVO / INACTIVO
  ------------------------------------------ */

  '& .MuiChip-root': {
    height: 27,

    borderRadius: '8px',

    fontSize: '0.68rem',

    fontWeight: 800,
  },

  '& .MuiChip-colorSuccess': {
    color: '#166534',

    backgroundColor: '#DCFCE7',
  },

  /* ------------------------------------------
     BOTONES
  ------------------------------------------ */

  '& .MuiButton-root': {
    minWidth: 85,

    px: 1.5,

    borderRadius: '9px',

    fontSize: '0.67rem',

    fontWeight: 900,

    textTransform: 'uppercase',
  },

  '& .MuiButton-colorError': {
    color: '#B42318',

    backgroundColor: '#FEF3F2',

    '&:hover': {
      backgroundColor: '#FEE4E2',
    },
  },

  '& .MuiButton-colorSuccess': {
    color: '#067647',

    backgroundColor: '#ECFDF3',

    '&:hover': {
      backgroundColor: '#D1FADF',
    },
  },

  /* ------------------------------------------
     FOOTER / PAGINACIÓN
  ------------------------------------------ */

  '& .MuiDataGrid-footerContainer': {
    minHeight: 56,

    borderTop:
      '1px solid #E2ECE8',

    backgroundColor: '#FAFCFB',

    color: '#64748B',
  },

  '& .MuiTablePagination-root': {
    color: '#64748B',
  },

  '& .MuiTablePagination-selectLabel': {
    fontSize: '0.74rem',
  },

  '& .MuiTablePagination-displayedRows': {
    fontSize: '0.74rem',
  },

  '& .MuiTablePagination-select': {
    fontSize: '0.74rem',
  },

  /* ------------------------------------------
     SIN RESULTADOS
  ------------------------------------------ */

  '& .MuiDataGrid-overlay': {
    color: '#64748B',

    backgroundColor:
      'rgba(255,255,255,0.92)',
  },

  /* ------------------------------------------
     SCROLL
  ------------------------------------------ */

  '& .MuiDataGrid-scrollbar::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },

  '& .MuiDataGrid-scrollbar::-webkit-scrollbar-thumb':
    {
      borderRadius: 10,

      backgroundColor: '#CBD5E1',
    },

  '& .MuiDataGrid-scrollbar::-webkit-scrollbar-track':
    {
      backgroundColor: '#F8FAFC',
    },
}
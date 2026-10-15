const tarjeta = {
  border: '1px solid #DFE9E5',
  borderRadius: '20px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 8px 25px rgba(8,47,73,0.04)',
}

export const reportesStyles = {
  pagina: {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  encabezado: {
    ...tarjeta,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: {
      xs: 'flex-start',
      md: 'center',
    },
    flexDirection: {
      xs: 'column',
      md: 'row',
    },
    gap: 3,
    p: {
      xs: 3,
      md: 4,
    },
    borderTop: '5px solid #008C7A',
  },

  encabezadoContenido: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    minWidth: 0,
  },

  encabezadoIcono: {
    width: 54,
    height: 54,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '16px',
    color: '#008C7A',
    backgroundColor: '#DDF5EE',

    '& .MuiSvgIcon-root': {
      fontSize: 30,
    },
  },

  titulo: {
    color: '#082F49',
    fontSize: {
      xs: '1.4rem',
      md: '1.8rem',
    },
    fontWeight: 800,
    lineHeight: 1.25,
  },

  descripcion: {
    mt: 0.8,
    color: '#64748B',
    fontSize: '0.92rem',
    lineHeight: 1.6,
  },

  botonPrincipal: {
    px: 3,
    py: 1.2,
    borderRadius: '12px',
    backgroundColor: '#008C7A',
    textTransform: 'none',
    fontWeight: 700,
    boxShadow: 'none',
    whiteSpace: 'nowrap',

    '&:hover': {
      backgroundColor: '#006F61',
      boxShadow: 'none',
    },
  },

  seccion: {
    ...tarjeta,
    minWidth: 0,
    p: {
      xs: 2,
      md: 3,
    },
  },

  seccionTitulo: {
    color: '#082F49',
    fontSize: '1.15rem',
    fontWeight: 800,
    mb: 1,
  },

  textoSecundario: {
    color: '#64748B',
    fontSize: '0.88rem',
    lineHeight: 1.6,
  },

  filtrosGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
    gap: 2,
    mt: 3,

    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
  },

  botonLimpiar: {
    mt: 2,
    color: '#008C7A',
    textTransform: 'none',
    fontWeight: 700,
  },

  indicadoresGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(5, minmax(0, 1fr))',
    },
    gap: 2,
  },

  indicador: {
    ...tarjeta,
    minWidth: 0,
    p: 3,
  },

  indicadorTitulo: {
    color: '#64748B',
    fontSize: '0.88rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },

  indicadorCantidad: {
    mt: 1,
    color: '#082F49',
    fontSize: '2.2rem',
    fontWeight: 800,
    lineHeight: 1.2,
  },

  cargando: {
    minHeight: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 2,
    color: '#64748B',

    '& .MuiCircularProgress-root': {
      color: '#008C7A',
    },
  },

  vacio: {
    minHeight: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 3,
    color: '#64748B',
    textAlign: 'center',
  },

  tabla: {
    minWidth: 760,

    '& .MuiTableCell-head': {
      backgroundColor: '#F1F7F5',
      color: '#475569',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    },

    '& .MuiTableCell-root': {
      borderBottom: '1px solid #EDF2F0',
      py: 1.8,
    },

    '& .MuiTableRow-root:hover .MuiTableCell-body': {
      backgroundColor: '#FAFCFB',
    },
  },

  observaciones: {
    minWidth: 180,
    maxWidth: 320,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
}
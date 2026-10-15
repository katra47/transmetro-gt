const tarjeta = {
  border: '1px solid #DFE9E5',
  borderRadius: '20px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 8px 25px rgba(8,47,73,0.04)',
}

export const pasajerosHomeStyles = {
  pagina: {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  encabezado: {
    position: 'relative',
    overflow: 'hidden',
    p: {
      xs: 3,
      md: 5,
    },
    pb: {
      xs: 4,
      md: 6,
    },
    borderRadius: '24px',
    color: '#FFFFFF',
    background:
      'linear-gradient(125deg, #082F49 0%, #0A5968 58%, #008C7A 100%)',

    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: 6,
      background:
        'repeating-linear-gradient(90deg, #13B8A6 0 35px, #D6A84B 35px 55px, #B4533C 55px 75px, #F8F4E8 75px 85px)',
    },
  },

  chipEncabezado: {
    mb: 2,
    color: '#FFE29B',
    backgroundColor: 'rgba(214,168,75,0.14)',
    border: '1px solid rgba(214,168,75,0.35)',
    fontWeight: 700,
    maxWidth: '100%',
  },

  titulo: {
    maxWidth: 800,
    color: '#FFFFFF',
    fontSize: {
      xs: '1.8rem',
      sm: '2.3rem',
      md: '2.8rem',
    },
    fontWeight: 800,
    lineHeight: 1.2,
    overflowWrap: 'anywhere',
  },

  descripcion: {
    maxWidth: 700,
    mt: 2,
    color: 'rgba(255,255,255,0.85)',
    fontSize: '1rem',
    lineHeight: 1.7,
  },

  accesosGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      md: 'repeat(auto-fit, minmax(280px, 1fr))',
    },
    gap: 2,
  },

  accesoTarjeta: {
    ...tarjeta,
    minWidth: 0,
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1.5,
  },

  accesoIcono: {
    width: 48,
    height: 48,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    color: '#008C7A',
    backgroundColor: '#DDF5EE',
  },

  accesoTitulo: {
    color: '#082F49',
    fontSize: '1.1rem',
    fontWeight: 800,
  },

  textoSecundario: {
    color: '#64748B',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    overflowWrap: 'anywhere',
  },

  botonTexto: {
    color: '#008C7A',
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: '10px',

    '&:hover': {
      backgroundColor: '#E5F5EF',
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
    fontSize: {
      xs: '1.15rem',
      md: '1.35rem',
    },
    fontWeight: 800,
    lineHeight: 1.4,
    mb: 1,
    overflowWrap: 'anywhere',
  },

  detalleEncabezado: {
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
    gap: 1,
    mb: 2,
  },

  buscador: {
    mt: 2,
    mb: 2,

    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
  },

  estacionesGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 2,
    mt: 2,
  },

  estacionTarjeta: {
    ...tarjeta,
    minWidth: 0,
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1.5,
    transition:
      'border-color 0.2s ease, background-color 0.2s ease',
  },

  estacionSeleccionada: {
    borderColor: '#008C7A',
    backgroundColor: '#F0FAF6',
    boxShadow: '0 0 0 1px #008C7A',
  },

  estacionNombre: {
    color: '#082F49',
    fontSize: '1rem',
    fontWeight: 800,
    lineHeight: 1.4,
    overflowWrap: 'anywhere',
  },

  cargando: {
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    color: '#64748B',

    '& .MuiCircularProgress-root': {
      color: '#008C7A',
    },
  },

  vacio: {
    minHeight: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 3,
    color: '#64748B',
    textAlign: 'center',
  },
}
const tarjeta = {
  border: '1px solid #DFE9E5',
  borderRadius: '20px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 8px 25px rgba(8,47,73,0.04)',
}

export const homeStyles = {
  pagina: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  cargando: {
    minHeight: 250,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 2,
  },

  acceso: {
    ...tarjeta,
    p: { xs: 3, md: 5 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },

  titulo: {
    color: '#082F49',
    fontSize: { xs: '1.6rem', md: '2rem' },
    fontWeight: 800,
  },

  encabezado: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', md: 'center' },
    flexDirection: { xs: 'column', md: 'row' },
    gap: 3,
    p: { xs: 3, md: 4 },
    pb: { xs: 4, md: 5 },
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

  chip: {
    mb: 2,
    color: '#FFE29B',
    backgroundColor: 'rgba(214,168,75,0.14)',
    border: '1px solid rgba(214,168,75,0.35)',
    fontWeight: 700,
  },

  tituloEncabezado: {
    fontSize: { xs: '1.7rem', md: '2.2rem' },
    fontWeight: 800,
    lineHeight: 1.2,
    overflowWrap: 'anywhere',
  },

  descripcionEncabezado: {
    mt: 1,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  },

  chipTiempoReal: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    maxWidth: '100%',
    height: 'auto',

    '& .MuiChip-label': {
      whiteSpace: 'normal',
      py: 1,
    },
  },

  indicadoresGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
    gap: 2,
  },

  indicador: {
    ...tarjeta,
    p: 3,
    minWidth: 0,
  },

  indicadorIcono: {
    width: 46,
    height: 46,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    mb: 2,
  },

  indicadorTitulo: {
    color: '#475569',
    fontSize: '0.9rem',
    fontWeight: 600,
  },

  indicadorCantidad: {
    color: '#082F49',
    fontSize: '2.4rem',
    fontWeight: 800,
    lineHeight: 1.4,
  },

  textoSecundario: {
    color: '#64748B',
    fontSize: '0.88rem',
    lineHeight: 1.6,
  },

  contenidoGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      lg: 'repeat(auto-fit, minmax(360px, 1fr))',
    },
    gap: 3,
  },

  seccion: {
    ...tarjeta,
    p: { xs: 2, md: 3 },
    minWidth: 0,
  },

  seccionEncabezado: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    mb: 3,
  },

  seccionTitulo: {
    color: '#082F49',
    fontSize: '1.15rem',
    fontWeight: 800,
    mb: 0.5,
  },

  tabla: {
    minWidth: 540,

    '& .MuiTableCell-head': {
      color: '#475569',
      backgroundColor: '#F1F7F5',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    },

    '& .MuiTableCell-root': {
      borderBottom: '1px solid #EDF2F0',
      py: 1.8,
    },
  },

  notaTabla: {
    mt: 2,
    color: '#64748B',
    fontSize: '0.8rem',
  },

  vacio: {
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    color: '#64748B',
    textAlign: 'center',
  },

  alertas: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    mt: 3,

    '& .MuiAlert-root': {
      borderRadius: '12px',
    },
  },

  accesosGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
    gap: 2,
    mt: 2,
  },

  accesoTarjeta: {
    ...tarjeta,
    display: 'block',
    p: 3,
    color: 'inherit',
    textDecoration: 'none',
    transition:
      'transform 0.2s ease, border-color 0.2s ease',

    '&:hover': {
      transform: 'translateY(-3px)',
      borderColor: '#008C7A',
    },

    '&:focus-visible': {
      outline: '3px solid #008C7A',
      outlineOffset: 3,
    },
  },

  accesoIcono: {
    width: 44,
    height: 44,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '12px',
    color: '#008C7A',
    backgroundColor: '#DDF5EE',
    mb: 2,
  },

  accesoTitulo: {
    color: '#082F49',
    fontSize: '1rem',
    fontWeight: 800,
    mb: 1,
  },

  accesoAccion: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: '#008C7A',
    fontSize: '0.85rem',
    fontWeight: 700,
    mt: 2,
  },

  boton: {
    backgroundColor: '#008C7A',
    textTransform: 'none',
    borderRadius: '10px',

    '&:hover': {
      backgroundColor: '#006F61',
    },
  },

  botonTexto: {
    color: '#008C7A',
    textTransform: 'none',
    whiteSpace: 'nowrap',
  },
}
const usuariosPageStyles = {
  page: {
    width: '100%',
    minHeight: 'calc(100vh - 72px)',
    px: {
      xs: 2,
      sm: 3,
      md: 5,
    },
    py: {
      xs: 3,
      md: 4,
    },
    backgroundColor: '#F3F7F9',
  },

  container: {
    width: '100%',
    maxWidth: 1250,
    mx: 'auto',
  },

  header: {
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    alignItems: {
      xs: 'stretch',
      sm: 'center',
    },
    justifyContent: 'space-between',
    gap: 2,
    mb: 3,
  },

  headerInformation: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  headerIcon: {
    width: 58,
    height: 58,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    color: '#FFFFFF',
    background:
      'linear-gradient(135deg, #073E55, #008F87)',
    boxShadow: '0 10px 25px rgba(0, 143, 135, 0.25)',
  },

  title: {
    color: '#082A43',
    fontWeight: 800,
    fontSize: {
      xs: '1.7rem',
      md: '2rem',
    },
  },

  subtitle: {
    mt: 0.4,
    color: '#667985',
  },

  addButton: {
    minHeight: 46,
    px: 2.5,
    borderRadius: 2.5,
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: '#008F87',
    boxShadow: '0 8px 20px rgba(0, 143, 135, 0.2)',

    '&:hover': {
      backgroundColor: '#00766F',
      boxShadow: '0 10px 24px rgba(0, 118, 111, 0.28)',
    },
  },

  summary: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 2,
    mb: 3,
  },

  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    p: 2.2,
    borderRadius: 3,
    border: '1px solid #DDE7EB',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(8, 42, 67, 0.06)',
  },

  summaryIcon: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    color: '#008F87',
    backgroundColor: '#E2F5F2',
  },

  summaryValue: {
    color: '#082A43',
    fontSize: '1.35rem',
    fontWeight: 800,
    lineHeight: 1,
  },

  summaryLabel: {
    mt: 0.5,
    color: '#70818A',
    fontSize: '0.82rem',
  },

  filtersPaper: {
    p: 2,
    mb: 2.5,
    borderRadius: 3,
    border: '1px solid #DDE7EB',
    boxShadow: '0 8px 24px rgba(8, 42, 67, 0.05)',
  },

  filters: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'minmax(260px, 1fr) 220px 220px',
    },
    gap: 1.5,
  },

  filterField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.2,
      backgroundColor: '#FFFFFF',
    },
  },

  tablePaper: {
    borderRadius: 3.5,
    overflow: 'hidden',
    border: '1px solid #DDE7EB',
    boxShadow: '0 14px 35px rgba(8, 42, 67, 0.08)',
  },

  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },

  tableHeader: {
    backgroundColor: '#0A3B53',

    '& .MuiTableCell-root': {
      color: '#FFFFFF',
      fontWeight: 800,
      borderBottom: 'none',
      whiteSpace: 'nowrap',
    },
  },

  tableRow: {
    '&:nth-of-type(even)': {
      backgroundColor: '#F8FAFB',
    },

    '&:hover': {
      backgroundColor: '#EFF7F7',
    },

    '& .MuiTableCell-root': {
      color: '#425965',
      borderColor: '#E5ECEF',
    },
  },

  userInformation: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    minWidth: 210,
  },

  avatar: {
    width: 42,
    height: 42,
    color: '#FFFFFF',
    fontWeight: 800,
    backgroundColor: '#008F87',
  },

  userName: {
    color: '#123B52',
    fontWeight: 800,
  },

  userEmail: {
    mt: 0.2,
    color: '#74858E',
    fontSize: '0.82rem',
  },

  uid: {
    maxWidth: 180,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: '#627781',
  },

  roleChip: {
    color: '#17576C',
    fontWeight: 700,
    backgroundColor: '#E5F1F4',
  },

  activeChip: {
    color: '#0A6B50',
    fontWeight: 800,
    backgroundColor: '#DDF5EB',
  },

  inactiveChip: {
    color: '#9A3B3B',
    fontWeight: 800,
    backgroundColor: '#FBE4E4',
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 0.5,
  },

  editButton: {
    color: '#0A6A7A',

    '&:hover': {
      backgroundColor: '#E1F1F3',
    },
  },

  deactivateButton: {
    color: '#B54747',

    '&:hover': {
      backgroundColor: '#FBEAEA',
    },
  },

  activateButton: {
    color: '#08765A',

    '&:hover': {
      backgroundColor: '#E0F5EC',
    },
  },

  loadingContainer: {
    minHeight: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    minHeight: 300,
    px: 3,
    py: 6,
    textAlign: 'center',
  },

  emptyIcon: {
    fontSize: 58,
    color: '#9AB0BA',
    mb: 1.5,
  },

  emptyTitle: {
    color: '#234A5D',
    fontWeight: 800,
  },

  emptyText: {
    mt: 0.7,
    color: '#71838D',
  },

  errorAlert: {
    mb: 3,
    borderRadius: 2.5,
  },

  headerActions: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: 1.5,
},

roleButton: {
  minHeight: 44,
  paddingX: 2.5,
  borderColor: '#008C7A',
  borderRadius: '12px',
  color: '#007467',
  fontWeight: 700,
  textTransform: 'none',

  '&:hover': {
    borderColor: '#006F63',
    backgroundColor: 'rgba(0, 140, 122, 0.08)',
  },
},

}

export default usuariosPageStyles
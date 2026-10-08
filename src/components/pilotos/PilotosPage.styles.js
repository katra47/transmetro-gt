const pilotosPageStyles = {
  page: {
    minHeight: 'calc(100vh - 76px)',
    backgroundColor: '#F3F7F6',
  },

  container: {
    width: '100%',
    maxWidth: 1450,
    marginX: 'auto',
    padding: {
      xs: 2,
      sm: 3,
      md: 4,
    },
  },

  header: {
    display: 'flex',
    alignItems: {
      xs: 'flex-start',
      sm: 'center',
    },
    justifyContent: 'space-between',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    gap: 2,
    marginBottom: 3,
  },

  headerInformation: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },

  headerIcon: {
    width: 54,
    height: 54,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    borderRadius: '16px',
    color: '#FFFFFF',
    background:
      'linear-gradient(135deg, #0B5361 0%, #008C7A 100%)',
    boxShadow: '0 10px 24px rgba(0, 111, 99, 0.20)',
  },

  title: {
    color: '#12343B',
    fontSize: {
      xs: '1.45rem',
      sm: '1.8rem',
    },
    fontWeight: 800,
  },

  subtitle: {
    marginTop: 0.3,
    color: '#657B76',
    fontSize: '0.88rem',
  },

  addButton: {
    minHeight: 44,
    paddingX: 2.5,
    borderRadius: '12px',
    color: '#FFFFFF',
    backgroundColor: '#008C7A',
    boxShadow: '0 8px 20px rgba(0, 140, 122, 0.20)',
    fontWeight: 800,
    textTransform: 'none',

    '&:hover': {
      backgroundColor: '#006F63',
      boxShadow: '0 10px 24px rgba(0, 111, 99, 0.25)',
    },
  },

  errorAlert: {
    marginBottom: 3,
    borderRadius: '13px',
  },

  summary: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
    gap: 2,
    marginBottom: 3,
  },

  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    padding: 2.2,
    border: '1px solid #DFEAE7',
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(20, 64, 72, 0.06)',
  },

  summaryIcon: {
    width: 44,
    height: 44,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    borderRadius: '13px',
    color: '#008C7A',
    backgroundColor: '#DDF5EE',
  },

  summaryValue: {
    color: '#12343B',
    fontSize: '1.35rem',
    fontWeight: 800,
    lineHeight: 1.1,
  },

  summaryLabel: {
    marginTop: 0.35,
    color: '#71837F',
    fontSize: '0.78rem',
  },

  filtersPaper: {
    marginBottom: 2.5,
    padding: 2,
    border: '1px solid #DFEAE7',
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
  },

  filters: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'minmax(260px, 2fr) repeat(2, minmax(180px, 1fr))',
    },
    gap: 2,
  },

  filterField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '11px',
      backgroundColor: '#FBFDFC',
    },
  },

  tablePaper: {
    overflow: 'hidden',
    border: '1px solid #DFEAE7',
    borderRadius: '18px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 12px 35px rgba(20, 64, 72, 0.07)',
  },

  tableContainer: {
    overflowX: 'auto',
  },

  tableHeader: {
    backgroundColor: '#EDF6F3',

    '& .MuiTableCell-head': {
      color: '#395B55',
      fontSize: '0.75rem',
      fontWeight: 800,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    },
  },

  tableRow: {
    transition: 'background-color 0.2s ease',

    '&:hover': {
      backgroundColor: '#F8FBFA',
    },

    '&:last-child td': {
      borderBottom: 0,
    },
  },

  pilotInformation: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.3,
    minWidth: 230,
  },

  avatar: {
    width: 40,
    height: 40,
    color: '#FFFFFF',
    backgroundColor: '#0B5361',
    fontSize: '0.85rem',
    fontWeight: 800,
  },

  pilotName: {
    color: '#173E45',
    fontSize: '0.86rem',
    fontWeight: 750,
  },

  pilotEmail: {
    marginTop: 0.2,
    color: '#7A8F8A',
    fontSize: '0.74rem',
  },

  code: {
    maxWidth: 130,
    overflow: 'hidden',
    color: '#4E6762',
    fontSize: '0.78rem',
    fontWeight: 700,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  licenseChip: {
    color: '#245E67',
    backgroundColor: '#E4F3F5',
    border: '1px solid #CDE6E9',
    fontWeight: 750,
  },

  activeChip: {
    color: '#08765F',
    backgroundColor: '#DCF6EC',
    border: '1px solid #BDE9DB',
    fontWeight: 750,
  },

  inactiveChip: {
    color: '#6B7280',
    backgroundColor: '#EEF1F3',
    border: '1px solid #DDE2E6',
    fontWeight: 750,
  },

  suspendedChip: {
    color: '#A34B36',
    backgroundColor: '#FBE9E3',
    border: '1px solid #F1CFC4',
    fontWeight: 750,
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 0.7,
  },

  editButton: {
    color: '#0B6470',
    backgroundColor: '#E3F2F3',

    '&:hover': {
      backgroundColor: '#CEE7E9',
    },
  },

  deactivateButton: {
    color: '#B4533C',
    backgroundColor: '#FBE9E3',

    '&:hover': {
      backgroundColor: '#F4D6CC',
    },
  },

  activateButton: {
    color: '#08765F',
    backgroundColor: '#DCF6EC',

    '&:hover': {
      backgroundColor: '#C5ECDD',
    },
  },

  loadingContainer: {
    minHeight: 320,
    display: 'grid',
    placeItems: 'center',
  },

  emptyContainer: {
    minHeight: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 4,
    textAlign: 'center',
  },

  emptyIcon: {
    marginBottom: 1.5,
    color: '#9CB4AE',
    fontSize: 58,
  },

  emptyTitle: {
    color: '#294E55',
    fontSize: '1rem',
    fontWeight: 800,
  },

  emptyText: {
    maxWidth: 420,
    marginTop: 0.7,
    color: '#7B908B',
    fontSize: '0.82rem',
  },
}

export default pilotosPageStyles
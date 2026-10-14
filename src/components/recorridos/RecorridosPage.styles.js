const recorridosPageStyles = {
  page: {
    minHeight: 'calc(100vh - 76px)',
    padding: {
      xs: 2,
      md: 4,
    },
    backgroundColor: '#F4F8F7',
  },

  container: {
    width: '100%',
    maxWidth: 1350,
    margin: '0 auto',
  },

  header: {
    marginBottom: 3,
    padding: {
      xs: 2.5,
      md: 4,
    },
    borderRadius: '24px',
    color: '#FFFFFF',
    background:
      'linear-gradient(120deg, #082F49 0%, #0B5361 58%, #008C7A 100%)',
  },

  headerContent: {
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
  },

  headerInformation: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  headerIcon: {
    width: 58,
    height: 58,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '17px',
    color: '#082F49',
    backgroundColor: '#D6A84B',
  },

  title: {
    fontSize: {
      xs: '1.65rem',
      md: '2rem',
    },
    fontWeight: 900,
  },

  description: {
    color: 'rgba(255,255,255,0.72)',
  },

  addButton: {
    borderRadius: '12px',
    color: '#082F49',
    backgroundColor: '#D6A84B',
    fontWeight: 800,

    '&:hover': {
      backgroundColor: '#E3B95D',
    },
  },

  statisticsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(5, minmax(0, 1fr))',
    },
    gap: 2,
    marginBottom: 3,
  },

  statisticCard: {
    padding: 2.2,
    border: '1px solid #E2ECE8',
    borderRadius: '18px',
    backgroundColor: '#FFFFFF',
  },

  statisticValue: {
    color: '#082F49',
    fontSize: '1.45rem',
    fontWeight: 900,
  },

  statisticLabel: {
    color: '#64748B',
    fontSize: '0.78rem',
    fontWeight: 600,
  },

  contentCard: {
    overflow: 'hidden',
    border: '1px solid #E2ECE8',
    borderRadius: '20px',
    backgroundColor: '#FFFFFF',
  },

  toolbar: {
    display: 'flex',
    alignItems: {
      xs: 'stretch',
      sm: 'center',
    },
    justifyContent: 'space-between',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    gap: 2,
    padding: 2.5,
  },

  searchField: {
    width: {
      xs: '100%',
      sm: 350,
    },

    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#F8FAFC',
    },
  },

  tableHeader: {
    backgroundColor: '#F1F7F5',

    '& .MuiTableCell-root': {
      color: '#47615E',
      fontSize: '0.72rem',
      fontWeight: 800,
      textTransform: 'uppercase',
    },
  },

  primaryText: {
    color: '#102F3C',
    fontWeight: 700,
  },

  secondaryText: {
    color: '#64748B',
    fontSize: '0.75rem',
  },

  statusChip: {
    fontSize: '0.7rem',
    fontWeight: 800,
  },

  loadingContainer: {
    minHeight: 300,
    display: 'grid',
    placeItems: 'center',
  },

  emptyContainer: {
    minHeight: 300,
    display: 'grid',
    placeItems: 'center',
    padding: 4,
    textAlign: 'center',
  },

  alert: {
    marginBottom: 2,
    borderRadius: '12px',
  },

  snackbarAlert: {
    width: '100%',
  },
}

export default recorridosPageStyles
const parqueosPageStyles = {
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
    maxWidth: 1280,
    margin: '0 auto',
  },

  header: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 3,
    padding: {
      xs: 2.5,
      md: 4,
    },
    borderRadius: '24px',
    color: '#FFFFFF',
    background:
      'linear-gradient(120deg, #082F49 0%, #0B5361 58%, #008C7A 100%)',
    boxShadow: '0 18px 45px rgba(7,47,62,0.18)',
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
    marginTop: 0.5,
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.9rem',
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
      sm: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 2,
    marginBottom: 3,
  },

  statisticCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    padding: 2.2,
    border: '1px solid #E2ECE8',
    borderRadius: '18px',
    backgroundColor: '#FFFFFF',
  },

  statisticIcon: {
    width: 44,
    height: 44,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '13px',
    color: '#007A70',
    backgroundColor: '#DDF5EE',
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
    borderBottom: '1px solid #E8EFEC',
  },

  sectionTitle: {
    color: '#082F49',
    fontWeight: 800,
  },

  searchField: {
    width: {
      xs: '100%',
      sm: 340,
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
      fontSize: '0.74rem',
      fontWeight: 800,
      textTransform: 'uppercase',
    },
  },

  tableRow: {
    '&:hover': {
      backgroundColor: '#FAFCFB',
    },
  },

  code: {
    color: '#006F63',
    fontWeight: 900,
  },

  name: {
    color: '#102F3C',
    fontWeight: 700,
  },

  secondaryText: {
    color: '#64748B',
    fontSize: '0.78rem',
  },

  statusChip: {
    fontSize: '0.7rem',
    fontWeight: 800,
  },

  actionButton: {
    color: '#0B5361',
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

  emptyTitle: {
    color: '#082F49',
    fontWeight: 800,
  },

  emptyDescription: {
    marginTop: 0.7,
    color: '#64748B',
  },

  alert: {
    marginBottom: 2,
    borderRadius: '12px',
  },

  snackbarAlert: {
    width: '100%',
  },
}

export default parqueosPageStyles
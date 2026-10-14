const lineasPageStyles = {
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
      sm: 'repeat(3, minmax(0, 1fr))',
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
    padding: 2.5,
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
      fontSize: '0.72rem',
      fontWeight: 800,
      textTransform: 'uppercase',
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
    fontSize: '0.76rem',
  },

  stationChip: {
    color: '#006F63',
    backgroundColor: '#DDF5EE',
    fontWeight: 800,
    cursor: 'help',
  },

  noStationsChip: {
    color: '#9A6500',
    backgroundColor: '#FFF2CC',
    fontWeight: 800,
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
  },

  alert: {
    marginBottom: 2,
    borderRadius: '12px',
  },

  stationDialogPaper: {
    width: '100%',
    maxWidth: 900,
    borderRadius: '22px',
    backgroundColor: '#FFFEFA',
  },

  stationDialogTitle: {
    padding: 2,
  },

  stationDialogHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    padding: 3,
    color: '#FFFFFF',
    background:
      'linear-gradient(120deg, #082F49, #008C7A)',
  },

  stationDialogIcon: {
    width: 46,
    height: 46,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    color: '#082F49',
    backgroundColor: '#D6A84B',
  },

  stationDialogContent: {
    padding: 3,
  },

  stationForm: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: '2fr 0.7fr 1fr auto',
    },
    alignItems: 'center',
    gap: 1.5,
    marginBottom: 3,
    padding: 2,
    border: '1px solid #DDE9E5',
    borderRadius: '16px',
    backgroundColor: '#F7FBFA',
  },

  stationField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '11px',
      backgroundColor: '#FFFFFF',
    },
  },

  routeSummary: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
    marginBottom: 2,
  },

  summaryChip: {
    color: '#0B5361',
    backgroundColor: '#E2F3EF',
    fontWeight: 800,
  },

  dialogCloseButton: {
    marginLeft: 'auto',
    color: '#FFFFFF',
  },

  snackbarAlert: {
    width: '100%',
  },
}

export default lineasPageStyles
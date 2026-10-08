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
    boxShadow: '0 18px 45px rgba(7, 47, 62, 0.18)',

    '&::after': {
      content: '""',
      position: 'absolute',
      width: 220,
      height: 220,
      right: -70,
      top: -90,
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.07)',
    },
  },

  headerContent: {
    position: 'relative',
    zIndex: 1,
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
    flexShrink: 0,
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
    maxWidth: 650,
    marginTop: 0.5,
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.9rem',
  },

  addButton: {
    flexShrink: 0,
    borderRadius: '12px',
    color: '#082F49',
    backgroundColor: '#D6A84B',
    fontWeight: 800,
    boxShadow: '0 10px 25px rgba(0,0,0,0.18)',

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
    boxShadow: '0 10px 30px rgba(7, 47, 62, 0.07)',
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
    lineHeight: 1,
  },

  statisticLabel: {
    marginTop: 0.5,
    color: '#64748B',
    fontSize: '0.78rem',
    fontWeight: 600,
  },

  contentCard: {
    overflow: 'hidden',
    border: '1px solid #E2ECE8',
    borderRadius: '20px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 14px 40px rgba(7, 47, 62, 0.08)',
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
    fontSize: '1.05rem',
    fontWeight: 800,
  },

  searchField: {
    width: {
      xs: '100%',
      sm: 330,
    },

    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#F8FAFC',

      '&.Mui-focused fieldset': {
        borderColor: '#008C7A',
      },
    },
  },

  tableContainer: {
    overflowX: 'auto',
  },

  tableHeader: {
    backgroundColor: '#F1F7F5',

    '& .MuiTableCell-root': {
      color: '#47615E',
      fontSize: '0.74rem',
      fontWeight: 800,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
  },

  tableRow: {
    '&:last-child .MuiTableCell-root': {
      borderBottom: 0,
    },

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

  descriptionCell: {
    maxWidth: 300,
    color: '#64748B',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  statusChip: {
    fontWeight: 800,
    fontSize: '0.7rem',
  },

  actionsCell: {
    width: 80,
    textAlign: 'right',
  },

  actionButton: {
    color: '#0B5361',

    '&:hover': {
      backgroundColor: '#E2F3EF',
    },
  },

  loadingContainer: {
    minHeight: 300,
    display: 'grid',
    placeItems: 'center',
  },

  emptyContainer: {
    minHeight: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 4,
    textAlign: 'center',
  },

  emptyIcon: {
    width: 64,
    height: 64,
    display: 'grid',
    placeItems: 'center',
    marginBottom: 2,
    borderRadius: '18px',
    color: '#008C7A',
    backgroundColor: '#DDF5EE',
  },

  emptyTitle: {
    color: '#082F49',
    fontSize: '1.1rem',
    fontWeight: 800,
  },

  emptyDescription: {
    maxWidth: 430,
    marginTop: 0.7,
    color: '#64748B',
    fontSize: '0.86rem',
  },

  alert: {
    marginBottom: 2,
    borderRadius: '12px',
  },

  snackbarAlert: {
    width: '100%',
  },
}

export default lineasPageStyles

export const tableContainerStyles = {
  mt: 4,
  p: { xs: 2, md: 3 },
  backgroundColor: '#FFFFFF',
  borderRadius: 3,
  boxShadow: '0 10px 35px rgba(15, 54, 75, 0.12)',
};

export const tableHeaderStyles = {
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
  mb: 3,
};

export const dataGridStyles = {
  border: 'none',

  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#0B3C5D',
    color: '#FFFFFF',
    fontWeight: 700,
  },

  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'rgba(0, 137, 123, 0.06)',
  },

  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
  },
};
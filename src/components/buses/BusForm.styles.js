export const formContainerStyles = {
  width: '100%',
  maxWidth: 900,
  mx: 'auto',
  p: { xs: 2, md: 4 },
  backgroundColor: '#ffffff',
  borderRadius: 3,
  boxShadow: '0 10px 35px rgba(15, 54, 75, 0.12)',
};

export const formGridStyles = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, 1fr)',
  },
  gap: 2.5,
  mt: 3,
};

export const fullWidthFieldStyles = {
  gridColumn: {
    xs: 'auto',
    md: '1 / -1',
  },
};

export const buttonContainerStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: 3,
};

export const submitButtonStyles = {
  minWidth: 180,
  py: 1.3,
  borderRadius: 2,
  fontWeight: 700,
  textTransform: 'none',
  backgroundColor: '#00897B',

  '&:hover': {
    backgroundColor: '#00695C',
  },
};
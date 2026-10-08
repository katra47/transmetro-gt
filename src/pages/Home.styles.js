export const homeStyles = {
  page: {
    width: '100%',
  },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: {
      xs: 3,
      sm: 4,
      md: 6,
    },
    borderRadius: {
      xs: '20px',
      md: '28px',
    },
    color: '#FFFFFF',
    background:
      'linear-gradient(125deg, #082F49 0%, #0A5968 58%, #008C7A 100%)',
    boxShadow: '0 22px 55px rgba(8, 47, 73, 0.18)',

    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: 7,
      background:
        'repeating-linear-gradient(90deg, #13B8A6 0 35px, #D6A84B 35px 55px, #B4533C 55px 75px, #F8F4E8 75px 85px)',
    },
  },

  decorationLarge: {
    position: 'absolute',
    top: -130,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  decorationSmall: {
    position: 'absolute',
    right: 230,
    bottom: -100,
    width: 190,
    height: 190,
    borderRadius: '50%',
    backgroundColor: 'rgba(214,168,75,0.08)',
  },

  heroContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 760,
  },

  panelChip: {
    marginBottom: 2,
    color: '#FFE29B',
    backgroundColor: 'rgba(214,168,75,0.14)',
    border: '1px solid rgba(214,168,75,0.35)',
    fontWeight: 700,
  },

  heroTitle: {
    maxWidth: 720,
    color: '#FFFFFF',
    fontSize: {
      xs: '2rem',
      sm: '2.6rem',
      md: '3.3rem',
    },
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
  },

  heroDescription: {
    maxWidth: 620,
    marginTop: 2,
    color: 'rgba(255,255,255,0.76)',
    fontSize: {
      xs: '0.95rem',
      md: '1.05rem',
    },
    lineHeight: 1.7,
  },

  heroButton: {
    marginTop: 3,
    paddingX: 3,
    paddingY: 1.2,
    borderRadius: '12px',
    color: '#082F49',
    backgroundColor: '#D6A84B',
    fontWeight: 800,
    textTransform: 'none',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: '#E5BC67',
      boxShadow: 'none',
      transform: 'translateY(-2px)',
    },
  },

  sectionHeader: {
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
    gap: 1,
    marginTop: 5,
    marginBottom: 2.5,
  },

  sectionTitle: {
    color: '#082F49',
    fontSize: '1.45rem',
    fontWeight: 800,
  },

  sectionDescription: {
    color: '#64748B',
    fontSize: '0.9rem',
  },

  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(3, 1fr)',
    },
    gap: 3,
  },

  optionCard: {
    display: 'block',
    height: '100%',
    padding: 3,
    color: 'inherit',
    textDecoration: 'none',
    border: '1px solid #DFE9E5',
    borderRadius: '20px',
    backgroundColor: 'rgba(255,255,255,0.88)',
    boxShadow: '0 8px 25px rgba(8,47,73,0.05)',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',

    '&:hover': {
      transform: 'translateY(-5px)',
      borderColor: '#9DDDD1',
      boxShadow: '0 18px 40px rgba(8,47,73,0.12)',
    },
  },

  optionIcon: {
    width: 52,
    height: 52,
    display: 'grid',
    placeItems: 'center',
    marginBottom: 2,
    borderRadius: '15px',
    color: '#007C70',
    backgroundColor: '#DDF5EE',
  },

  optionTitle: {
    color: '#082F49',
    fontSize: '1.15rem',
    fontWeight: 800,
  },

  optionDescription: {
    minHeight: 50,
    marginTop: 1,
    color: '#64748B',
    fontSize: '0.92rem',
    lineHeight: 1.6,
  },

  optionAction: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    marginTop: 2,
    color: '#008C7A',
    fontSize: '0.85rem',
    fontWeight: 800,
  },

  actionIcon: {
    fontSize: 18,
  },
}
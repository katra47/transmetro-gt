import { Link } from 'react-router-dom'

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import TrainRoundedIcon from '@mui/icons-material/TrainRounded'
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded'

import { homeStyles } from './Home.styles'

const mainOptions = [
  {
    title: 'Líneas',
    description:
      'Consulta y administra las líneas y rutas disponibles.',
    path: '/lineas',
    icon: <AltRouteRoundedIcon />,
  },
  {
    title: 'Estaciones',
    description:
      'Controla las estaciones, ubicaciones y accesos.',
    path: '/estaciones',
    icon: <TrainRoundedIcon />,
  },
  {
    title: 'Buses',
    description:
      'Supervisa las unidades, asignaciones y recorridos.',
    path: '/buses',
    icon: <DirectionsBusRoundedIcon />,
  },
]

function OptionCard({ title, description, path, icon }) {
  return (
    <Paper
      component={Link}
      to={path}
      elevation={0}
      sx={homeStyles.optionCard}
    >
      <Box sx={homeStyles.optionIcon}>
        {icon}
      </Box>

      <Typography sx={homeStyles.optionTitle}>
        {title}
      </Typography>

      <Typography sx={homeStyles.optionDescription}>
        {description}
      </Typography>

      <Box sx={homeStyles.optionAction}>
        Ver módulo

        <ArrowForwardRoundedIcon
          sx={homeStyles.actionIcon}
        />
      </Box>
    </Paper>
  )
}

function Home() {
  return (
    <Box sx={homeStyles.page}>
      <Paper
        component="section"
        elevation={0}
        sx={homeStyles.hero}
      >
        <Box sx={homeStyles.decorationLarge} />
        <Box sx={homeStyles.decorationSmall} />

        <Box sx={homeStyles.heroContent}>
          <Chip
            label="Panel principal"
            size="small"
            sx={homeStyles.panelChip}
          />

          <Typography
            component="h2"
            sx={homeStyles.heroTitle}
          >
            Control inteligente para las operaciones del Transmetro
          </Typography>

          <Typography sx={homeStyles.heroDescription}>
            Administra líneas, estaciones, buses y recorridos
            desde una plataforma centralizada, segura y
            diseñada para Guatemala.
          </Typography>

          <Button
            component={Link}
            to="/lineas"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={homeStyles.heroButton}
          >
            Comenzar
          </Button>
        </Box>
      </Paper>

      <Box sx={homeStyles.sectionHeader}>
        <Box>
          <Typography sx={homeStyles.sectionTitle}>
            Gestión principal
          </Typography>

          <Typography sx={homeStyles.sectionDescription}>
            Accede rápidamente a los módulos más utilizados.
          </Typography>
        </Box>
      </Box>

      <Box sx={homeStyles.cardsGrid}>
        {mainOptions.map((option) => (
          <OptionCard
            key={option.path}
            title={option.title}
            description={option.description}
            path={option.path}
            icon={option.icon}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Home
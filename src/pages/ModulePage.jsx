import {
  Box,
  Chip,
  Paper,
  Typography,
} from '@mui/material'

import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'

import { modulePageStyles } from './ModulePage.styles'

function ModulePage({
  title,
  description,
  icon,
  children,
}) {
  return (
    <Box sx={modulePageStyles.page}>
      <Paper
        component="section"
        elevation={0}
        sx={modulePageStyles.headerCard}
      >
        <Box sx={modulePageStyles.culturalLine} />

        <Box sx={modulePageStyles.headerContent}>
          <Box sx={modulePageStyles.iconContainer}>
            {icon || <DashboardCustomizeRoundedIcon />}
          </Box>

          <Box sx={modulePageStyles.information}>
            <Chip
              label="Módulo administrativo"
              size="small"
              sx={modulePageStyles.moduleChip}
            />

            <Typography
              component="h2"
              sx={modulePageStyles.title}
            >
              {title}
            </Typography>

            <Typography sx={modulePageStyles.description}>
              {description}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        component="section"
        elevation={0}
        sx={modulePageStyles.content}
      >
        {children || (
          <Box sx={modulePageStyles.emptyContent}>
            <Box>
              <Typography sx={modulePageStyles.emptyTitle}>
                Módulo preparado
              </Typography>

              <Typography
                sx={modulePageStyles.emptyDescription}
              >
                En esta sección agregaremos próximamente los
                formularios, tablas y funciones correspondientes.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ModulePage
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

import Header from './Header'

function MainLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F4F8F7',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          paddingTop: '76px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
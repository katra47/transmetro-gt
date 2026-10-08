import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import TrainRoundedIcon from '@mui/icons-material/TrainRounded'

import MainLayout from './components/MainLayout'
import Home from './pages/Home'
import ModulePage from './pages/ModulePage'
import BusesPage from './components/buses/BusesPage'

import LoginPage from './components/usuarios/LoginPage'
import ProtectedRoute from './components/usuarios/ProtectedRoute'
import RolesPage from './components/usuarios/RolesPage'
import UsuariosPage from './components/usuarios/UsuariosPage'
import PilotosPage from './components/pilotos/PilotosPage'
import LineasPage from './components/lineas/LineasPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route
            path="iniciar-sesion"
            element={<LoginPage />}
          />

          <Route
            path="lineas"
            element={
              <ProtectedRoute requiredPermission="lineas.ver">
                <LineasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="estaciones"
            element={
              <ModulePage
                title="Estaciones"
                description="Consulta las estaciones, ubicaciones y accesos."
                icon={<TrainRoundedIcon />}
              />
            }
          />

          <Route
            path="recorridos"
            element={
              <ModulePage
                title="Recorridos"
                description="Consulta los recorridos disponibles del Transmetro."
                icon={<RouteRoundedIcon />}
              />
            }
          />

          <Route
            path="buses"
            element={
              <ProtectedRoute requiredPermission="buses.consultar">
                <BusesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="pilotos"
            element={
              <ProtectedRoute permission="pilotos.consultar">
                <PilotosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="parqueos"
            element={
              <ProtectedRoute requiredPermission="parqueos.consultar">
                <ModulePage
                  title="Parqueos"
                  description="Administración de parqueos y espacios asignados a los buses."
                  icon={<LocalParkingRoundedIcon />}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="pagos"
            element={
              <ProtectedRoute requiredPermission="pagos.consultar">
                <ModulePage
                  title="Pagos"
                  description="Control de tarjetas de acceso y registro de transacciones."
                  icon={<CreditCardRoundedIcon />}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="usuarios"
            element={
              <ProtectedRoute requiredPermission="usuarios.consultar">
                <UsuariosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="roles"
            element={
              <ProtectedRoute requiredPermission="roles.consultar">
                <RolesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="personal-administrativo"
            element={
              <ProtectedRoute requiredPermission="personal.consultar">
                <ModulePage
                  title="Personal administrativo"
                  description="Registro y control de los empleados administrativos del Transmetro."
                  icon={<GroupsRoundedIcon />}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="reportes"
            element={
              <ProtectedRoute requiredPermission="reportes.consultar">
                <ModulePage
                  title="Reportes"
                  description="Consulta de indicadores, historiales e información operativa."
                  icon={<AssessmentRoundedIcon />}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
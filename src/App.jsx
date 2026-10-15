import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import MainLayout from './components/MainLayout'
import Home from './pages/Home'

import LoginPage from './components/usuarios/LoginPage'
import ProtectedRoute from './components/usuarios/ProtectedRoute'
import RolesPage from './components/usuarios/RolesPage'
import UsuariosPage from './components/usuarios/UsuariosPage'

import BusesPage from './components/buses/BusesPage'
import PilotosPage from './components/pilotos/PilotosPage'
import LineasPage from './components/lineas/LineasPage'
import EstacionesPage from './components/estaciones/EstacionesPage'
import ParqueosPage from './components/parqueos/ParqueosPage'
import RecorridosPage from './components/recorridos/RecorridosPage'

import ReportesPage from './components/reportes/ReportesPage'

import PasajerosPage from './components/pasajeros/PasajerosPage'
import PasajerosHome from './components/pasajeros/PasajerosHome'

import PagosPage from './components/pagos/PagosPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================
            LOGIN
        ======================================== */}

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/iniciar-sesion"
          element={<LoginPage />}
        />


        {/* ========================================
            PÁGINAS CON HEADER
        ======================================== */}

        <Route element={<MainLayout />}>

          {/* ========================================
              ADMINISTRACIÓN
          ======================================== */}

          <Route
            path="administracion"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="lineas"
            element={
              <ProtectedRoute requiredPermission="lineas.consultar">
                <LineasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="estaciones"
            element={
              <ProtectedRoute requiredPermission="estaciones.consultar">
                <EstacionesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="recorridos"
            element={
              <ProtectedRoute requiredPermission="recorridos.consultar">
                <RecorridosPage />
              </ProtectedRoute>
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
              <ProtectedRoute requiredPermission="pilotos.consultar">
                <PilotosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="parqueos"
            element={
              <ProtectedRoute requiredPermission="parqueos.consultar">
                <ParqueosPage />
              </ProtectedRoute>
            }
          />


          {/* ========================================
              PAGOS ADMINISTRATIVOS
          ======================================== */}

          <Route
            path="pagos"
            element={
              <ProtectedRoute requiredPermission="pagos.consultar">
                <PagosPage />
              </ProtectedRoute>
            }
          />


          {/* ========================================
              USUARIOS
          ======================================== */}

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


          {/* ========================================
              REPORTES
          ======================================== */}

          <Route
            path="reportes"
            element={
              <ProtectedRoute requiredPermission="reportes.consultar">
                <ReportesPage />
              </ProtectedRoute>
            }
          />


          {/* ========================================
              PASAJEROS
          ======================================== */}

          <Route
            path="pasajeros"
            element={<PasajerosPage />}
          />

          <Route
            path="pasajeros/inicio"
            element={<PasajerosHome />}
          />


          {/* ========================================
              PAGOS DEL PASAJERO
          ======================================== */}

          <Route
            path="pasajeros/pagos"
            element={
              <ProtectedRoute passengerOnly>
                <PagosPage />
              </ProtectedRoute>
            }
          />

        </Route>


        {/* ========================================
            RUTA NO ENCONTRADA
        ======================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
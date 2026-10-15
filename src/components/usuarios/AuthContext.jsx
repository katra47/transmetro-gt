import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  GoogleAuthProvider,
  browserLocalPersistence,
  inMemoryPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { auth, db } from '../../config/firebase'

const AuthContext = createContext(null)

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

function obtenerMensajeError(error) {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'La ventana de Google fue cerrada.'

    case 'auth/popup-blocked':
      return 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e intenta nuevamente.'

    case 'auth/cancelled-popup-request':
      return 'Ya hay otro inicio de sesión en proceso.'

    case 'auth/network-request-failed':
      return 'No fue posible conectar. Comprueba tu conexión.'

    case 'auth/unauthorized-domain':
      return 'Este dominio no está autorizado en Firebase Authentication.'

    default:
      return 'No fue posible iniciar sesión con Google.'
  }
}

function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [role, setRole] = useState(null)
  const [permissions, setPermissions] = useState([])

  // Una sesión recuperada del navegador entra como pasajero.
  // El administrador debe iniciar sesión desde su botón.
  const [accessMode, setAccessMode] = useState('PASAJERO')

  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)
  const [authError, setAuthError] = useState('')

  const operacionEnCurso = useRef(false)

  useEffect(() => {
    let vigente = true
    let version = 0

    const unsubscribe = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        const versionActual = ++version

        const sigueVigente = () => (
          vigente &&
          versionActual === version
        )

        setLoading(true)
        setAuthError('')
        setFirebaseUser(authenticatedUser)

        setUserProfile(null)
        setRole(null)
        setPermissions([])

        if (!authenticatedUser) {
          setLoading(false)
          return
        }

        /*
         * PASAJERO
         *
         * Usa su identidad de Google.
         * No necesita un rol administrativo.
         * No crea solicitudes en la colección usuarios.
         */
        if (accessMode === 'PASAJERO') {
          setUserProfile({
            id: authenticatedUser.uid,
            nombres:
              authenticatedUser.displayName ||
              'Pasajero',
            correo: authenticatedUser.email || '',
            fotoURL: authenticatedUser.photoURL || '',
          })

          setLoading(false)
          return
        }

        /*
         * ADMINISTRADOR
         *
         * Verifica el perfil y el rol registrados
         * en Firestore.
         */
        try {
          const userReference = doc(
            db,
            'usuarios',
            authenticatedUser.uid,
          )

          let userSnapshot = await getDoc(userReference)

          if (!sigueVigente()) return

          if (!userSnapshot.exists()) {
            await setDoc(userReference, {
              nombres:
                authenticatedUser.displayName ||
                'Usuario de Google',

              correo:
                authenticatedUser.email
                  ?.trim()
                  .toLowerCase() || '',

              fotoURL: authenticatedUser.photoURL || '',
              rolId: null,
              personalId: null,
              estado: 'PENDIENTE',
              creadoEn: serverTimestamp(),
              actualizadoEn: serverTimestamp(),
              ultimoAcceso: null,
            })

            if (!sigueVigente()) return

            userSnapshot = await getDoc(userReference)

            if (!sigueVigente()) return
          }

          if (!userSnapshot.exists()) {
            throw new Error(
              'No fue posible cargar el perfil.',
            )
          }

          const profileData = {
            ...userSnapshot.data(),
            id: userSnapshot.id,
          }

          setUserProfile(profileData)

          if (profileData.estado === 'PENDIENTE') {
            setAuthError(
              'Tu acceso administrativo está pendiente de autorización.',
            )
            return
          }

          if (profileData.estado !== 'ACTIVO') {
            setAuthError(
              'Esta cuenta no tiene acceso administrativo activo.',
            )
            return
          }

          if (!profileData.rolId) {
            setAuthError(
              'Un administrador debe asignar un rol a esta cuenta.',
            )
            return
          }

          const roleSnapshot = await getDoc(
            doc(db, 'roles', profileData.rolId),
          )

          if (!sigueVigente()) return

          if (!roleSnapshot.exists()) {
            setAuthError(
              'El rol asignado no existe.',
            )
            return
          }

          const roleData = {
            ...roleSnapshot.data(),
            id: roleSnapshot.id,
          }

          if (roleData.activo === false) {
            setAuthError(
              'El rol asignado está inactivo.',
            )
            return
          }

          setRole(roleData)

          setPermissions(
            Array.isArray(roleData.permisos)
              ? roleData.permisos
              : [],
          )
        } catch (error) {
          if (!sigueVigente()) return

          console.error(
            'Error al comprobar acceso administrativo:',
            error,
          )

          setUserProfile(null)
          setRole(null)
          setPermissions([])

          setAuthError(
            'No fue posible comprobar los permisos administrativos.',
          )
        } finally {
          if (sigueVigente()) {
            setLoading(false)
          }
        }
      },
    )

    return () => {
      vigente = false
      version += 1
      unsubscribe()
    }
  }, [accessMode])

  /*
   * INICIO DE SESIÓN
   *
   * PASAJERO: permanece guardado en el navegador.
   * ADMINISTRADOR: únicamente en memoria;
   * al recargar o cerrar debe volver a ingresar.
   */
  const iniciarSesion = useCallback(async (modo) => {
    if (operacionEnCurso.current) {
      throw new Error(
        'Ya hay un inicio de sesión en proceso.',
      )
    }

    operacionEnCurso.current = true

    setSigningIn(true)
    setAuthError('')

    setFirebaseUser(null)
    setUserProfile(null)
    setRole(null)
    setPermissions([])

    try {
      await signOut(auth)

      setAccessMode(modo)

      await setPersistence(
        auth,
        modo === 'ADMINISTRADOR'
          ? inMemoryPersistence
          : browserLocalPersistence,
      )

      return await signInWithPopup(
        auth,
        googleProvider,
      )
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error,
      )

      setAuthError(obtenerMensajeError(error))

      throw error
    } finally {
      operacionEnCurso.current = false
      setSigningIn(false)
    }
  }, [])

  const loginWithGoogle = useCallback(
    () => iniciarSesion('ADMINISTRADOR'),
    [iniciarSesion],
  )

  const loginPassengerWithGoogle = useCallback(
    () => iniciarSesion('PASAJERO'),
    [iniciarSesion],
  )

  const logout = useCallback(async () => {
    setAuthError('')

    await signOut(auth)

    setFirebaseUser(null)
    setUserProfile(null)
    setRole(null)
    setPermissions([])
    setAccessMode('PASAJERO')
  }, [])

  const isAuthenticated = Boolean(firebaseUser)

  const isAuthorized = Boolean(
    !loading &&
    !signingIn &&
    accessMode === 'ADMINISTRADOR' &&
    firebaseUser &&
    userProfile?.id === firebaseUser.uid &&
    userProfile?.estado === 'ACTIVO' &&
    role &&
    role.activo !== false,
  )

  const isPassenger = Boolean(
    !loading &&
    !signingIn &&
    accessMode === 'PASAJERO' &&
    firebaseUser,
  )

  const hasPermission = useCallback(
    (permission) => (
      isAuthorized &&
      (
        permissions.includes('*') ||
        permissions.includes(permission)
      )
    ),
    [isAuthorized, permissions],
  )

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        role,
        permissions,

        accessMode,
        loading,
        signingIn,
        authError,

        isAuthenticated,
        isAuthorized,
        isPassenger,

        loginWithGoogle,
        loginPassengerWithGoogle,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider.',
    )
  }

  return context
}

export {
  AuthProvider,
  useAuth,
}
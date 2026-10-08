import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  GoogleAuthProvider,
  onAuthStateChanged,
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

function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [role, setRole] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        setLoading(true)
        setAuthError('')
        setFirebaseUser(authenticatedUser)

        if (!authenticatedUser) {
          setUserProfile(null)
          setRole(null)
          setPermissions([])
          setLoading(false)
          return
        }

        try {
          const userReference = doc(
            db,
            'usuarios',
            authenticatedUser.uid,
          )

          let userSnapshot = await getDoc(userReference)

          if (!userSnapshot.exists()) {
            const pendingProfile = {
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
            }

            await setDoc(
              userReference,
              pendingProfile,
            )

            userSnapshot = await getDoc(userReference)

            setUserProfile({
              id: authenticatedUser.uid,
              ...pendingProfile,
            })

            setRole(null)
            setPermissions([])
            setAuthError(
              'Tu cuenta fue registrada. Un administrador debe asignarte un rol antes de que puedas acceder a las funciones administrativas.',
            )

            return
          }

          const profileData = {
            id: userSnapshot.id,
            ...userSnapshot.data(),
          }

          setUserProfile(profileData)

          if (profileData.estado === 'PENDIENTE') {
            setRole(null)
            setPermissions([])
            setAuthError(
              'Tu solicitud de acceso está pendiente de autorización.',
            )
            return
          }

          if (profileData.estado === 'INACTIVO') {
            setRole(null)
            setPermissions([])
            setAuthError(
              'Este usuario se encuentra inactivo. Comunícate con el administrador.',
            )
            return
          }

          if (profileData.estado !== 'ACTIVO') {
            setRole(null)
            setPermissions([])
            setAuthError(
              'El estado de este usuario no permite el acceso administrativo.',
            )
            return
          }

          if (!profileData.rolId) {
            setRole(null)
            setPermissions([])
            setAuthError(
              'Este usuario todavía no tiene un rol asignado.',
            )
            return
          }

          const roleReference = doc(
            db,
            'roles',
            profileData.rolId,
          )

          const roleSnapshot = await getDoc(roleReference)

          if (!roleSnapshot.exists()) {
            setRole(null)
            setPermissions([])
            setAuthError(
              'El rol asignado al usuario no existe.',
            )
            return
          }

          const roleData = {
            id: roleSnapshot.id,
            ...roleSnapshot.data(),
          }

          if (roleData.activo === false) {
            setRole(null)
            setPermissions([])
            setAuthError(
              'El rol asignado se encuentra inactivo.',
            )
            return
          }

          setRole(roleData)
          setPermissions(roleData.permisos ?? [])
        } catch (error) {
          console.error(
            'Error al cargar el usuario:',
            error,
          )

          setUserProfile(null)
          setRole(null)
          setPermissions([])
          setAuthError(
            'No fue posible comprobar los permisos del usuario.',
          )
        } finally {
          setLoading(false)
        }
      },
    )

    return unsubscribe
  }, [])

  const loginWithGoogle = useCallback(async () => {
    setAuthError('')

    try {
      return await signInWithPopup(
        auth,
        googleProvider,
      )
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error,
      )

      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError(
          'La ventana de inicio de sesión fue cerrada.',
        )
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError(
          'El navegador bloqueó la ventana de inicio de sesión.',
        )
      } else {
        setAuthError(
          'No fue posible iniciar sesión con Google.',
        )
      }

      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setAuthError('')
    await signOut(auth)
  }, [])

  const hasPermission = useCallback(
    (permission) => {
      return (
        permissions.includes('*') ||
        permissions.includes(permission)
      )
    },
    [permissions],
  )

  const isAuthenticated = Boolean(firebaseUser)

  const isAuthorized = Boolean(
    firebaseUser &&
    userProfile?.estado === 'ACTIVO' &&
    role,
  )

  const contextValue = useMemo(
    () => ({
      firebaseUser,
      userProfile,
      role,
      permissions,
      loading,
      authError,
      isAuthenticated,
      isAuthorized,
      loginWithGoogle,
      logout,
      hasPermission,
    }),
    [
      firebaseUser,
      userProfile,
      role,
      permissions,
      loading,
      authError,
      isAuthenticated,
      isAuthorized,
      loginWithGoogle,
      logout,
      hasPermission,
    ],
  )

  return (
    <AuthContext.Provider value={contextValue}>
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
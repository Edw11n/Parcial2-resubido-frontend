// src/components/ProtectedRoute.tsx
import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
// `children` es el componente que se va a proteger (ej: Dashboard, NotesView)
children: ReactElement
}

/**
 * Componente de ruta protegida.
 * Redirige al usuario al login si no está autenticado.
 */
function ProtectedRoute({ children }: ProtectedRouteProps): ReactElement {
// 1. Obtenemos el estado de autenticación de nuestro store persistente
const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

// 2. Verificación de seguridad
if (!isLoggedIn) {
    // Si no está logueado, redirige a la ruta principal (login)
    // `replace: true` evita que el usuario pueda volver a la página protegida con el botón 'Atrás'
    return <Navigate to="/" replace />
}

// 3. Si está logueado, renderiza los componentes hijos
return children
}

export default ProtectedRoute
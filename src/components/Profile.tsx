import { useNavigate } from 'react-router-dom'
import profilePhoto from '/profile.png'
import { useAuthStore } from '../store/authStore' 

interface ProfileProps {
onClose: () => void
// Eliminamos name, email y avatar de las props, ya que los obtendremos del store
}

function Profile({ onClose }: ProfileProps) {
const navigate = useNavigate()

// 1. Obtener los datos del usuario logueado y la acción de logout desde Zustand
const user = useAuthStore((state) => state.user)
const logout = useAuthStore((state) => state.logout)

// Datos predeterminados y chequeo de seguridad
const userName = user?.name || 'Usuario'
const userEmail = user?.email || 'email@desconocido.com'
// Simulación de un avatar predeterminado ya que no lo guardamos en el store
const userAvatar = profilePhoto 

const handleLogout = () => {
    // 2. Ejecutar la acción 'logout' de Zustand
    // Esto limpia: state.token, state.user, state.isLoggedIn y 
    // automáticamente limpia LocalStorage gracias al middleware 'persist'.
    logout() 
    
    alert('Has cerrado sesión correctamente.')
    navigate('/')
    onClose() // Aseguramos que el modal/popover se cierre
}

// **Nota:** En una aplicación real, probablemente harías una comprobación para no 
// renderizar este componente si 'user' es null, pero asumimos que es un componente 
// que solo se muestra cuando el usuario está logueado.

return (
    <div className="fixed top-0 right-0 mt-16 mr-4 w-72 bg-white rounded-xl shadow-lg p-4 z-50">
    <div className="flex items-center space-x-4 mb-4">
        {/* Usamos el avatar y los datos obtenidos del store */}
        <img src={userAvatar} alt={userName} className="w-12 h-12 rounded-full object-cover" />
        <div>
        <h3 className="text-lg font-semibold text-gray-800">{userName}</h3>
        <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
    </div>

    <div className="flex flex-col space-y-2">
        <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        onClick={handleLogout}
        >
        Cerrar sesión
        </button>
        <button
        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        onClick={onClose}
        >
        Cerrar
        </button>
    </div>
    </div>
)
}

export default Profile
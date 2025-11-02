import { useState, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Importamos la función de registro directamente desde nuestro store de Zustand
import { useAuthStore } from '../store/authStore' 

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Obtenemos la función para simular el registro desde Zustand
  const registerUser = useAuthStore((state) => state.registerUser)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword) {
      alert('Por favor completa todos los campos')
      return
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    try {
      // Usamos la acción de Zustand para simular el registro
      const { success, message } = registerUser(name, email, password)

      if (success) {
        // Al ser exitoso, el usuario ya está guardado en LocalStorage
        alert('Registro exitoso. Por favor, inicia sesión.')
        // Redirigimos al login (asumo que es la ruta '/')
        navigate('/') 
      } else {
        // Mostrar el error de validación (ej. email ya existe)
        alert(message || 'Error al registrar el usuario')
      }
    } catch (error: any) {
      // Esto solo capturaría errores internos de JavaScript
      console.error(error)
      alert(error.message || 'Error inesperado al registrar el usuario')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/book-icon.svg" alt="Share Notes Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-blue-700">SHARE NOTES</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-1">Crear cuenta</h2>
        <p className="text-gray-600 mb-6 text-center">Únete a la comunidad de estudiantes</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... Resto de los campos de formulario (Nombre, Correo, Contraseña, Confirmar Contraseña) ... */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Correo</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" required className="w-4 h-4 text-blue-600" />
            <label htmlFor="terms" className="text-gray-700 text-sm">
              Acepto los términos de servicio y política de privacidad
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continuar
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <span>¿Ya tienes una cuenta? </span>
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
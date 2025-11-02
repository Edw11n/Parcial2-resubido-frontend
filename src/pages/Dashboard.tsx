// src/components/Dashboard.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Profile from '../components/Profile'
import profilePhoto from '/profile.png'

import { useAuthStore } from '../store/authStore'
import { useNotesStore, Category } from '../store/notesStore'


function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const getCategories = useNotesStore((state) => state.getCategories) 

  const [categories, setCategories] = useState<Category[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadedCategories = getCategories()
    setCategories(loadedCategories)
  }, [getCategories]) 

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/notes/${categoryName}`)
  }
  
  const handleUploadClick = () => {
    navigate('/upload')
  }

  const handleSearchClick = () => {
    navigate('/search') 
  }

  const handleFavoritesClick = () => {
    navigate('/favorites')
  }

  // Protección simple de ruta
  useEffect(() => {
    if (!user) {
        navigate('/', { replace: true }) 
    }
  }, [user, navigate])


  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-light">Cargando perfil...</div>
  }
  
  const userAvatar = profilePhoto

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <header className="bg-white flex items-center justify-between px-8 py-4 shadow-soft">
        {/* Logo */}
        <div className="logo-section">
          <h1 className="text-primary text-xl font-bold">SHARE NOTES</h1>
        </div>

        {/* Navegación */}
        <nav className="flex gap-5">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-dark hover:bg-gray-light transition text-base font-medium text-primary bg-primary/10">
            Mis Apuntes
          </button>
          
          <button 
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-dark hover:bg-gray-light transition text-base font-medium"
          >
            Subir Material
          </button>
          
          <button 
            onClick={handleSearchClick}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-dark hover:bg-gray-light transition text-base font-medium"
          >
            Buscar Apuntes
          </button>
          
          <button 
            onClick={handleFavoritesClick} // <-- Enlazado
            className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-dark hover:bg-gray-light transition text-base font-medium"
          >
            Favoritos
          </button>
        </nav>

        {/* Usuario */}
        <div
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={profilePhoto}
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{user.name}</span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="px-8 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl text-text-primary mb-6 font-semibold">Materias</h2>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white p-6 rounded-lg shadow-soft text-center cursor-pointer hover:-translate-y-1 hover:shadow-softHover transition"
            >
              <span className="block text-4xl mb-3">📚</span>
              <h3 className="text-lg text-text-primary font-semibold mb-1">
                {category.name}
              </h3>
              <p className="text-text-secondary mb-4">
                {category.count} apuntes
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition">
                Ver apuntes
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Ventana flotante del perfil */}
      {showProfile && (
        <Profile
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
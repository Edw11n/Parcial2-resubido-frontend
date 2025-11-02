// src/components/NotesView.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore' 

interface Note {
  id: number
  title: string
  author: string
  rating: number
  downloads: number
  preview: string
}

// -----------------------------------------------------
// Componente de Botón de Favorito reutilizable
// -----------------------------------------------------
interface FavoriteButtonProps {
  noteId: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ noteId }) => {
  // Obtenemos el estado de favoritos y la función de alternar
  const favoriteNoteIds = useNotesStore((state) => state.favoriteNoteIds);
  const toggleFavorite = useNotesStore((state) => state.toggleFavorite);

  const isFavorite = favoriteNoteIds.includes(noteId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el clic propague a la tarjeta y navegue
    toggleFavorite(noteId);
  };

  return (
    <button
      onClick={handleToggle}
      className={`absolute top-2 right-2 p-1 rounded-full text-2xl transition-colors ${
        isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'
      }`}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      {isFavorite ? '⭐' : '☆'}
    </button>
  );
};
// -----------------------------------------------------

function NotesView() {
  const { category } = useParams<{ category: string }>()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  
  const getNotesByCategory = useNotesStore((state) => state.getNotesByCategory)
  // Obtenemos favoriteNoteIds para forzar la re-renderización de la vista
  // cuando cambia un favorito (aunque el botón hijo ya lo maneja)
  const favoriteNoteIds = useNotesStore((state) => state.favoriteNoteIds); 

  useEffect(() => {
    setLoading(true)
    
    const timer = setTimeout(() => {
      if (category) {
        const categoryNotes = getNotesByCategory(category)
        setNotes(categoryNotes as Note[]) 
      } else {
        setNotes([])
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [category, getNotesByCategory, favoriteNoteIds]) // Añadimos favoriteNoteIds

  if (loading) return <p className="loading-text">Cargando notas...</p>

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header (Igual que antes) */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-soft">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Apuntes</h1>
        <div></div>
      </header>

      {/* Contenido */}
      <main className="px-8 py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category}</h2>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">No hay apuntes disponibles para esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-5 rounded-lg shadow-soft relative cursor-pointer hover:shadow-lg transition"
              >
                {/* ⭐️ Integración del Botón de Favorito ⭐️ */}
                <FavoriteButton noteId={note.id} /> 
                
                <div
                  onClick={() => navigate(`/note/${note.id}`)}
                  className="cursor-pointer"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{note.title}</h3>
                    <p className="text-gray-600 mb-2">Por: {note.author}</p>
                    <div className="flex items-center mb-2">
                      {Array.from({ length: note.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-500 mb-2">{note.downloads} descargas</p>
                    <p className="text-gray-700">{note.preview}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition">
                    Descargar
                  </button>
                  <button className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 transition">
                    Comentar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default NotesView
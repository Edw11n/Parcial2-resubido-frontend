// src/components/NoteDetail.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// Importamos los stores necesarios
import { useNotesStore } from '../store/notesStore'
// Asumo que useCommentsStore.ts existe y está correctamente configurado
import { useCommentsStore } from '../store/commentsStore' 

// Interfaz para la Nota
interface Note {
  id: number
  title: string
  author: string
  rating: number
  downloads: number
  preview: string
}

// Interfaz para el Comentario
interface Comment {
  id: number
  author: string
  date: string
  text: string
}

// -----------------------------------------------------
// Componente de Botón de Favorito reutilizable (adaptado para detalle)
// -----------------------------------------------------
interface FavoriteButtonProps {
  noteId: number;
}

const DetailFavoriteButton: React.FC<FavoriteButtonProps> = ({ noteId }) => {
  const favoriteNoteIds = useNotesStore((state) => state.favoriteNoteIds);
  const toggleFavorite = useNotesStore((state) => state.toggleFavorite);

  const isFavorite = favoriteNoteIds.includes(noteId);

  const handleToggle = () => {
    toggleFavorite(noteId);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition ${
        isFavorite ? 'bg-yellow-100 text-yellow-700' : ''
      }`}
    >
      <span className="text-xl">{isFavorite ? '⭐' : '☆'}</span>
      {isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
    </button>
  );
};
// -----------------------------------------------------

function NoteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [commentsList, setCommentsList] = useState<Comment[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getNoteById = useNotesStore((state) => state.getNoteById)
  const getCommentsByNoteId = useCommentsStore((state) => state.getCommentsByNoteId)
  // Obtenemos favoriteNoteIds para asegurar que la vista de detalle se actualice
  const favoriteNoteIds = useNotesStore((state) => state.favoriteNoteIds); 

  useEffect(() => {
    if (!id) return
    setLoading(true)
    
    const noteId = parseInt(id)

    const timer = setTimeout(() => {
      const foundNote = getNoteById(noteId) || null
      const noteComments = getCommentsByNoteId(noteId)

      setNote(foundNote)
      setCommentsList(noteComments)
      setLoading(false)
    }, 500) 

    // Incluimos favoriteNoteIds en las dependencias para que si se cambia
    // el estado de favorito, se re-renderice el botón.
    return () => clearTimeout(timer)
  }, [id, getNoteById, getCommentsByNoteId, favoriteNoteIds]) 

  if (loading) return <div className="loading">Cargando...</div>

  const noteId = note?.id || 0; // Usamos el ID de la nota (0 si es null)

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-soft">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Detalles del Apunte</h1>
        <div></div>
      </header>

      {/* Contenido */}
      {note ? (
        <main className="px-8 py-10 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-soft">
            {/* Detalles de la Nota */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{note.title}</h2>
            <p className="text-gray-600 mb-3">Por: {note.author}</p>
            <div className="flex items-center mb-3">
              {Array.from({ length: note.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>
            <p className="text-gray-500 mb-3">{note.downloads} descargas</p>
            <p className="text-gray-700 mb-4">{note.preview}</p>

            <div className="flex gap-4 mb-6">
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition">
                Descargar
              </button>
              <button className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 transition">
                Comentar
              </button>
              {/* ⭐️ Integración del Botón de Favorito en el detalle ⭐️ */}
              <DetailFavoriteButton noteId={noteId} /> 
            </div>

            {/* Comentarios (Igual que antes) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Comentarios</h3>
              {commentsList.length > 0 ? (
                <div className="space-y-4">
                  {commentsList.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-md shadow-inner">
                      <div className="flex justify-between text-gray-600 text-sm mb-1">
                        <span>{comment.author}</span>
                        <span>{comment.date}</span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay comentarios aún.</p>
              )}
            </div>
          </div>
        </main>
      ) : (
        <div className="text-center text-gray-500 mt-10">No se encontró la nota seleccionada.</div>
      )}
    </div>
  )
}

export default NoteDetail
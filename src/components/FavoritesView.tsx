// src/components/FavoritesView.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore' 

interface Note {
id: number
title: string
author: string
rating: number
downloads: number
preview: string
}

function FavoritesView() {
const navigate = useNavigate()

// Obtenemos el getter de favoritas y los IDs para reactividad
const getFavoriteNotes = useNotesStore((state) => state.getFavoriteNotes)
// Usar favoriteNoteIds como dependencia fuerza la re-renderización cuando un favorito cambia
const favoriteNoteIds = useNotesStore((state) => state.favoriteNoteIds) 

const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([])
const [loading, setLoading] = useState<boolean>(true)

useEffect(() => {
    setLoading(true)
    
    // Obtenemos la lista actualizada del store
    const notes = getFavoriteNotes()
    setFavoriteNotes(notes)
    setLoading(false)
}, [getFavoriteNotes, favoriteNoteIds]) // Se actualiza al cambiar la lista de IDs

const handleNoteClick = (noteId: number) => {
    navigate(`/note/${noteId}`)
}

if (loading) return <p className="loading-text">Cargando favoritos...</p>

return (
    <div className="min-h-screen bg-gray-light">
    {/* Header */}
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-soft">
        <button
        onClick={() => navigate('/dashboard')}
        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
        Atras
        </button>
        <h1 className="text-xl font-bold text-gray-800">Mis Favoritos</h1>
        <div></div>
    </header>

    {/* Contenido */}
    <main className="px-8 py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Notas Favoritas</h2>

        {favoriteNotes.length === 0 ? (
        <p className="text-gray-500 text-center">Aún no has añadido notas a tus favoritos. ¡Empieza a explorar!</p>
        ) : (
        <div className="space-y-4">
            {favoriteNotes.map((note) => (
            <div
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className="bg-white p-5 rounded-lg shadow-soft cursor-pointer hover:shadow-lg transition flex justify-between items-center"
            >
                <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{note.title}</h3>
                <p className="text-gray-600 text-sm">Por: {note.author} | {note.downloads} descargas</p>
                </div>
                <div className="text-2xl text-yellow-500">⭐</div>
            </div>
            ))}
        </div>
        )}
    </main>
    </div>
)
}

export default FavoritesView
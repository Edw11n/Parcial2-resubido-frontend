// src/components/SearchNotes.tsx
import { useState, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore'

// Interfaz para la Nota (la misma que en el store)
interface Note {
id: number
title: string
author: string
rating: number
downloads: number
preview: string
}

function SearchNotes() {
const navigate = useNavigate()

// Obtenemos la función de búsqueda
const searchNotesByTitle = useNotesStore((state) => state.searchNotesByTitle)

const [searchQuery, setSearchQuery] = useState('')
const [results, setResults] = useState<Note[]>([])
const [loading, setLoading] = useState(false)

// Efecto para realizar la búsqueda al cambiar la consulta
useEffect(() => {
    if (searchQuery.length < 2) {
    setResults([])
    return
    }

    setLoading(true)
    
    // Simulación de debounce/latencia de búsqueda
    const delayDebounceFn = setTimeout(() => {
    // Llamamos a la función del store persistente
    const foundNotes = searchNotesByTitle(searchQuery)
    setResults(foundNotes)
    setLoading(false)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
}, [searchQuery, searchNotesByTitle])

const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
}

const handleNoteClick = (noteId: number) => {
    // Redirigir a la vista de detalle
    navigate(`/note/${noteId}`)
}

return (
    <div className="min-h-screen bg-gray-light">
    {/* Header */}
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-soft">
        <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
        Atras
        </button>
        <h1 className="text-xl font-bold text-gray-800">Buscar Apuntes</h1>
        <div></div>
    </header>

    {/* Contenido principal */}
    <main className="px-8 py-10 max-w-4xl mx-auto">
        
        {/* Input de Búsqueda */}
        <div className="mb-8">
        <input
            type="text"
            placeholder="Escribe el título del apunte que buscas..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        </div>

        {/* Resultados */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Resultados {searchQuery && `para "${searchQuery}"`}
        </h2>

        {loading && <p className="text-center text-blue-600">Buscando...</p>}

        {!loading && searchQuery.length < 2 && (
        <p className="text-gray-500 text-center">Escribe al menos 2 caracteres para buscar.</p>
        )}

        {!loading && searchQuery.length >= 2 && results.length === 0 && (
        <p className="text-gray-500 text-center">No se encontraron apuntes que coincidan.</p>
        )}

        {!loading && results.length > 0 && (
        <div className="space-y-4">
            {results.map((note) => (
            <div
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className="bg-white p-5 rounded-lg shadow-soft cursor-pointer hover:shadow-lg transition flex justify-between items-center"
            >
                <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{note.title}</h3>
                <p className="text-gray-600 text-sm">Por: {note.author} | {note.downloads} descargas</p>
                </div>
                <button className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary-dark transition">
                Ver Detalle
                </button>
            </div>
            ))}
        </div>
        )}
    </main>
    </div>
)
}

export default SearchNotes
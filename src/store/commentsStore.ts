// src/store/commentsStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Comment {
    id: number
    author: string
    date: string
    text: string
}

// Mapea el ID de la Nota al array de Comentarios
interface CommentsDB {
    [noteId: number]: Comment[]
}

interface CommentsState {
commentsDB: CommentsDB

// Acciones
getCommentsByNoteId: (noteId: number) => Comment[]
// Simular la adición de un comentario
addComment: (noteId: number, author: string, text: string) => void
}

const initialCommentsDB: CommentsDB = {
1: [
    { id: 1, author: 'Lucía Pérez', date: '2024-10-10', text: 'Muy buenos apuntes, me sirvieron mucho!' },
    { id: 2, author: 'David Rojas', date: '2024-10-12', text: 'Podrías agregar ejemplos de recursividad?' }
],
2: [
    { id: 3, author: 'Laura Torres', date: '2024-10-15', text: 'Excelente guía para estudiar antes del parcial!' }
],
3: [
    { id: 4, author: 'Juan Gómez', date: '2024-10-17', text: 'El apartado de consultas JOIN está muy claro 👏' }
],
4: []
}

export const useCommentsStore = create<CommentsState>()(
persist(
    (set, get) => ({
    commentsDB: initialCommentsDB,

    getCommentsByNoteId: (noteId: number) => {
        const { commentsDB } = get()
        return commentsDB[noteId] || []
    },

    addComment: (noteId: number, author: string, text: string) => {
        const newComment: Comment = {
        id: Date.now(), // ID simulado
        author,
        date: new Date().toISOString().split('T')[0], // Fecha actual
        text,
        }

        set(state => ({
        commentsDB: {
            ...state.commentsDB,
            // Añadir el nuevo comentario al array existente, o crear un nuevo array
            [noteId]: [...(state.commentsDB[noteId] || []), newComment]
        }
        }))
    }
    }),
    {
    name: 'comments-data', // Clave en localStorage para los comentarios
    storage: createJSONStorage(() => localStorage), 
    }
)
)
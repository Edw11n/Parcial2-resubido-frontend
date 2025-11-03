// src/store/notesStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// --- Interfaces Detalladas ---

interface Note {
id: number
title: string
author: string
rating: number
downloads: number
preview: string
}

interface FakeNotesDB {
[categoryName: string]: Note[]
}

interface Category {
id: number
name: string
count: number
}

interface NotesState {
notesDB: FakeNotesDB
favoriteNoteIds: number[] // NUEVO: IDs de notas favoritas

// Getters
getCategories: () => Category[]
getNotesByCategory: (categoryName: string) => Note[] 
getNoteById: (noteId: number) => Note | undefined
getFavoriteNotes: () => Note[] // NUEVO: Obtener las notas favoritas

// Actions
addNote: (
    categoryName: string,
    title: string,
    author: string,
    preview: string
) => { success: boolean; message: string }
toggleFavorite: (noteId: number) => void // NUEVO: Alternar favorito
searchNotesByTitle: (query: string) => Note[]
}

// Datos iniciales
const initialFakeNotesDB: FakeNotesDB = {
Algoritmos: [
    { id: 1, title: 'Apuntes de Algoritmos', author: 'Carlos Ruiz', rating: 5, downloads: 120, preview: 'Introducción a estructuras de control y funciones...' },
    { id: 2, title: 'Ejercicios básicos', author: 'Ana López', rating: 4, downloads: 85, preview: 'Listas, bucles y diagramas de flujo...' },
],
'Bases de datos': [
    { id: 3, title: 'Apuntes de SQL', author: 'Pedro Torres', rating: 5, downloads: 200, preview: 'Normalización, consultas básicas y avanzadas...' },
    { id: 4, title: 'Diseño de BD', author: 'María González', rating: 4, downloads: 150, preview: 'Modelado relacional y ER diagrams...' },
],
Redes: [
    { id: 5, title: 'Fundamentos de redes', author: 'Luis Gómez', rating: 5, downloads: 90, preview: 'Topologías, protocolos y direccionamiento IP...' },
    { id: 6, title: 'Configuraciones Cisco', author: 'Laura Pérez', rating: 4, downloads: 60, preview: 'Configuración básica de routers y switches...' },
    { id: 7, title: 'Configuraciones GNS3', author: 'Laura Pérez', rating: 3, downloads: 30, preview: 'Configuración básica de gns3 y...' }
],
}

// --- Store de Notas Persistente ---

export const useNotesStore = create<NotesState>()(
persist(
    (set, get) => ({
    // Estado Inicial
    notesDB: initialFakeNotesDB,
    favoriteNoteIds: [], // Inicialmente vacío
    
    // --- Funciones auxiliares internas ---

    getHighestNoteId: () => {
        const { notesDB } = get()
        let maxId = 0
        for (const category in notesDB) {
        notesDB[category].forEach(note => {
            if (note.id > maxId) {
            maxId = note.id
            }
        })
        }
        return maxId
    },
    
    // Función auxiliar para obtener todas las notas aplanadas (usado por search y favoritos)
    getAllNotes: (): Note[] => {
        const { notesDB } = get()
        return Object.values(notesDB).flat()
    },

    // --- Implementación de Acciones y Getters ---

    getCategories: () => {
        const { notesDB } = get()
        return Object.keys(notesDB).map((name, index) => ({
        id: index + 1,
        name,
        count: notesDB[name].length,
        }))
    },
    
    getNotesByCategory: (categoryName: string) => {
        const { notesDB } = get()
        return notesDB[categoryName] || [] as Note[]
    },

    getNoteById: (noteId: number) => {
        const { notesDB } = get()
        for (const category in notesDB) {
        const found = notesDB[category].find(note => note.id === noteId)
        if (found) {
            return found as Note
        }
        }
        return undefined
    },
    
    /**
     * NUEVA IMPLEMENTACIÓN: Obtiene las notas que están en la lista de favoritos.
     */
    getFavoriteNotes: () => {
        const { favoriteNoteIds, getAllNotes } = get()
        const allNotes = getAllNotes()
        
        return allNotes.filter(note => favoriteNoteIds.includes(note.id))
    },
    
    /**
     * NUEVA IMPLEMENTACIÓN: Alterna el ID de la nota en la lista de favoritos.
     */
    toggleFavorite: (noteId: number) => {
        set(state => {
            const isFavorite = state.favoriteNoteIds.includes(noteId)
            
            const newFavoriteIds = isFavorite
                ? state.favoriteNoteIds.filter(id => id !== noteId) // Quitar
                : [...state.favoriteNoteIds, noteId] // Añadir
            
            return { favoriteNoteIds: newFavoriteIds }
        })
    },
    
    addNote: (categoryName, title, author, preview) => {
        const { notesDB, getHighestNoteId } = get()
        
        const newNote: Note = {
        id: getHighestNoteId() + 1,
        title,
        author,
        preview,
        rating: 0,
        downloads: 0,
        }
        
        const normalizedCategory = categoryName.trim()
        
        const updatedNotesDB: FakeNotesDB = {
        ...notesDB,
        [normalizedCategory]: [
            ...(notesDB[normalizedCategory] || []), 
            newNote
        ]
        }
        
        set({ notesDB: updatedNotesDB })

        return { success: true, message: `Material subido a la categoría "${normalizedCategory}" correctamente.` }
    },

    searchNotesByTitle: (query: string) => {
        if (!query) return []
        
        const { getAllNotes } = get()
        const lowerQuery = query.toLowerCase()
        const allNotes = getAllNotes()

        return allNotes.filter(note => 
        note.title.toLowerCase().includes(lowerQuery)
        )
    }
    
    }),
    {
    name: 'notes-data', 
    storage: createJSONStorage(() => localStorage), 
    // Almacenamos 'favoriteNoteIds' junto a 'notesDB'
    partialize: (state) => ({ 
        notesDB: state.notesDB, 
        favoriteNoteIds: state.favoriteNoteIds 
    })
    }
)
)
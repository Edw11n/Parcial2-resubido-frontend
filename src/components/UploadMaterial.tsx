// src/components/UploadMaterial.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotesStore, Category } from '../store/notesStore' 
import { useAuthStore } from '../store/authStore'
// Importamos la interfaz Category del store

function UploadMaterial() {
const navigate = useNavigate()

// Obtenemos la acción de añadir nota, que es estable
const addNote = useNotesStore((state) => state.addNote)

// Estado local para mantener la lista de categorías de forma segura
const [categoriesList, setCategoriesList] = useState<Category[]>(
    useNotesStore.getState().getCategories()
)

// Estado local para el formulario
const [categoryName, setCategoryName] = useState('')
const [title, setTitle] = useState('')
const [preview, setPreview] = useState('')
// Simulamos el autor obteniéndolo del store de autenticación (¡Asegúrate de que 'useAuthStore' está disponible!)
const user = useAuthStore.getState().user; // Usamos getState() para inicializar

const author = user?.name || 'Usuario Anónimo'; 

// --- Manejo de la Suscripción a Zustand para las Categorías ---
useEffect(() => {
    // 1. Función para actualizar el estado local
    const updateCategories = () => {
    setCategoriesList(useNotesStore.getState().getCategories());
    };
    
    // 2. Suscribirse a cambios en el store de notas (específicamente cuando notesDB cambie)
    const unsubscribe = useNotesStore.subscribe(
        // Selector: Nos interesa solo cuando notesDB cambia
        (state) => state.notesDB, 
        // Listener: Ejecutamos la función de actualización
        (notesDB) => {
            updateCategories();
        },
        { equalityFn: (a, b) => JSON.stringify(a) === JSON.stringify(b) } // Comparación profunda para evitar renders innecesarios
    );
    
    // 3. Cleanup: Desuscribirse al desmontar el componente
    return () => unsubscribe();
}, []); // El array de dependencias vacío asegura que solo se monte/desmonte una vez

// --- Lógica del Formulario ---

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!categoryName.trim() || !title.trim() || !preview.trim()) {
    alert('Por favor, completa todos los campos requeridos.')
    return
    }

    try {
    // Usamos la acción addNote del store
    const { success, message } = addNote(categoryName, title, author, preview)

    if (success) {
        alert(message)
        navigate('/dashboard') 
    } else {
        alert(message)
    }
    } catch (error) {
    alert('Error inesperado al subir material.')
    console.error(error)
    }
}

// Si el usuario selecciona una categoría existente en el dropdown, actualizamos el estado.
const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setCategoryName(value)
}

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Subir Nuevo Material</h2>
        <p className="text-gray-600 mb-4 text-center">Autor: **{author}**</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Campo de Selección/Creación de Categoría */}
        <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Seleccionar Categoría Existente:</label>
            <select
            onChange={handleCategorySelect}
            // Si la categoría actual está en la lista, la seleccionamos
            value={categoriesList.some(c => c.name === categoryName) ? categoryName : ''}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
            <option value="" disabled>-- Selecciona una materia --</option>
            {categoriesList.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name} ({cat.count})</option>
            ))}
            </select>
            
            <p className="text-sm text-gray-500 mt-2">O</p>
            
            <label className="mb-1 text-gray-700">Escribe una **Nueva Categoría**:</label>
            <input
            type="text"
            placeholder="Ej: Matemáticas Discretas"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
        </div>

        {/* Campo de Título */}
        <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Título del Apunte</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
        </div>

        {/* Campo de Vista Previa (Preview) */}
        <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Vista Previa / Resumen Breve</label>
            <textarea
            placeholder="Escribe un resumen de lo que contiene el material..."
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            required
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
        </div>

        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
            Subir Material
        </button>
        </form>
        
        <button
        onClick={() => navigate('/dashboard')}
        className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
        Cancelar
        </button>
    </div>
    </div>
)
}

export default UploadMaterial
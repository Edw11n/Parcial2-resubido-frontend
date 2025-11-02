import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotesView from './pages/NotesView'
import NoteDetail from './pages/NoteDetail'
import UploadMaterial from './components/UploadMaterial'
import SearchNotes from './components/SearchNotes'
import FavoritesView from './components/FavoritesView'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes/:category" 
          element={
            <ProtectedRoute>
              <NotesView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/note/:id" 
          element={
            <ProtectedRoute>
              <NoteDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadMaterial />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <SearchNotes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <FavoritesView />
            </ProtectedRoute>
          } 
        />
      </Routes>
  )
}

export default App
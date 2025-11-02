// src/store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// --- Interfaces ---

interface User {
id: string; // ID único para el usuario simulado
name: string;
email: string;
password: string; // Ojo: en un entorno real, ¡nunca guardes la contraseña en texto plano!
}

interface AuthState {
// Estado de la Sesión Actual (Persistido)
token: string | null;
user: Omit<User, 'password'> | null; // Guardamos el usuario sin la contraseña
isLoggedIn: boolean;

// "Base de Datos" de Usuarios (Persistido)
registeredUsers: User[]; 

// Acciones
// Simula el registro: añade un usuario a 'registeredUsers'
registerUser: (name: string, email: string, password: string) => { success: boolean, message: string };
// Simula el inicio de sesión: valida y establece la sesión
loginUser: (email: string, password: string) => { success: boolean, message: string };
// Cierra la sesión
logout: () => void;
}

// --- Store de Autenticación Persistente ---

export const useAuthStore = create<AuthState>()(
persist(
    (set, get) => ({
    // Estado Inicial
    token: null,
    user: null,
    isLoggedIn: false,
    registeredUsers: [], // Inicialmente vacía

    // --- Implementación de Acciones ---

    registerUser: (name, email, password) => {
        const { registeredUsers } = get();

        // 1. Simular validación de email duplicado
        if (registeredUsers.some(u => u.email === email)) {
        return { success: false, message: 'El correo electrónico ya está registrado.' };
        }

        // 2. Simular ID y token
        const newUser: User = {
        id: Date.now().toString(), // Simulación de ID
        name,
        email,
        password // ¡Solo para simulación!
        };

        // 3. Actualizar la lista de usuarios registrados
        set({ registeredUsers: [...registeredUsers, newUser] });

        // Nota: En esta simulación, el registro no inicia sesión automáticamente
        return { success: true, message: 'Registro exitoso. Ahora puedes iniciar sesión.' };
    },
    
    loginUser: (email, password) => {
        const { registeredUsers } = get();
        
        // 1. Buscar usuario
        const userFound = registeredUsers.find(u => u.email === email);

        // 2. Simular validación de credenciales
        if (!userFound || userFound.password !== password) {
        return { success: false, message: 'Credenciales incorrectas.' };
        }
        
        // 3. Simular la creación de un token (ej. JWT simulado)
        const simulatedToken = `simulated-token-${userFound.id}-${Date.now()}`;
        
        // 4. Establecer la sesión y persistir el estado
        const { password: _, ...userWithoutPass } = userFound;
        set({
        token: simulatedToken,
        user: userWithoutPass,
        isLoggedIn: true,
        });

        return { success: true, message: 'Inicio de sesión exitoso.' };
    },

    logout: () => {
        set({ 
            token: null, 
            user: null, 
            isLoggedIn: false 
        });
    },
    }),
    {
    name: 'auth-data', // Nombre clave en localStorage
    storage: createJSONStorage(() => localStorage), 
    // Persistimos todo el estado: sesión + la lista de usuarios
    }
)
);
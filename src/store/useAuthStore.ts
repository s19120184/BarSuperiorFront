import { json } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSession {
  id: string;
  fullName: string;
  email?: string;
  roles: string[];
}



interface AuthState {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: (user: UserSession, token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      setAuth: (user, token) => {
        // Guardar token en localStorage y cookie para middleware
        if (typeof window !== 'undefined') {
          localStorage.setItem('bar_token', token);
          localStorage.setItem('user_bar', JSON.stringify(user));

          document.cookie = `bar_token=${token}; path=/; max-age=86400; SameSite=Strict`;
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bar_token');
          localStorage.removeItem('user_bar')
          document.cookie = 'bar_token=; path=/; max-age=0; SameSite=Strict';
        }
        set({ user: null, token: null, isAuthenticated: false , hasHydrated:false});
      },

      hasRole: (role) => {
        const user = get().user;
        return user?.roles.includes(role) ?? false;
      },
    }),
    {
      name: 'bar-auth-session',
      onRehydrateStorage:()=>(state)=>{
        state?.setHasHydrated(true);
      }
    }
  )
);
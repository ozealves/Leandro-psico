import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  googleSyncEnabled: boolean;
  setGoogleSyncEnabled: (enabled: boolean) => void;
  whatsappBotEnabled: boolean;
  setWhatsappBotEnabled: (enabled: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        id: '1',
        name: 'Dr. Admin',
        email: 'admin@psiflow.com',
        role: 'ADMIN',
      }, // Mock user for now
      setUser: (user) => set({ user }),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      googleSyncEnabled: false,
      setGoogleSyncEnabled: (googleSyncEnabled) => set({ googleSyncEnabled }),
      whatsappBotEnabled: false,
      setWhatsappBotEnabled: (whatsappBotEnabled) => set({ whatsappBotEnabled }),
    }),
    {
      name: 'psiflow-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ theme: state.theme }), // By default, only saving theme to avoid bugs with mocks, expand later if needed
    }
  )
);

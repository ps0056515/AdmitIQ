import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, mockUsers } from '@admitiq/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const user = mockUsers[email];
        if (user) {
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'admitiq-auth',
    }
  )
);

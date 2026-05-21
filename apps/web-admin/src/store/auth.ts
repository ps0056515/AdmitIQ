import { create } from 'zustand';
import { setAccessToken, type AuthUser } from '@admitiq/api-client';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (token, user) => {
    setAccessToken(token);
    set({ token, user });
  },
  logout: () => {
    setAccessToken(null);
    set({ token: null, user: null });
  },
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, is_admin?: boolean) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, phone?: string) => Promise<void>;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password, is_admin = false) => {
        set({ loading: true, error: null });
        try {
          const endpoint = is_admin
            ? `${import.meta.env.VITE_API_URL}/api/auth/admin/login`
            : `${import.meta.env.VITE_API_URL}/api/auth/login`;

          const response = await api.post(endpoint, { email, password });

          if (response.data.success) {
            const { user, token } = response.data.data;
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false
            });

            // Store in localStorage for persistence
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', user.role);

            return Promise.resolve();
          } else {
            set({ error: response.data.message, loading: false });
            return Promise.reject(new Error(response.data.message));
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            loading: false
          });
          return Promise.reject(error);
        }
      },

      adminLogin: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/api/auth/admin/login', { email, password });

          if (response.data.success) {
            const { user, token } = response.data.data;
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false
            });

            // Store in localStorage for persistence
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', user.role);
          } else {
            set({ error: response.data.message, loading: false });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Admin login failed',
            loading: false
          });
        }
      },

      register: async (username, email, password, phone) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', {
            username,
            email,
            password,
            phone: phone || ''
          });

          if (response.data.success) {
            set({ loading: false });
            return Promise.resolve(response.data);
          } else {
            set({ error: response.data.message, loading: false });
            return Promise.reject(new Error(response.data.message));
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            loading: false
          });
          return Promise.reject(error);
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      },

      checkAuthStatus: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Store for loading states
interface LoadingState {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));

// Store for cart (if needed in the future)
interface CartState {
  items: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (item) => set((state) => ({ items: [...state.items, item] })),
  removeFromCart: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  clearCart: () => set({ items: [] }),
}));
import { create } from 'zustand';
import { supabase } from '@/services/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  initialize: async () => {
    if (!supabase) {
      console.warn('[AuthStore] Supabase client not initialized. Skipping auth init.');
      set({ isLoading: false });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    set({ 
      user: session?.user ?? null, 
      isAuthenticated: !!session?.user,
      isLoading: false 
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ 
        user: session?.user ?? null, 
        isAuthenticated: !!session?.user,
        isLoading: false
      });
    });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Ensure profile exists after login (case: manual registration/deletion)
      if (data?.user) {
        await supabase.rpc('create_profile', {
          profile_id: data.user.id,
          profile_email: data.user.email,
          profile_full_name: data.user.user_metadata?.full_name || ''
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, metadata = {}) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;

      // Manually create profile via RPC (trigger is removed)
      if (data?.user) {
        await supabase.rpc('create_profile', {
          profile_id: data.user.id,
          profile_email: data.user.email,
          profile_full_name: metadata.full_name || ''
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      set({ isLoading: false });
    }
  },

  loginAnonymous: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      // Manually create profile for anonymous user
      if (data?.user) {
        await supabase.rpc('create_profile', {
          profile_id: data.user.id,
          profile_email: null,
          profile_full_name: 'Guest User'
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

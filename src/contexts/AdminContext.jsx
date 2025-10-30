import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

const AdminContext = createContext();

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    // Don't hard-throw — return a safe fallback so components can render
    // and we can surface a helpful dev-time warning instead.
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        'useAdminContext called outside AdminProvider. Wrap your app with <AdminProvider> or check provider mount order.'
      );
    }

    // Safe fallback: minimal shape used by consumers to avoid runtime crashes.
    return {
      session: null,
      setSession: () => {},
      user: null,
      isAuthenticated: false,
      logout: async () => {},
      loading: false,
    };
  }
  return ctx;
};

export const AdminProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let mounted = true;

  // Try to restore saved session (waits properly)
  const loadSession = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session ?? null;
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error restoring session:', err);
      if (mounted) setLoading(false);
    }
  };

  loadSession();

  // Listen for login/logout events and update automatically
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (mounted) setSession(session);
  });

  const subscription = data?.subscription;

  // Clean up listener when component unmounts
  return () => {
    mounted = false;
    try {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    } catch (err) {
      console.warn('Failed to unsubscribe auth listener:', err);
    }
  };
}, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    session,
    setSession,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    logout,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

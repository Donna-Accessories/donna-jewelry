// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import supabase from "../utils/supabaseClient";

const AdminContext = createContext();

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminContext must be used inside AdminProvider");
  return ctx;
};

export const AdminProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    session,
    setSession,
    isAuthenticated: !!session,
    loading,
    logout: () => supabase.auth.signOut(),
  }), [session, loading]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

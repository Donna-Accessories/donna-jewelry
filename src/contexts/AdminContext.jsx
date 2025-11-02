// src/contexts/AdminContext.jsx
// Simple Admin Context for Donna's Jewelry Store
// Email: Donna@Jewelry.com
// Password: Donna123

import React, { createContext, useContext, useReducer, useCallback } from "react";

const AdminContext = createContext();

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminContext must be used inside AdminProvider");
  return ctx;
};

const initialState = {
  isAuthenticated: localStorage.getItem("isAdmin") === "true",
  error: null,
};

const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return { isAuthenticated: true, error: null };
    case ActionTypes.LOGIN_FAILURE:
      return { isAuthenticated: false, error: action.payload };
    case ActionTypes.LOGOUT:
      return { isAuthenticated: false, error: null };
    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const login = useCallback((email, password) => {
    if (email === "Donna@Jewelry.com" && password === "Donna123") {
      localStorage.setItem("isAdmin", "true");
      dispatch({ type: ActionTypes.LOGIN_SUCCESS });
      return true;
    } else {
      dispatch({ type: ActionTypes.LOGIN_FAILURE, payload: "Invalid credentials" });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("isAdmin");
    dispatch({ type: ActionTypes.LOGOUT });
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        error: state.error,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

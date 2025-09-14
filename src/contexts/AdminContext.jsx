import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

/**
 * Admin Context for Donna's Jewelry Store
 * 
 * Manages admin authentication and session state:
 * - Simple password-based authentication
 * - Session persistence with localStorage
 * - Auto-logout after inactivity
 * - Admin permissions and access control
 * - Security measures and rate limiting
 */

// Configuration
const CONFIG = {
  SESSION_TIMEOUT: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  INACTIVITY_TIMEOUT: 30 * 60 * 1000,  // 30 minutes in milliseconds
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000,    // 15 minutes lockout
  STORAGE_KEY: 'donna_admin_session'
};

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionStartTime: null,
  lastActivity: null,
  loginAttempts: 0,
  lockedUntil: null,
  adminData: null
};

// Action types
const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  SESSION_TIMEOUT: 'SESSION_TIMEOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_LOGIN_ATTEMPTS: 'RESET_LOGIN_ATTEMPTS',
  SET_LOCKOUT: 'SET_LOCKOUT',
  RESTORE_SESSION: 'RESTORE_SESSION'
};

// Reducer function
const adminReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case ActionTypes.LOGIN_SUCCESS:
      const sessionData = {
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
        adminData: action.payload.adminData || { role: 'admin' }
      };
      
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0,
        lockedUntil: null,
        ...sessionData
      };

    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
        loginAttempts: state.loginAttempts + 1,
        lockedUntil: action.payload.lockout ? Date.now() + CONFIG.LOCKOUT_DURATION : null
      };

    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        loginAttempts: state.loginAttempts // Preserve attempts across logout
      };

    case ActionTypes.UPDATE_ACTIVITY:
      return {
        ...state,
        lastActivity: Date.now()
      };

    case ActionTypes.SESSION_TIMEOUT:
      return {
        ...initialState,
        error: 'Session expired due to inactivity'
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.RESET_LOGIN_ATTEMPTS:
      return {
        ...state,
        loginAttempts: 0,
        lockedUntil: null
      };

    case ActionTypes.SET_LOCKOUT:
      return {
        ...state,
        lockedUntil: Date.now() + CONFIG.LOCKOUT_DURATION
      };

    case ActionTypes.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: true,
        sessionStartTime: action.payload.sessionStartTime,
        lastActivity: action.payload.lastActivity,
        adminData: action.payload.adminData
      };

    default:
      return state;
  }
};

// Create context
const AdminContext = createContext();

// Custom hook to use admin context
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};

/**
 * AdminProvider Component
 * Wraps admin areas and provides authentication state
 */
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Check if account is currently locked
  const isAccountLocked = useCallback(() => {
    return state.lockedUntil && Date.now() < state.lockedUntil;
  }, [state.lockedUntil]);

  // Check if session is valid
  const isSessionValid = useCallback(() => {
    if (!state.isAuthenticated || !state.sessionStartTime || !state.lastActivity) {
      return false;
    }

    const now = Date.now();
    const sessionAge = now - state.sessionStartTime;
    const inactivityPeriod = now - state.lastActivity;

    // Check if session has exceeded maximum duration
    if (sessionAge > CONFIG.SESSION_TIMEOUT) {
      return false;
    }

    // Check if user has been inactive too long
    if (inactivityPeriod > CONFIG.INACTIVITY_TIMEOUT) {
      return false;
    }

    return true;
  }, [state.isAuthenticated, state.sessionStartTime, state.lastActivity]);

  // Save session to localStorage
  const saveSession = useCallback((sessionData) => {
    try {
      const dataToSave = {
        sessionStartTime: sessionData.sessionStartTime,
        lastActivity: sessionData.lastActivity,
        adminData: sessionData.adminData,
        expires: Date.now() + CONFIG.SESSION_TIMEOUT
      };
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save admin session:', error);
    }
  }, []);

  // Load session from localStorage
  const loadSession = useCallback(() => {
    try {
      const savedSession = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!savedSession) return null;

      const sessionData = JSON.parse(savedSession);
      
      // Check if session has expired
      if (!sessionData.expires || Date.now() > sessionData.expires) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        return null;
      }

      return sessionData;
    } catch (error) {
      console.warn('Failed to load admin session:', error);
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      return null;
    }
  }, []);

  // Clear session from localStorage
  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear admin session:', error);
    }
  }, []);

  // Login function
  const login = useCallback(async (password) => {
    // Check if account is locked
    if (isAccountLocked()) {
      const remainingTime = Math.ceil((state.lockedUntil - Date.now()) / (60 * 1000));
      throw new Error(`Account locked. Try again in ${remainingTime} minutes.`);
    }

    dispatch({ type: ActionTypes.LOGIN_START });

    try {
      // Simple password validation (in a real app, this would be server-side)
      // For demo purposes, using a simple environment variable or hardcoded value
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'donna123';
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (password !== adminPassword) {
        const shouldLock = state.loginAttempts + 1 >= CONFIG.MAX_LOGIN_ATTEMPTS;
        
        dispatch({ 
          type: ActionTypes.LOGIN_FAILURE, 
          payload: { 
            error: shouldLock 
              ? 'Too many failed attempts. Account locked for 15 minutes.'
              : `Invalid password. ${CONFIG.MAX_LOGIN_ATTEMPTS - state.loginAttempts - 1} attempts remaining.`,
            lockout: shouldLock
          }
        });
        return false;
      }

      // Successful login
      const sessionData = {
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
        adminData: {
          role: 'admin',
          loginTime: new Date().toISOString(),
          permissions: ['read', 'write', 'delete']
        }
      };

      dispatch({ 
        type: ActionTypes.LOGIN_SUCCESS, 
        payload: { adminData: sessionData.adminData }
      });

      // Save session
      saveSession(sessionData);
      
      return true;

    } catch (error) {
      dispatch({ 
        type: ActionTypes.LOGIN_FAILURE, 
        payload: { error: 'Login failed. Please try again.' }
      });
      return false;
    }
  }, [state.loginAttempts, state.lockedUntil, isAccountLocked, saveSession]);

  // Logout function
  const logout = useCallback(() => {
    dispatch({ type: ActionTypes.LOGOUT });
    clearSession();
  }, [clearSession]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    if (state.isAuthenticated && isSessionValid()) {
      dispatch({ type: ActionTypes.UPDATE_ACTIVITY });
      
      // Update session in localStorage
      const sessionData = {
        sessionStartTime: state.sessionStartTime,
        lastActivity: Date.now(),
        adminData: state.adminData
      };
      saveSession(sessionData);
    }
  }, [state.isAuthenticated, state.sessionStartTime, state.adminData, isSessionValid, saveSession]);

  // Force logout due to session timeout
  const forceLogout = useCallback(() => {
    dispatch({ type: ActionTypes.SESSION_TIMEOUT });
    clearSession();
  }, [clearSession]);

  // Clear error messages
  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  // Check permissions
  const hasPermission = useCallback((permission) => {
    if (!state.isAuthenticated || !state.adminData) return false;
    return state.adminData.permissions?.includes(permission) || false;
  }, [state.isAuthenticated, state.adminData]);

  // Get remaining lockout time
  const getRemainingLockoutTime = useCallback(() => {
    if (!state.lockedUntil) return 0;
    return Math.max(0, state.lockedUntil - Date.now());
  }, [state.lockedUntil]);

  // Initialize session on mount
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      // Restore session if it exists and is valid
      const sessionAge = Date.now() - savedSession.sessionStartTime;
      const inactivityPeriod = Date.now() - savedSession.lastActivity;
      
      if (sessionAge < CONFIG.SESSION_TIMEOUT && inactivityPeriod < CONFIG.INACTIVITY_TIMEOUT) {
        dispatch({ 
          type: ActionTypes.RESTORE_SESSION, 
          payload: savedSession 
        });
      } else {
        clearSession();
      }
    }
  }, [loadSession, clearSession]);

  // Session timeout checker
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkSession = () => {
      if (!isSessionValid()) {
        forceLogout();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [state.isAuthenticated, isSessionValid, forceLogout]);

  // Activity tracker for user interactions
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [state.isAuthenticated, updateActivity]);

  // Reset login attempts after lockout period
  useEffect(() => {
    if (state.lockedUntil && Date.now() > state.lockedUntil) {
      dispatch({ type: ActionTypes.RESET_LOGIN_ATTEMPTS });
    }
  }, [state.lockedUntil]);

  // Context value
  const contextValue = {
    // State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    adminData: state.adminData,
    loginAttempts: state.loginAttempts,
    
    // Session info
    sessionStartTime: state.sessionStartTime,
    lastActivity: state.lastActivity,
    isSessionValid: isSessionValid(),
    
    // Security info
    isAccountLocked: isAccountLocked(),
    remainingLockoutTime: getRemainingLockoutTime(),
    
    // Actions
    login,
    logout,
    updateActivity,
    clearError,
    
    // Permissions
    hasPermission,
    
    // Session management
    forceLogout
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
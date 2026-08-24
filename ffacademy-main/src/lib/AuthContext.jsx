import React, { createContext, useState, useContext, useEffect } from 'react';
import { Auth, isBackendConfigured } from '@/api/aws';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    if (!isBackendConfigured) {
      setAuthError({
        type: 'backend_not_configured',
        message: 'Backend not configured. Set the VITE_API_URL and VITE_COGNITO_* environment variables and rebuild.'
      });
      setIsLoadingAuth(false);
      return;
    }

    try {
      const session = await Auth.getSession();
      if (session) {
        const profile = await Auth.fetchProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoadingAuth(false);
  };

  const handleLogin = async (email, password) => {
    await Auth.signIn(email, password);
    const profile = await Auth.fetchProfile();
    setUser(profile);
    setIsAuthenticated(true);
    setAuthError(null);
    return profile;
  };

  const handleSignup = async (email, password, fullName, confirmationCode) => {
    return Auth.signUp(email, password, fullName, confirmationCode);
  };

  const logout = () => {
    Auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = window.location.origin;
  };

  const navigateToLogin = () => {
    if (window.location.hash !== '#/Auth') window.location.hash = '#/Auth';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      logout,
      navigateToLogin,
      checkAppState,
      handleLogin,
      handleSignup
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

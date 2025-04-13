import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthnContext = createContext();

export const AuthnProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get('/auth/current-user', {
          withCredentials: true
        });
        
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
          setUserType(res.data.userType);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const isOperator = userType === 'operator';
  const isRegularUser = userType === 'user';

  return (
    <AuthnContext.Provider
      value={{
        user,
        isAuthenticated,
        isOperator,
        isRegularUser,
        loading,
        setUser,
        setIsAuthenticated,
        setUserType
      }}
    >
      {children}
    </AuthnContext.Provider>
  );
};

export default AuthnProvider;
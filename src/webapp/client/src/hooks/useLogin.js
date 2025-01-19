import { useState } from 'react';
import { useAuthnContext } from './useAuthnContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthnContext();
  
    const login = async (email, password) => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await fetch("/api/authn/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Include cookies with the request
        });
  
        const json = await response.json();
  
        if (!response.ok) {
          setError(json.message || "Login failed");
          setIsLoading(false);
          return false; // Indicate failure
        }
  
        // Extract access token from response headers
        const accessToken = response.headers.get("Authorization")?.split(" ")[1];
  
        if (!accessToken) {
          setError("No access token received");
          setIsLoading(false);
          return false;
        }
  
        // Dispatch user info and store access token in memory
        dispatch({ type: "LOGIN", payload: { user: json, token: accessToken } });
        setIsLoading(false);
        return true; // Indicate success
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        return false;
      }
    };
  
    return { login, error, isLoading };
  };
    
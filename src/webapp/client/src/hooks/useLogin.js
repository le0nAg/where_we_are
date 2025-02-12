import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/authn/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save the access token in local storage or context
      localStorage.setItem("accessToken", data.accessToken);

      // Redirect to the POI management page
      navigate("/poi-management");

      return true; // Success
    } catch (error) {
      setError(error.message);
      return false; // Failure
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
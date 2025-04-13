import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthnContext } from "../../hooks/useAuthnContext";
import "../../css/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setIsAuthenticated, setUserType } = useAuthnContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/authn/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(
          (data.message && process.env.NODE_ENV === "dev") || 
          "Login failed"
        );
      }
      
      // Update context with user data from response
      setUser(data.user);
      setIsAuthenticated(true);
      setUserType(data.userType);
      
      navigate("/poi-management");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login" onSubmit={handleSubmit}>
        <h2>ACCEDI</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "LOG IN"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
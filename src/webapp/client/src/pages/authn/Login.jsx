import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/login.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        credentials: "include", // Invia i cookie
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setIsAuthenticated(true); 
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
        <label>Email</label>
        <input type='email' onChange={(e) => setEmail(e.target.value)} value={email}></input>
        
        <label>Password</label>
        <input type='password' onChange={(e) => setPassword(e.target.value)} value={password}></input>
        
        <button disabled={isLoading}> LOG IN </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
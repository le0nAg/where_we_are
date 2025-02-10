import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import "../../css/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate(); // Initialize the navigate function
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await login(email, password);
    
    const success = await login(email, password); // Assuming `login` returns a success flag
    if (success) {
      navigate("/dashboard"); // Redirect to the dashboard on success
    }
  }

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

export default Login
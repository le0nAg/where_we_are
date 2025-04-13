import { Navigate } from 'react-router-dom';
import { useAuthnContext } from '../hooks/useAuthnContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthnContext();
    
    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/" />;
    
    return children;
  };
  
const OperatorRoute = ({ children }) => {
  const { isAuthenticated, isOperator, loading } = useAuthnContext();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || !isOperator) return <Navigate to="/" />;
  
  return children;
};

export { ProtectedRoute, OperatorRoute };

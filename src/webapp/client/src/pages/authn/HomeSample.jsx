import { Link } from 'react-router-dom';

const HomeSample = () => {
  return (
    <div className="container">
      <div>
        <h1>Home page of the website</h1>
      </div>
      <Link to="/login">Login</Link>
    
    </div>
  );
};

export default HomeSample;
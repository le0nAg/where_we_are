import React from 'react';
import '../css/landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="top-section">
          <div className="logo-container">
            <div className="app-logo">
              <img src="/images/logo_big.png" alt="Logo" className="logo-image" />
            </div>
          </div>
          <h2 className="app-title">Map Points Management System</h2>
        </div>
        
        <div className="content-section">
          <p className="app-description">
            Our platform allows you to manage POIs (Points of Interest) on interactive maps. 
            Whether you're an operator managing the system or a user exploring locations, 
            our intuitive interface makes navigation simple and efficient.
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="feature-text">Create and manage location points with detailed information</span>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 012-2h8a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V3zm3 1.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 010 1h5a.5.5 0 010-1h-5z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="feature-text">View and edit comprehensive location information</span>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="feature-text">Visualize points on interactive maps with custom controls</span>
            </div>
          </div>
        </div>
        
        <div className="login-buttons">
          <button className="operator-button">
            Login as Operator
          </button>
          <button className="user-button">
            Login as User
          </button>
        </div>
      </div>
      
      <div className="footer">
        © {new Date().getFullYear()} Map Points Management System. All rights reserved.
      </div>
    </div>
  );
};

export default Landing;

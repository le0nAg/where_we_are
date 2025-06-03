import React from 'react';
import '../css/landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="top-section">
          <div className="logo-container">
            <div className="app-logo">
                <img src="logo_big.png" alt="" height="100%" width="100%" />
            </div>
          </div>
          <h2 className="app-title">Where we are</h2>
        </div>
        
        <div className="content-section">
          <p className="app-description">
            Questo progetto ha come obiettivo la gestione avanzata di punti di interesse (POI) di Trento. 
            <br />
            Gli operatori possono visualizzare, aggiungere e modificare i POI, oltre che raccoglierne le statistiche.
            <br />
            Gli utenti possono visualizzare i POI e salvarli tra i preferiti.
          </p>
        </div>
        
        <div className="login-buttons">
          <button className="operator-button" onClick={() => window.location.href = '/login'}>
            Login operatori
          </button>
          <button className="user-button" onClick={() => window.location.href = '/map'}>
            Applicazione utenti
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

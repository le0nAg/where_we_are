// src/components/Header.js
import React from "react";
import "../css/header.css";

const Header = ({ children }) => {
  return (
    <div className="top-bar">
      <div className="logo-container">
        <img src="/logo_32.png" alt="logo" />
        <span className="brand-name">WhereWeAre</span>
      </div>
      <div className="header-children">
        {children}
      </div>
    </div>
  );
};

export default Header;

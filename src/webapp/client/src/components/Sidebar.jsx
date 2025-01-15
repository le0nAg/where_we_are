import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Gestionale</h2>
      <nav>
        <ul>
          <li><Link to="/map">Mappa</Link></li>
          <li><Link to="/settings">Impostazioni</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Dashboard = () => {
  const [poiName, setPoiName] = useState(""); 
  const [coordinates, setCoordinates] = useState(null); 

  // Funzione per gestire il click sulla mappa
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setCoordinates(e.latlng); // Salva le coordinate selezionate
      },
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!poiName || !coordinates) {
      alert("Inserisci il nome del luogo e seleziona un punto sulla mappa.");
      return;
    }
  
    const newPoi = {
      nome: poiName,
      lat: coordinates.lat,
      lng: coordinates.lng,
    };
  
    try {
      const response = await fetch("http://localhost:5050/api/poi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPoi), // Convertiamo i dati in JSON
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Risposta dal server:", result);
  
        // Resetta il form
        setPoiName("");
        setCoordinates(null);
        alert("Punto di interesse aggiunto con successo!");
      } else {
        alert("Errore nel salvataggio del punto di interesse.");
        console.error("Errore HTTP:", response.statusText);
      }
    } catch (error) {
      alert("Errore di connessione al server.");
      console.error("Errore:", error);
    }
  };
  

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Benvenuto nel gestionale. Usa il form qui sotto per aggiungere un nuovo punto di interesse.</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <label>
            Nome del luogo:
            <input
              type="text"
              value={poiName}
              onChange={(e) => setPoiName(e.target.value)}
              placeholder="Inserisci il nome del luogo"
              required
              style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <p>
            Seleziona un punto sulla mappa. Coordinate selezionate:{" "}
            {coordinates ? `Lat: ${coordinates.lat}, Lng: ${coordinates.lng}` : "Nessuna"}
          </p>
        </div>

        <button type="submit" style={{ marginTop: "10px", padding: "10px 20px" }}>
          Salva Punto di Interesse
        </button>
      </form>

      {/* Mappa per selezionare il punto */}
      <MapContainer
        center={[46.0667, 11.1211]} // Coordinate iniziali di Trento
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />

        {/* Mostra un marker se ci sono coordinate selezionate */}
        {coordinates && <Marker position={coordinates} />}
      </MapContainer>
    </div>
  );
};

export default Dashboard;

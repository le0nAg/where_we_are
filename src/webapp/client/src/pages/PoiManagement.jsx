import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Modal from "react-modal";
import "leaflet/dist/leaflet.css";
import "../css/PoiManagement.css";

// Configurazione marker di Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Modal configurazione
Modal.setAppElement("#root");

const PoiManagement = () => {
  // Stato iniziale
  const [pois, setPois] = useState([
    { id: 1, name: "Piazza Duomo", lat: 46.0704, lng: 11.1195, description: "Piazza centrale di Trento" },
    { id: 2, name: "Muse - Museo delle Scienze", lat: 46.0675, lng: 11.1216, description: "Museo delle scienze interattivo" },
  ]);

  const [selectedPoi, setSelectedPoi] = useState(null); // Per visualizzare i dettagli
  const [editPoi, setEditPoi] = useState(null); // Per modificare un POI
  const [editedData, setEditedData] = useState({ name: "", description: "" });

  // Funzione per eliminare un POI
  const handleDelete = (id) => {
    setPois(pois.filter((poi) => poi.id !== id));
  };

  // Funzione per salvare modifiche
  const handleEditSave = () => {
    setPois(pois.map((poi) => (poi.id === editPoi.id ? { ...editPoi, ...editedData } : poi)));
    setEditPoi(null); // Chiudi il popup
  };

  return (
    <div className="poi-management">
      {/* Lista POI */}
      <div className="poi-list">
        <h2>Gestione POI</h2>
        <ul>
          {pois.map((poi) => (
            <li key={poi.id}>
              <div className="poi-item">
                <div>
                  <strong>{poi.name}</strong>
                </div>
                <div className="poi-actions">
                  <button onClick={() => setSelectedPoi(poi)}>Visualizza</button>
                  <button onClick={() => { setEditPoi(poi); setEditedData({ name: poi.name, description: poi.description }); }}>Modifica</button>
                  <button onClick={() => handleDelete(poi.id)}>Elimina</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mappa */}
      <div className="poi-map">
        <MapContainer center={[46.0667, 11.1211]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pois.map((poi) => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]}>
              <Popup>{poi.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Popup per visualizzazione dettagli */}
      <Modal
        isOpen={!!selectedPoi}
        onRequestClose={() => setSelectedPoi(null)}
        className="modal"
        overlayClassName="overlay"
      >
        {selectedPoi && (
          <div>
            <h2>{selectedPoi.name}</h2>
            <p>{selectedPoi.description}</p>
            <button onClick={() => setSelectedPoi(null)}>Chiudi</button>
          </div>
        )}
      </Modal>

      {/* Popup per modifica */}
      <Modal
        isOpen={!!editPoi}
        onRequestClose={() => setEditPoi(null)}
        className="modal"
        overlayClassName="overlay"
      >
        {editPoi && (
          <div>
            <h2>Modifica {editPoi.name}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave();
              }}
            >
              <label>
                Nome:
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                />
              </label>
              <label>
                Descrizione:
                <textarea
                  value={editedData.description}
                  onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                />
              </label>
              <button type="submit">Salva</button>
              <button type="button" onClick={() => setEditPoi(null)}>
                Annulla
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PoiManagement;

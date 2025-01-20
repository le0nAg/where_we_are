import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import '../css/PoiManagement.css';

const PoiManagement = () => {
  const [poiList, setPoiList] = useState([]);
  const [isAddingPoi, setIsAddingPoi] = useState(false); // Stato per abilitare la modalità aggiunta
  const [showAddForm, setShowAddForm] = useState(false); // Stato per mostrare il form
  const [newPoi, setNewPoi] = useState({ name: '', description: '', coordinates: null });
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const handleMapClick = (e) => {
    if (isAddingPoi) {
      const { lat, lng } = e.latlng;
      setSelectedCoordinates({ lat, lng });
      setShowAddForm(true);
      setIsAddingPoi(false); // Disabilita la modalità aggiunta dopo il clic
    }
  };

  const handleAddPoi = (e) => {
    e.preventDefault();
    if (!newPoi.name || !newPoi.description) {
      alert('Tutti i campi sono obbligatori!');
      return;
    }
    setPoiList([...poiList, { ...newPoi, coordinates: selectedCoordinates }]);
    setShowAddForm(false);
    setNewPoi({ name: '', description: '', coordinates: null });
    setSelectedCoordinates(null);
  };

  const AddPoiMarker = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return selectedCoordinates ? (
      <Marker position={[selectedCoordinates.lat, selectedCoordinates.lng]} />
    ) : null;
  };

  return (
    <div className="poi-management">
      <div className="poi-list">
        <h2>Gestione POI</h2>
        <ul>
          {poiList.map((poi, index) => (
            <li key={index}>
              <div className="poi-item">
                <strong>{poi.name}</strong>
                <p>{poi.description}</p>
                <p>Lat: {poi.coordinates.lat}, Lng: {poi.coordinates.lng}</p>
              </div>
            </li>
          ))}
        </ul>
        <button className="add-poi-button" onClick={() => setIsAddingPoi(true)}>
          Aggiungi POI
        </button>
      </div>
      <div className="poi-map">
        <MapContainer center={[46.0661, 11.1211]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <AddPoiMarker />
        </MapContainer>
      </div>
      {showAddForm && (
        <div className="overlay">
          <div className="modal">
            <h2>Aggiungi Nuovo POI</h2>
            <form onSubmit={handleAddPoi}>
              <p>Coordinate selezionate: {selectedCoordinates?.lat}, {selectedCoordinates?.lng}</p>
              <label>
                Nome:
                <input
                  type="text"
                  value={newPoi.name}
                  onChange={(e) => setNewPoi({ ...newPoi, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Descrizione:
                <textarea
                  value={newPoi.description}
                  onChange={(e) => setNewPoi({ ...newPoi, description: e.target.value })}
                  required
                />
              </label>
              <button type="submit">Salva</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Annulla</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoiManagement;

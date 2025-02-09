import React from "react";
import "../css/form.css";

const AddPoiForm = ({ coordinates, formData, onFormChange, onSubmit, onCancel }) => {
  return (
    <div className="form-overlay">
      <div className="poi-form-container">
        <h2>Aggiungi nuovo punto d'interesse</h2>
        <form onSubmit={onSubmit}>
          {/* <div className="form-group">
            <label>Coordinates:</label>
            <p className="coordinates-display">
              {coordinates?.[0]?.toFixed(5)}, {coordinates?.[1]?.toFixed(5)}
            </p>
          </div> */}

          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione:</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Annulla
            </button>
            <button type="submit" className="submit-button">
              Salva POI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPoiForm;
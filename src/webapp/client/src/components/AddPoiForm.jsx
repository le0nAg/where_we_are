import React from "react";
import "../css/form.css";

const AddPoiForm = ({  
  formData, 
  onFormChange, 
  onSubmit, 
  onCancel, 
  isSaving, 
  error 
}) => {
  return (
    <div className="form-overlay">
      <div className="poi-form-container">
        <h2>Aggiungi nuovo punto d'interesse</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione:</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              rows="3"
              disabled={isSaving}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
{/* <<<<<<< HEAD */}
            {/* <button 
              type="button" 
              className="cancel-button" 
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save POI"} */}
{/* ======= */}
            <button type="button" className="cancel-button" onClick={onCancel}>
              Annulla
            </button>
            <button type="submit" className="submit-button">
              Salva POI
{/* >>>>>>> 36c28dd0d58d7b08e0a40a259785c6c079609e25 */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPoiForm;
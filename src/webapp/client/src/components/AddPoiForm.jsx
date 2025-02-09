import React from "react";

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
        <h2>Add New Point of Interest</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
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
            <label htmlFor="description">Description:</label>
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
            <button 
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
              {isSaving ? "Saving..." : "Save POI"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPoiForm;
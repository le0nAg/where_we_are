import React from "react";

const AddPoiForm = ({ coordinates, formData, onFormChange, onSubmit, onCancel }) => {
  return (
    <div className="form-overlay">
      <div className="poi-form-container">
        <h2>Add New Point of Interest</h2>
        <form onSubmit={onSubmit}>
          {/* <div className="form-group">
            <label>Coordinates:</label>
            <p className="coordinates-display">
              {coordinates?.[0]?.toFixed(5)}, {coordinates?.[1]?.toFixed(5)}
            </p>
          </div> */}

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Save POI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPoiForm;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/showPoiComponent.css";

const ShowPoiComponent = ({ poiId, onClose }) => {
  const [poiData, setPoiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPoiDetails = async () => {
      try {
        const response = await axios.get(`/api/app/pois/${poiId}`);
        setPoiData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load POI details");
        setLoading(false);
      }
    };

    if (poiId) fetchPoiDetails();
  }, [poiId]);

  const handleChange = (e) => {
    setPoiData({
      ...poiData,
      properties: {
        ...poiData.properties,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);

    try {
      const response = await axios.post(
        `/api/poi/${poiId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setPoiData({
        ...poiData,
        properties: {
          ...poiData.properties,
          images: [...poiData.properties.images, response.data]
        }
      });
      setNewImage(null);
    } catch (err) {
      setError("Failed to upload image");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`/api/poi/images/${imageId}`);
      setPoiData({
        ...poiData,
        properties: {
          ...poiData.properties,
          images: poiData.properties.images.filter(img => img._id !== imageId)
        }
      });
    } catch (err) {
      setError("Failed to delete image");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await axios.put(`/api/poi/${poiId}`, {
        name: poiData.properties.name,
        description: poiData.properties.description
      });
      setIsSaving(false);
      onClose();
    } catch (err) {
      setError("Failed to save changes");
      setIsSaving(false);
    }
  };

  if (loading) return <div className="modal-overlay">Loading...</div>;
  if (error) return <div className="modal-overlay">{error}</div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Modifica POI</h2>
        
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={poiData.properties.name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Descrizione:</label>
            <textarea
              name="description"
              value={poiData.properties.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="images-section">
            <h3>Immagini:</h3>
            <div className="image-grid">
              {poiData.properties.images.map((image) => (
                <div key={image._id} className="image-item">
                  <img src={image.url} alt={image.name} />
                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={() => handleDeleteImage(image._id)}
                  >
                    Elimina
                  </button>
                </div>
              ))}
            </div>

            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!newImage}
              >
                Upload
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSaving}
              className="save-button"
            >
              {isSaving ? "Salvando..." : "Salva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShowPoiComponent;
import React, { useState } from "react";
import axios from "axios";
import "../css/showPoiComponent.css";

const ShowPoiComponent = ({ poi, onClose }) => {
  const [poiData, setPoiData] = useState(poi);
  const [error, setError] = useState("");
  const [newImages, setNewImages] = useState([]); 
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setPoiData({
      ...poiData,
      properties: {
        ...poiData.properties,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleImageUpload = async () => {
    if (newImages.length === 0) return; 

    const formData = new FormData();
    newImages.forEach((image) => {
      formData.append("files", image); 
    });
    formData.append("poiId", poi._id); 

    try {
      const response = await axios.post(`/api/app/upload-images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPoiData({
        ...poiData,
        properties: {
          ...poiData.properties,
          images: [...(poiData.properties.images || []), ...response.data.imageUrls],
        },
      });
      setNewImages([]); 
    } catch (err) {
      console.error("Image upload error:", err.response?.data || err);
      setError("Failed to upload images");
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      await axios.delete(`/api/app/images/${encodeURIComponent(imageUrl)}`, {
        data: { poiId: poi._id }, 
      });

      setPoiData({
        ...poiData,
        properties: {
          ...poiData.properties,
          images: poiData.properties.images.filter((url) => url !== imageUrl),
        },
      });
    } catch (err) {
      setError("Failed to delete image");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await axios.put(`/api/app/pois/${poi._id}`, {
        name: poiData.properties.name,
        description: poiData.properties.description,
      });
      setIsSaving(false);
      onClose();
    } catch (err) {
      setError("Failed to save changes");
      setIsSaving(false);
    }
  };

  if (error) return <div className="modal-overlay">{error}</div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
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
              {poiData.properties.images.map((imageUrl, index) => (
                <div key={index} className="image-item">
                  <img
                    src={`${imageUrl}`}
                    alt={`POI Image ${index}`}
                    onError={(e) => {
                      alert(imageUrl);
                    }}
                  />
                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={() => handleDeleteImage(imageUrl)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple // Consente la selezione di più file
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={newImages.length === 0} // Disabilita il pulsante se non ci sono nuove immagini
              >
                Upload
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSaving} className="save-button">
              {isSaving ? "Salvando..." : "Salva"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ShowPoiComponent;
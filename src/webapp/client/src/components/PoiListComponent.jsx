import React, { useState } from "react";
import { useFetchPois } from "../hooks/useFetchData";
import { useDeletePois } from "../hooks/useDeletePois";
const util = require('util');

const PoiListComponent = ({ pois }) => {
  const [selectedPois, setSelectedPois] = useState(new Set());
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  const { data, loading, error } = useFetchPois();
  const { deletePois, deleteLoading, deleteError } = useDeletePois();

  pois = data;

  const handleCheckboxChange = (poiId) => {
    setSelectedPois((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(poiId) ? newSelection.delete(poiId) : newSelection.add(poiId);
      return newSelection;
    });
  };

  const handleImageNavigation = (poiId, direction) => {
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [poiId]:
        direction === "next"
          ? ((prev[poiId] || 0) + 1) % pois.find((p) => p._id === poiId).properties.images.length
          : ((prev[poiId] || 0) - 1 + pois.find((p) => p._id === poiId).properties.images.length) %
            pois.find((p) => p._id === poiId).properties.images.length,
    }));
  };

  const handleDelete = async () => {
    await deletePois([...selectedPois]);
    //TODO: refresh
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="poi-list">
      <div className="delete-controls">
        <button
          onClick={handleDelete}
          disabled={selectedPois.size === 0 || deleteLoading}
          className="delete-button"
        >
          {deleteLoading ? "Deleting..." : `Delete Selected (${selectedPois.size})`}
        </button>
        {deleteError && <div className="error-message">{deleteError}</div>}
      </div>

      {pois.map((poi) => {
        const poiId = poi._id;
        const currentImageIndex = currentImageIndexes[poiId] || 0;
        const images = poi.properties.images || [];
        const hasMultipleImages = images.length > 1;

        return (
          <div key={poiId} className="poi-item">
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={selectedPois.has(poiId)}
                onChange={() => handleCheckboxChange(poiId)}
              />
            </div>

            {images.length > 0 && (
              <div className="image-carousel">
                <img
                  src={images[currentImageIndex]}
                  alt={`${poi.properties.name} - ${currentImageIndex + 1}`}
                  className="poi-image"
                />
                {hasMultipleImages && (
                  <div className="carousel-controls">
                    <button onClick={() => handleImageNavigation(poiId, "prev")}>&lt;</button>
                    <button onClick={() => handleImageNavigation(poiId, "next")}>&gt;</button>
                  </div>
                )}
              </div>
            )}

            <div className="poi-info">
              <h2 className="poi-name">{poi.properties.name}</h2>
              {poi.properties.description && (
                <p className="poi-description">{poi.properties.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PoiListComponent;

// Add CSS styles
const styles = `
.poi-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.poi-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.checkbox-container {
  margin-right: 10px;
}

.checkbox-container input {
  margin-top: 20px;
}

.image-carousel {
  position: relative;
  min-width: 150px;
  max-width: 150px;
  height: 100px;
}

.poi-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.carousel-controls {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 2px;
}

.carousel-controls button {
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
}

.poi-info {
  flex-grow: 1;
}

.poi-name {
  margin: 0 0 8px 0;
  font-size: 1.2em;
}

.poi-description {
  margin: 0;
  color: #666;
  font-size: 0.9em;
  line-height: 1.4;
}
`;

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
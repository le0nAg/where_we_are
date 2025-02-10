import React, { useState } from "react";
import { useFetchPois } from "../hooks/useFetchData";
import { useDeletePois } from "../hooks/useDeletePois";
import "../css/poiList.css";

const PoiListComponent = ({ pois }) => {
  const [selectedPois, setSelectedPois] = useState(new Set());
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  const { deletePois, deleteLoading, deleteError } = useDeletePois();


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

  return (
    <div className="poi-list">
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

            <div className="poi-content">
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
          </div>
        );
      })}

      <button
        onClick={handleDelete}
        disabled={selectedPois.size === 0 || deleteLoading}
        className="delete-button-fixed"
      >
        {deleteLoading ? "Deleting..." : `Delete Selected (${selectedPois.size})`}
      </button>
    </div>
  );
};

export default PoiListComponent;
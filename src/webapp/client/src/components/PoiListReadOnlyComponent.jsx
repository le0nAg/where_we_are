import React, { useState } from "react";
import "../css/poiList.css";

const PoiListReadOnlyComponent = ({ pois }) => {
  const [selectedPois, setSelectedPois] = useState(new Set());
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);

  const handleCheckboxChange = (poiId) => {
    setSelectedPois((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(poiId) ? newSelection.delete(poiId) : newSelection.add(poiId);
      return newSelection;
    });
  };

  const handleImageNavigation = (poiId, direction) => {
    setCurrentImageIndexes((prev) => {
      const poi = pois.find((p) => p._id === poiId);
      const imageCount = poi?.properties?.images?.length || 0;
      if (imageCount === 0) return prev;

      const currentIndex = prev[poiId] || 0;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % imageCount
          : (currentIndex - 1 + imageCount) % imageCount;

      return {
        ...prev,
        [poiId]: newIndex,
      };
    });
  };

  const handleExport = async () => {
    setExportLoading(true);
    setExportError(null);

    const selected = pois.filter((poi) => selectedPois.has(poi._id));

    try {
      const response = await fetch("/api/export-pois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pois: selected }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      alert("POIs exported successfully.");
      setSelectedPois(new Set());
    } catch (err) {
      console.error("Export error:", err);
      setExportError("Failed to export POIs. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const filteredPois = pois.filter((poi) =>
    poi.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="poi-list">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search POIs by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {filteredPois.map((poi) => {
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
        onClick={handleExport}
        disabled={selectedPois.size === 0 || exportLoading}
        className="export-button-fixed"
      >
        {exportLoading ? "Exporting..." : `Export Selected (${selectedPois.size})`}
      </button>

      {exportError && <div className="error-message">{exportError}</div>}
    </div>
  );
};

export default PoiListReadOnlyComponent;

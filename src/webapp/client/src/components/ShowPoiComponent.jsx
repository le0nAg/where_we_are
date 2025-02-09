import React, { useState, useEffect } from 'react';
import { useFetchPoi } from '../hooks/useFetchData';

const ShowPoiComponent = ({ poiId, onClose, initialEditing = false }) => {
  const { data: fetchedData, loading, error: fetchError } = useFetchPoi(poiId);
  const [poiData, setPoiData] = useState(null);
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: []
  });
  const [saveError, setSaveError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (fetchedData) {
      setPoiData(fetchedData);
      setFormData({
        name: fetchedData.properties.name,
        description: fetchedData.properties.description || '',
        images: fetchedData.properties.images || []
      });
      setCurrentImageIndex(0); 
    }
  }, [fetchedData]);

  useEffect(() => {
    if (initialEditing) {
      setIsEditing(true);
    }
  }, [initialEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (formData.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % formData.images.length);
    }
  };

  const prevImage = () => {
    if (formData.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + formData.images.length) % formData.images.length);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/app/pois/${poiId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            ...poiData.properties,
            name: formData.name,
            description: formData.description,
            images: formData.images.filter(img => img.trim() !== '')
          }
        })
      });
      if (!response.ok) throw new Error('Salvataggio fallito');
      const updatedData = await response.json();
      setPoiData(updatedData);
      setIsEditing(false);
      setSaveError('');
    } catch (err) {
      setSaveError(err.message);
    }
  };

  if (loading) return <div>Caricamento...</div>;
  if (fetchError) return <div>Errore nel caricamento dei dati</div>;
  if (!poiData) return null;

  return (
    
    <div className="poi-details">
      {saveError && <div className="error">{saveError}</div>}
      <button onClick={onClose} className="close-btn">Chiudi</button>
      {isEditing ? (
        <div className="edit-mode">
          <div>
            <input type="file" onChange={handleImageUpload} />
          </div>
          <div className="image-list">
            {formData.images.map((img, index) => (
              <div key={index} className="image-item">
                <img src={img} alt={`poi-${index}`} style={{ width: '100px' }} />
                <button onClick={() => removeImage(index)}>Rimuovi</button>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Nome:</label>
            <input name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Descrizione:</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div className="form-actions">
            <button onClick={handleSave}>Salva</button>
            <button onClick={() => setIsEditing(false)}>Annulla</button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <h2>{poiData.properties.name}</h2>
          <p>{poiData.properties.description}</p>
          {formData.images.length > 0 && (
            <div className="carousel">
              <button onClick={prevImage}>&lt;</button>
              <img
                src={formData.images[currentImageIndex]}
                alt={`Visuale POI ${currentImageIndex + 1}`}
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ width: '200px' }}
              />
              <button onClick={nextImage}>&gt;</button>
            </div>
          )}
          <button onClick={() => setIsEditing(true)}>Modifica</button>
        </div>
      )}
    </div>
  );
};

export default ShowPoiComponent;

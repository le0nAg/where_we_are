import React, { useState, useEffect } from 'react';
import { useFetchPoi } from '../hooks/useFetchData';

const ShowPoiComponent = ({ poiId }) => {
  const { data: fetchedData, loading, error: fetchError } = useFetchPoi(poiId);
  const [poiData, setPoiData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
    }
  }, [fetchedData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/app/pois/${poiId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % formData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + formData.images.length) % formData.images.length);
  };

  if (loading) return <div>Caricamento...</div>;
  if (fetchError) return <div>Errore nel caricamento dei dati</div>;
  if (!poiData) return null;

  return (
    <div className="poi-details">
      {saveError && <div className="error">{saveError}</div>}

      {isEditing ? (
        <>
          <div className="image-editor">
            {formData.images.map((img, index) => (
              <div key={index} className="image-input">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="URL immagine"
                />
                <button onClick={() => removeImageField(index)}>×</button>
              </div>
            ))}
            <button onClick={addImageField} className="add-image">Aggiungi URL immagine</button>
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
            <button onClick={handleSave} className="save-btn">Salva</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Annulla</button>
          </div>
        </>
      ) : (
        <>
          <div className="carousel">
            {formData.images.length > 0 && (
              <>
                <button onClick={prevImage}>&lt;</button>
                <img 
                  src={formData.images[currentImageIndex]} 
                  alt={`Visuale POI ${currentImageIndex + 1}`}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <button onClick={nextImage}>&gt;</button>
              </>
            )}
          </div>

          <div className="poi-info">
            <h2>{poiData.properties.name}</h2>
            <p>{poiData.properties.description}</p>
          </div>

          <button onClick={() => setIsEditing(true)} className="edit-btn">Modifica</button>
        </>
      )}
    </div>
  );
};

export default ShowPoiComponent;
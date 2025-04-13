import React, { useState } from 'react';
import axios from 'axios';

const ItineraryModal = ({ onClose }) => {
    const [preferences, setPreferences] = useState("");
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const response = await axios.post('/api/itinerary', { preferences });
        setItinerary(response.data);
      } catch (error) {
        console.error('Failed to generate itinerary');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Plan Your Itinerary</h2>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Tell us what you'd like to see and do..."
            />
            <button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Create Itinerary"}
            </button>
          </form>
          
          {itinerary && (
            <div className="itinerary-result">
              <h3>Your Personalized Itinerary</h3>
              {/* Display itinerary */}
            </div>
          )}
          
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };
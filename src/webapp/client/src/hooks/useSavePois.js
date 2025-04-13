import { useState } from "react";
import axios from "axios";

export const useSavePoi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const savePoi = async (poiId) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.post('/api/user/save-poi', { poiId }, {
          withCredentials: true
        });
        return response.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };
    
    return { savePoi, isLoading, error };
  };
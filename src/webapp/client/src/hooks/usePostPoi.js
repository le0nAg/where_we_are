import { useState } from 'react';
import axios from 'axios';

const usePostPoi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const postPoi = async (poiData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/app/addPoi', poiData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save POI');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { postPoi, isLoading, error };
};

export default usePostPoi;
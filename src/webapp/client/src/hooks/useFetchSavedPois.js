import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchSavedPois = (userId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/user/saved-pois', {
            withCredentials: true
          });
          setData(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, [userId]);
    
    return { data, loading, error };
  };
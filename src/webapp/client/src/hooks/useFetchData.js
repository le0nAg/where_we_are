import { useState, useEffect } from "react";

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

const useFetchPois = () => {
  return useFetchData(`${process.env.REACT_APP_API_URL}/api/app/getAllPois`);
};

const useFetchPoi = (uidPoi) => {
  return useFetchData(`${process.env.REACT_APP_API_URL}/api/app/pois/${uidPoi}`);
};

export { useFetchData, useFetchPois, useFetchPoi };
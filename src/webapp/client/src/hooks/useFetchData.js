import { useState, useEffect } from "react";
import URI from "./uri.js";

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          console.log(response);
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
  return useFetchData(`/api/app/getAllPois`);
};

const useFetchPoi = ( uidPoi ) => {
  return useFetchData(`${URI}/api/app/pois/${uidPoi}`);
}

export {useFetchData, useFetchPois, useFetchPoi};
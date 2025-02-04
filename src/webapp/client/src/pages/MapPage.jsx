import React from "react";
import MapComponent from "../components/MapComponent";
import {useFetchPois} from "../hooks/useFetchData";

const MapPage = () => {
  const { data, loading, error } = useFetchPois();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Map with Backend Data</h1>
      <MapComponent data={data} />
    </div>
  );
};

export default MapPage;
import React from "react";
import MapComponent from "../components/MapComponent";
import {useFetchPois} from "../hooks/useFetchData";

const MapPage = () => {
  const { data, loading, error } = useFetchPois();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <MapComponent data={data} />
    </div>
  );
};

export default MapPage;
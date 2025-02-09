import React from "react";
import axios from "axios";
import PoiManagementComponent from "../components/PoiManagementComponent";
import { useFetchPois } from "../hooks/useFetchData"; // Import the custom hook

const PoiManagementPage = () => {
  const { data: pois, loading, error } = useFetchPois(); 

  const handleAddPolygon = async (newPolygon) => {
    try {
      const response = await axios.post("http://localhost:5000/api/app/addPoi", newPolygon);
      console.log("New Polygon added:", response.data);
    } catch (err) {
      console.error("Error adding Polygon:", err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div>
      <PoiManagementComponent pois={pois} onAddPolygon={handleAddPolygon}/>
    </div>
  );
};

export default PoiManagementPage;
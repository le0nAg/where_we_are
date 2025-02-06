import React from "react";
import axios from "axios";
import PoiManagementComponent from "../components/PoiManagementComponent";
import { useFetchPois } from "../hooks/useFetchData"; // Import the custom hook

const PoiManagementPage = () => {
  const { data: pois, loading, error } = useFetchPois(); 
  
  const handleAddPoint = async (newPoint) => {
    try {
      const response = await axios.post("http://localhost:5000/api/app/addPoi", newPoint);
      console.log("New POI added:", response.data);
    } catch (err) {
      console.error("Error adding POI:", err.message);
    }
  };

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
      <h1>POI Management</h1>
      <PoiManagementComponent pois={pois} onAddPoi={handleAddPoint} onAddPolygon={handleAddPolygon}/>
    </div>
  );
};

export default PoiManagementPage;
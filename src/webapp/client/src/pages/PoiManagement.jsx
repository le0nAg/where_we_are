import React from "react";
import axios from "axios";
import PoiManagementComponent from "../components/PoiManagementComponent";
import { useFetchPois } from "../hooks/useFetchData"; // Import the custom hook

// TODO:
// - fix form:
//    - clean on open
//    - styling
//
// - 

const PoiManagementPage = () => {
  const { data: pois, loading, error } = useFetchPois(); 
  
  // Handle adding a new POI
  const handleAddPoi = async (newPoi) => {
    try {
      const response = await axios.post("http://localhost:5000/api/app/addPoi", newPoi);
      // If the hook doesn't automatically refetch, you can manually update the state
      // or trigger a refetch if your hook supports it.
      console.log("New POI added:", response.data);
    } catch (err) {
      console.error("Error adding POI:", err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>POI Management</h1>
      <PoiManagementComponent pois={pois} onAddPoi={handleAddPoi} />
    </div>
  );
};

export default PoiManagementPage;
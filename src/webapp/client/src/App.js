import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MapPage from "./pages/MapPage";
import PoiManagement from "./pages/PoiManagementPage";
import Login from "./pages/authn/Login";
import Settings from "./pages/Settings";
import "./css/App.css";
import UploaderComponent from "./components/ImageUploader"; // Ensure this path is correct
import { useAuthnContext } from "./hooks/useAuthnContext";
import PoiListComponent from "./components/PoiListComponent";
import { useFetchPois } from "./hooks/useFetchData";
import ShowPoiComponent from "./components/ShowPoiComponent";

function App() {
  const { user } = useAuthnContext();
  console.log(user);
  const { data, loading, error } = useFetchPois();
  console.log(data);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleImageUploadSuccess = (urls) => {
    console.log("Images uploaded successfully:", urls);
    // You can now pass these image URLs when saving a POI
  };

  return (
    <BrowserRouter>
        <div className="app">
          {/* <Sidebar /> */}
          <div className="content">
            <Routes>
            {//debugging purpose only
            user ? 
            console.log("usr: "+user) : console.log("no user")}

              {/* {<Route path="/" element={<Dashboard />} />}               */}
              
              <Route path="/map" element={<MapPage />} />
              <Route path="/poi-management" element={<PoiManagement />}/>
              <Route path="/" element={<PoiManagement />}/>
              
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/list" element={<PoiListComponent data={data}/>}></Route>
              <Route path="/poiVisualizer" element={<ShowPoiComponent poiId={'678d34e7c78677a02b9fb4fa'}/>}></Route>
              
              <Route path="/uploader" 
                element={<UploaderComponent onUploadSuccess={handleImageUploadSuccess} />}></Route>

            </Routes>
          </div>
        </div>
    </BrowserRouter>
  );
}

export default App;

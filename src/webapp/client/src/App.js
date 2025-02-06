import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import PoiManagement from "./pages/PoiManagementPage";
import Login from "./pages/authn/Login";

import Settings from "./pages/Settings";
import "./css/App.css";
import { useAuthnContext } from "./hooks/useAuthnContext";
import PoiListComponent from "./components/PoiListComponent";
import { useFetchPois } from "./hooks/useFetchData";

function App() {
  const { user } = useAuthnContext();
  console.log(user);
  const { data, loading, error } = useFetchPois();
  console.log(data);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
              <Route path="/list" element={
                  
                
                <PoiListComponent data={data}/>
                }></Route>
              
            </Routes>
          </div>
        </div>
    </BrowserRouter>
  );
}

export default App;

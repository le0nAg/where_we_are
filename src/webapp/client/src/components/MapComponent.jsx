import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = ({ data }) => {
  return (
    <MapContainer
      center={[46.0667, 11.1211]} 
      zoom={14} 
      style={{ width: "100%", height: "80vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render features dynamically based on the backend data */}
      {
        data
        .filter((poi) => poi.geometry.type === "Point")
        .map((poi, index) => (
          <Marker
            key={index}
            position={[poi.geometry.coordinates[1], poi.geometry.coordinates[0]]}
          >
            <Popup>
              <strong>{poi.properties.name}</strong>
              <br />
              {poi.properties.description}
            </Popup>
          </Marker>
        ))
      }
      
      {/*FIXME: below code actually doesn't works but would be prefered*/}
      {data.map((feature, index) => {
        const { geometry, properties } = feature;

        switch (geometry.type) {
          case "Point":
            return (
              <Marker key={index} position={geometry.coordinates}>
                <Popup>
                  <strong>{properties.name}</strong>
                  <br />
                  {properties.description}
                  <br />
                  {properties.images.map((image, i) => (
                    <img key={i} src={image} alt={`Image ${i}`} style={{ width: "100px", margin: "5px" }} />
                  ))}
                </Popup>
              </Marker>
            );

          case "Polygon":
            return (
              <Polygon key={index} positions={geometry.coordinates}>
                <Popup>
                  <strong>{properties.name}</strong>
                  <br />
                  {properties.description}
                  <br />
                  {properties.images.map((image, i) => (
                    <img key={i} src={image} alt={`Image ${i}`} style={{ width: "100px", margin: "5px" }} />
                  ))}
                </Popup>
              </Polygon>
            );

          case "LineString":
            return (
              <Polyline key={index} positions={geometry.coordinates}>
                <Popup>
                  <strong>{properties.name}</strong>
                  <br />
                  {properties.description}
                  <br />
                  {properties.images.map((image, i) => (
                    <img key={i} src={image} alt={`Image ${i}`} style={{ width: "100px", margin: "5px" }} />
                  ))}
                </Popup>
              </Polyline>
            );

          default:
            return null;
        }
      })}
    </MapContainer>
  );
};

export default MapComponent;
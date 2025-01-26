import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Cafe = () => {
  const [cafes, setCafes] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 40.765345171436856,
    lng: -73.97994506057127,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const fetchNearbyCafes = (map) => {
    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: mapCenter,
        radius: 500,
        type: "cafe",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setCafes(results);
        } else {
          console.error("PlacesService failed:", status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={["places"]}>
      <h1>Nearby Cafes</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={15}
        onLoad={(map) => fetchNearbyCafes(map)}
      >
        {cafes.map((cafe) => (
          <Marker
            key={cafe.place_id}
            position={cafe.geometry.location}
            title={cafe.name}
          />
        ))}
      </GoogleMap>

      <ul>
        {cafes.map((cafe) => (
          <li key={cafe.place_id}>{cafe.name}</li>
        ))}
      </ul>
    </LoadScript>
  );
};

export default Cafe;

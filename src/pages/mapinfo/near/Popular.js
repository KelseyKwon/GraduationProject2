import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Popular = () => {
  const [attractions, setAttractions] = useState([]);
  const mapCenter = {
    lat: 40.765345171436856,
    lng: -73.97994506057127,
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const fetchNearbyAttractions = (map) => {
    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: mapCenter,
        radius: 500,
        type: "tourist_attraction", // 명소 검색
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAttractions(results);
        } else {
          console.error("PlacesService failed:", status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={["places"]}>
      <h1>Popular Attractions</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={15}
        onLoad={(map) => fetchNearbyAttractions(map)}
      >
        {attractions.map((attraction) => (
          <Marker
            key={attraction.place_id}
            position={attraction.geometry.location}
            title={attraction.name}
          />
        ))}
      </GoogleMap>

      <ul>
        {attractions.map((attraction) => (
          <li key={attraction.place_id}>{attraction.name}</li>
        ))}
      </ul>
    </LoadScript>
  );
};

export default Popular;

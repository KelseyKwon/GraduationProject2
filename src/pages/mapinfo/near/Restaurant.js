import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const mapCenter = {
    lat: 40.765345171436856,
    lng: -73.97994506057127,
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const fetchNearbyRestaurants = (map) => {
    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: mapCenter,
        radius: 500,
        type: "restaurant", // 식당 검색
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setRestaurants(results);
        } else {
          console.error("PlacesService failed:", status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={["places"]}>
      <h1>Nearby Restaurants</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={15}
        onLoad={(map) => fetchNearbyRestaurants(map)}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.place_id}
            position={restaurant.geometry.location}
            title={restaurant.name}
          />
        ))}
      </GoogleMap>

      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.place_id}>{restaurant.name}</li>
        ))}
      </ul>
    </LoadScript>
  );
};

export default Restaurant;

import React, { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const NearInfo = ({ concert, artistId }) => {
  console.log("NearInfo artistId:", artistId);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("cafe");
  const [places, setPlaces] = useState([]);
  const [mapReady, setMapReady] = useState(false); // API 로딩 여부

  useEffect(() => {
    if (concert?.coordinates) {
      setLatitude(concert.coordinates.latitude);
      setLongitude(concert.coordinates.longitude);
    }
  }, [concert]);

  const fetchPlaces = (category) => {
    if (!window.google?.maps) return;
    if (latitude === 0 && longitude === 0) {
      console.warn("Invalid coordinates, skipping fetchPlaces");
      return;
    }
    console.log("Fetching places for:", category, latitude, longitude);

    const dummyMapDiv = document.createElement("div");
    const dummyMap = new window.google.maps.Map(dummyMapDiv, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
    });

    const service = new window.google.maps.places.PlacesService(dummyMap);

    const request = {
      location: { lat: latitude, lng: longitude },
      radius: 1500,
      type: category,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(
          results.map((place) => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
          }))
        );
      } else {
        console.warn("Places API Error:", status);
        setPlaces([]);
      }
    });
  };

  useEffect(() => {
    if (mapReady && latitude !== 0 && longitude !== 0) {
      fetchPlaces(selectedCategory);
    }
  }, [selectedCategory, latitude, longitude, mapReady]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAEvELryy_YAdKvjzbf3bnGQ9IhlJ3xRaY"
      libraries={libraries}
      onLoad={() => {
        setMapReady(true);
        fetchPlaces(selectedCategory);
      }}
    >
      <div style={{ display: "flex", height: "100vh", position: "relative" }}>
        {/* 오른쪽 고정 버튼 */}
        <div
          style={{
            position: "fixed",
            top: "200px",
            right: "50px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: 10,
          }}
        >
          {["cafe", "tourist_attraction", "restaurant"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "10px 15px",
                border: "1px solid black",
                backgroundColor:
                  selectedCategory === category ? "#3498db" : "#f0f0f0",
                color: selectedCategory === category ? "#fff" : "#000",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {category === "cafe"
                ? "Cafe"
                : category === "tourist_attraction"
                ? "Popular"
                : "Restaurant"}
            </button>
          ))}
        </div>

        {/* 카드 목록 */}
        <div
          style={{
            flex: 1,
            marginRight: "180px",
            overflowY: "scroll",
            padding: "5px 20px 20px 20px",
            marginTop: "-20px"
          }}
        >
          <h2>
            {concert?.venue?.name} 근처{" "}
            {selectedCategory === "cafe"
              ? "카페"
              : selectedCategory === "tourist_attraction"
              ? "명소"
              : "식당"}
          </h2>
          <p>{concert?.date} - {concert?.venue?.city}, {concert?.venue?.country}</p>

          {places.length === 0 ? (
            <p>장소를 불러오는 중이거나 결과가 없습니다.</p>
          ) : (
            places.map((place) => (
              <div
                key={place.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "10px",
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",  // 클릭 가능 표시
                }}
                onClick={() => {
                  const url = `https://www.google.com/maps/place/?q=place_id:${place.id}`;
                  window.open(url, "_blank");  // 새 탭으로 열기
                }}
              >
                <h3>{place.name}</h3>
                <p>{place.address}</p>
                {place.rating && <p>⭐ Rating: {place.rating}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </LoadScript>
  );
};

export default NearInfo;
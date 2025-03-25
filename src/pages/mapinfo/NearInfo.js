import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import data from "../../data/ArtistData_Cho.json"; // JSON 파일 불러오기

const NearInfo = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null); // 카테고리 상태
  const [markers, setMarkers] = useState([]); // 마커 상태

  // 카테고리별 Google Places API 호출
  const fetchPlaces = async (category) => {
    try {
      if (!latitude || !longitude) return;

      const location = { lat: latitude, lng: longitude };
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      const request = {
        location,
        radius: 1500, // 반경 1.5km
        type: [category], // 'cafe', 'restaurant', 'tourist_attraction' 등
      };

      placesService.nearbySearch(request, (results, status) => {
        console.log("Places API Status: ", status);
        console.log("Places API Results: ", results);

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setMarkers(
            results.map((place) => ({
              id: place.place_id,
              name: place.name,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            }))
          );
        } else {
          setMarkers([]); // 결과가 없으면 마커 초기화
        }
      });
    } catch (error) {
      console.error("Error fetching places: ", error);
    }
  };

  // 데이터 로딩 후 첫 번째 위치를 기본으로 설정
  useEffect(() => {
    if (data.length > 0) {
      const currentData = data[0]; // 첫 번째 데이터 선택
      console.log("Loaded Data: ", currentData);
      setLatitude(currentData?.coordinates.latitude || 0);
      setLongitude(currentData?.coordinates.longitude || 0);
    }
  }, []);

  // 선택된 카테고리 변경 시 마커 업데이트
  useEffect(() => {
    console.log("Selected Category: ", selectedCategory);
    if (selectedCategory) {
      fetchPlaces(selectedCategory);
    }
  }, [selectedCategory, latitude, longitude]);

  return (
    <div>
      <h3>Near Info Page</h3>

      {/* 카테고리 버튼 */}
      <nav>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "10px" }}>
          <li>
            <button
              onClick={() => setSelectedCategory("restaurant")}
              style={{
                backgroundColor: selectedCategory === "restaurant" ? "blue" : "white",
                color: selectedCategory === "restaurant" ? "white" : "black",
                padding: "10px",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              Restaurants
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedCategory("cafe")}
              style={{
                backgroundColor: selectedCategory === "cafe" ? "blue" : "white",
                color: selectedCategory === "cafe" ? "white" : "black",
                padding: "10px",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              Cafes
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedCategory("tourist_attraction")}
              style={{
                backgroundColor: selectedCategory === "tourist_attraction" ? "blue" : "white",
                color: selectedCategory === "tourist_attraction" ? "white" : "black",
                padding: "10px",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              Popular Attractions
            </button>
          </li>
        </ul>
      </nav>

      {/* 구글 맵 */}
      <LoadScript googleMapsApiKey="AIzaSyAEvELryy_YAdKvjzbf3bnGQ9IhlJ3xRaY">
        <GoogleMap
          center={{ lat: latitude, lng: longitude }}
          zoom={14}
          mapContainerStyle={{ height: "400px", width: "100%" }}
        >
          {/* 마커 표시 */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              label={marker.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default NearInfo;

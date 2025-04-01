import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import data from "../../data/ArtistData_Cho.json"; // JSON 파일 불러오기

const libraries = ["places"]; // LoadScript의 `libraries` 최적화

const NearInfo = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null); // 구글 맵 인스턴스 저장

  // Google Places API 호출
  const fetchPlaces = async (category) => {
    if (!mapRef.current) {
      console.warn("Google Map is not loaded yet");
      return;
    }
    if (!latitude || !longitude) {
      console.warn("Latitude or Longitude is not set");
      return;
    }

    console.log("Fetching places for category:", category);

    const placesService = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: { lat: latitude, lng: longitude },
      radius: 1500,
      type: [category],
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("✅ Places API Results:", results);
        setMarkers(
          results.map((place) => ({
            id: place.place_id,
            name: place.name,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          }))
        );
      } else {
        console.error(`❌ Places API Error: ${status}`);
        if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.warn("⚠️ No places found.");
        } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          console.error("🚨 API quota exceeded! Try again later.");
        } else if (status === window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
          console.error("⛔ API request denied. Check your API key and billing settings.");
        } else if (status === window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
          console.error("❌ Invalid request parameters.");
        } else {
          console.error("🔥 Unknown Places API error.");
        }
        setMarkers([]); // 오류 시 마커 초기화
      }
    });
  };

  // 데이터 로딩 후 첫 번째 위치를 기본으로 설정
  useEffect(() => {
    if (data.length > 0) {
      const currentData = data[0];
      console.log("Loaded Data: ", currentData);
      setLatitude(currentData?.coordinates.latitude || 0);
      setLongitude(currentData?.coordinates.longitude || 0);
    }
  }, []);

  // 선택된 카테고리 변경 시 마커 업데이트
  useEffect(() => {
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
          {["restaurant", "cafe", "tourist_attraction"].map((category) => (
            <li key={category}>
              <button
                onClick={() => setSelectedCategory(category)}
                style={{
                  backgroundColor: selectedCategory === category ? "blue" : "white",
                  color: selectedCategory === category ? "white" : "black",
                  padding: "10px",
                  border: "1px solid black",
                  cursor: "pointer",
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 구글 맵 */}
      <LoadScript googleMapsApiKey="AIzaSyAEvELryy_YAdKvjzbf3bnGQ9IhlJ3xRaY" libraries={libraries}>
        <GoogleMap
          center={{ lat: latitude, lng: longitude }}
          zoom={14}
          mapContainerStyle={{ height: "400px", width: "100%" }}
          onLoad={(map) => (mapRef.current = map)} // 지도 로드 후 참조 저장
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

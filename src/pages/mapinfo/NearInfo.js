// src/pages/mapinfo/NearInfo.js
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import data from "../../data/ArtistData_Cho.json"; // JSON 파일 불러오기

const NearInfo = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null); // 초기값을 null로 설정
  const [markers, setMarkers] = useState([]); // 선택된 카테고리의 마커 상태

  // 카테고리별 Google Places API 호출
  const fetchPlaces = async (category) => {
    try {
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
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setMarkers(
            results.map((place) => ({
              id: place.place_id,
              name: place.name,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            }))
          );
        }
      });
    } catch (error) {
      console.error("Error fetching places: ", error);
    }
  };

  // 데이터 로딩 후 첫 번째 위치를 기본으로 설정
  useEffect(() => {
    const currentData = data[0]; // 첫 번째 데이터 선택
    setLatitude(currentData?.coordinates.latitude || 0);
    setLongitude(currentData?.coordinates.longitude || 0);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchPlaces(selectedCategory); // 카테고리 변경 시 마커를 업데이트
    }
  }, [selectedCategory, latitude, longitude]); // latitude와 longitude가 변경될 때도 마커를 업데이트


  return (
    <div>
      <h3>Near Info Page</h3>
      {/* 네비게이션 메뉴 */}
      <nav>
        <ul>
          <li>
            <NavLink
              to="#"
              onClick={() => setSelectedCategory("restaurant")}
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "blue" : "black",
              })}
            >
              Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#"
              onClick={() => setSelectedCategory("cafe")}
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "blue" : "black",
              })}
            >
              Cafes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#"
              onClick={() => setSelectedCategory("tourist_attraction")}
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "blue" : "black",
              })}
            >
              Popular Attractions
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* 구글 맵 로드 */}
      <LoadScript googleMapsApiKey="AIzaSyBW5PKkaDcfAHlGWjW94ikbGg6l9rws5nU">
        <GoogleMap
          center={{ lat: latitude, lng: longitude }}
          zoom={14}
          mapContainerStyle={{ height: "400px", width: "300%", marginLeft: "-400px",}}
          
        >
          {/* 선택된 카테고리의 마커들 렌더링 */}
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
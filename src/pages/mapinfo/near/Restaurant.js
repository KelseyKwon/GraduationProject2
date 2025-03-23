// src/pages/mapinfo/near/Cafe.js
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const Restaurant = () => {
  const { latitude, longitude } = useOutletContext(); // NearInfo에서 받은 좌표값
  const [restaurants, setRestaurants] = useState([]); // 카페 리스트 상태
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // 선택된 카페 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // API에서 카페 정보를 가져오는 함수
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true); // 로딩 시작
        // API 요청 (여기서는 예시 URL을 사용)
        const response = await fetch(
          `https://api.example.com/restaurants?latitude=${latitude}&longitude=${longitude}`
        );
        if (!response.ok) {
          throw new Error("카페 데이터를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setRestaurants(data); // 카페 데이터 저장
      } catch (error) {
        setError(error.message); // 에러 처리
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchRestaurants(); // 카페 정보 가져오기
  }, [latitude, longitude]); // 좌표가 바뀔 때마다 API 호출

  return (
    <div>
      <h3>Restaurants Near ({latitude}, {longitude})</h3>

      {/* 로딩 중일 때 */}
      {loading && <p>Loading restaurants...</p>}

      {/* 에러 발생 시 */}
      {error && <p>Error: {error}</p>}

      {/* 구글 지도 로딩 */}
      <LoadScript googleMapsApiKey="AIzaSyBW5PKkaDcfAHlGWjW94ikbGg6l9rws5nU">
        <GoogleMap
          center={{ lat: latitude, lng: longitude }}
          zoom={14}
          mapContainerStyle={{ height: "400px", width: "100%" }}
        >
          {/* 카페 마커 렌더링 */}
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
              onClick={() => setSelectedRestaurant(restaurant)} // 마커 클릭 시 해당 카페 정보 표시
            />
          ))}

          {/* InfoWindow를 사용하여 마커 클릭 시 정보 표시 */}
          {selectedRestaurant && (
            <InfoWindow
              position={{
                lat: selectedRestaurant.latitude,
                lng: selectedRestaurant.longitude,
              }}
              onCloseClick={() => setSelectedRestaurant(null)}
            >
              <div>
                <h4>{selectedRestaurant.name}</h4>
                {/* 카페의 추가 정보가 필요하면 여기에 추가 */}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* 카페 리스트 */}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <strong>{restaurant.name}</strong> - Location: ({restaurant.latitude}, {restaurant.longitude})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurant;

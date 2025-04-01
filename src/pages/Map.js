import React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { artistData } from "../util";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import "./../styles/Map.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// 기본 위치 (루체른 콘서트홀)
const defaultCenter = {
  lat: 47.05048,
  lng: 8.3103,
};

const Map = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const artistId = searchParams.get("artist") || "1";
  const artist = artistData[artistId];

  const events = [
    { name: "Philharmonie, Germany", date: "Jan 31, 2025", lat: 52.5096, lng: 13.3762 },
    { name: "Wiener Konzerthaus, Austria", date: "Jan 23, 2025", lat: 48.2001, lng: 16.3775 },
    { name: "KKL Kultur- und Kongresszentrum Luzern, Switzerland", date: "Jan 16, 2025", lat: 47.05048, lng: 8.3103 },
  ];

  const handleEventClick = (eventName, lat, lng) => {
    console.log(`클릭한 이벤트: ${eventName}, 위치: (${lat}, ${lng})`); // 디버깅용 로그
    navigate(`/mapinfo/basic?event=${encodeURIComponent(eventName)}`);
  };

  // `/map` 경로에서만 Sidebar 표시
  const shouldShowSidebar = location.pathname === "/map";

  return (
    <div className="map-container">
      {/* 헤더 */}
      <Header title={artist.mapName} />

      {/* 지도와 사이드바 */}
      <div className="map-content">
        {/* Google Maps 적용 */}
        <div className="map-background">
          <LoadScript googleMapsApiKey="AIzaSyAEvELryy_YAdKvjzbf3bnGQ9IhlJ3xRaY">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={5}
            />
          </LoadScript>
        </div>

        {/* 조건부로 Sidebar 표시 */}
        {shouldShowSidebar && (
          <Sidebar
            date="2025년 1월 10일"
            events={events}
            onEventClick={(event) => handleEventClick(event.name, event.lat, event.lng)}
          />
        )}
      </div>
    </div>
  );
};

export default Map;

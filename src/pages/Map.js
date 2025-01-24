import React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { artistData } from "../util";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import "./../styles/Map.css";

const Map = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인

  const artistId = searchParams.get("artist") || "1"; // 기본값: 1
  const artist = artistData[artistId];

  const events = [
    { name: "Philharmonie, Germany", date: "Jan 31, 2025" },
    { name: "Wiener Konzerthaus, Austria", date: "Jan 23, 2025" },
    {
      name: "KKL Kultur- und Kongresszentrum Luzern, Switzerland",
      date: "Jan 16, 2025",
    },
  ];

  const handleEventClick = (eventName) => {
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
        {/* 지도 영역 */}
        <div
          className="map-background"
          style={{
            backgroundImage: `url(${artist.background})`,
          }}
        ></div>

        {/* 조건부로 Sidebar 표시 */}
        {shouldShowSidebar && (
          <Sidebar
            date="2025년 1월 10일"
            events={events}
            onEventClick={handleEventClick}
          />
        )}
      </div>
    </div>
  );
};

export default Map;

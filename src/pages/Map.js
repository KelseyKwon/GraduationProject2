import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { artistData } from "../util";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import "./../styles/Map.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// 전 세계 지도를 보기 위한 중심 좌표
const worldCenter = {
  lat: 20, // 적도 근처
  lng: 0,  // 본초자오선 근처
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

  const [userLocation, setUserLocation] = useState(null);

  // 사용자 위치 추적
  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
        },
        (error) => {
          console.error("사용자 위치 추적 실패:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleEventClick = (eventName, lat, lng) => {
    console.log(`클릭한 이벤트: ${eventName}, 위치: (${lat}, ${lng})`);
    navigate(`/mapinfo/basic?event=${encodeURIComponent(eventName)}`);
  };

  const shouldShowSidebar = location.pathname === "/map";

  // 이벤트 좌표 목록 (Polyline 용)
  const eventPath = events.map((event) => ({
    lat: event.lat,
    lng: event.lng,
  }));

  return (
    <div className="map-container">
      <Header title={artist.mapName} />

      <div className="map-content">
        <div className="map-background">
          <LoadScript googleMapsApiKey="AIzaSyAEvELryy_YAdKvjzbf3bnGQ9IhlJ3xRaY">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={worldCenter}
              zoom={2} // 전 세계 보기
            >
              {/* 사용자 위치 마커 (파란색) */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  label="You"
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}

              {/* 이벤트 마커 (빨간색) */}
              {events.map((event, index) => (
                <Marker
                  key={index}
                  position={{ lat: event.lat, lng: event.lng }}
                  label={{
                    text: `${index + 1}`,
                    color: "white",
                    fontWeight: "bold",
                  }}
                  title={event.name}
                  onClick={() => handleEventClick(event.name, event.lat, event.lng)}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                />
              ))}

              {/* 이벤트 연결 선 (Polyline) */}
              <Polyline
                path={eventPath}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 3,
                }}
              />
            </GoogleMap>
          </LoadScript>
        </div>

        {/* 사이드바 표시 */}
        {shouldShowSidebar && (
          <Sidebar
            date="2025년 1월 10일"
            events={events}
            onEventClick={(event) =>
              handleEventClick(event.name, event.lat, event.lng)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Map;

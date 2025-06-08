import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { artistData } from "../util";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import "./../styles/Map.css";

import dataLim from "../data/ArtistData_Lim.json";
import dataTrif from "../data/ArtistData_Daniil.json";
import dataLang from "../data/ArtistData_Lang.json";
import dataCho from "../data/ArtistData_Cho.json";
import dataYuja from "../data/ArtistData_Yuja.json";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const worldCenter = {
  lat: 20,
  lng: 0,
};

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split(".").filter(Boolean);
  return new Date(`${year}-${month}-${day}`);
};

const getArtistEvents = (id) => {
  switch (id) {
    case "1":
      return dataLim;
    case "2":
      return dataTrif;
    case "3":
      return dataLang;
    case "4":
      return dataCho;
    case "5":
      return dataYuja;
    default:
      return [];
  }
};

const Map = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const artistId = searchParams.get("artist") || "1";
  const artist = artistData[artistId];

  const [userLocation, setUserLocation] = useState(null);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일`;

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const shouldShowSidebar = location.pathname === "/map";

  const filteredEvents = getArtistEvents(artistId)
  .sort((a, b) => parseDate(a.date) - parseDate(b.date)); // 날짜 순 정렬

// Google Map 형식에 맞게 좌표 변환
const polylinePath = filteredEvents.map((e) => ({
  lat: e.coordinates.latitude,
  lng: e.coordinates.longitude,
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
            zoom={2}
            options={{
              mapTypeControl: false,    // 필요에 따라 지도 유형 컨트롤 끄기
              streetViewControl: false, // 필요에 따라 스트리트뷰 컨트롤 끄기
              fullscreenControl: false, // 필요에 따라 전체화면 컨트롤 끄기
              gestureHandling: "greedy", // 사용자의 제스처 인식 방식 (선택)
              restriction: {
                latLngBounds: {
                  north: 85,
                  south: -85,
                  west: -180,
                  east: 180,
                },
                strictBounds: true,  // 지도가 범위를 넘지 않도록 제한(필요 시 true)
              },
              noWrap: true, // 좌우 반복 막기
            }}
          >
              {userLocation && (
                <Marker
                  position={userLocation}
                  label="You"
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}
              {filteredEvents.map((event, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: event.coordinates.latitude,
                    lng: event.coordinates.longitude,
                  }}
                  label={{
                    text: `${index + 1}`,
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                  title={`${event.venue.city}, ${event.venue.name} - ${event.date}`}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                  onClick={() =>
                    navigate(
                      `/mapinfo/basic?artist=${artistId}&event=${encodeURIComponent(
                        `${event.venue.city}, ${event.venue.name}`
                      )}`
                    )
                  }
                />
              ))}
              <Polyline
                path={polylinePath}
                options={{
                  strokeColor: "#8A2BE2",
                  strokeOpacity: 0.7,
                  strokeWeight: 4,
                }}
              />
            </GoogleMap>
          </LoadScript>
        </div>

        {shouldShowSidebar && (
          <div className="map-sidebar">
            <Sidebar
              date={formattedDate}
              events={filteredEvents.map((e) => ({
                name: `${e.venue.city}, ${e.venue.name}`,
                date: e.date,
                coordinates: {
                  lat: e.coordinates.latitude,
                  lng: e.coordinates.longitude,
                },
              }))}
              onEventClick={(eventName) => {
                const event = filteredEvents.find(
                  (e) => `${e.venue.city}, ${e.venue.name}` === eventName
                );
                if (event) {
                  navigate(
                    `/mapinfo/basic?artist=${artistId}&event=${encodeURIComponent(
                      `${event.venue.city}, ${event.venue.name}`
                    )}`
                  );
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;

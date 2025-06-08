import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { artistData } from "../util";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import "./../styles/Map.css";

import dataLim from "../data/ArtistData_Lim.json";
import dataTrif from "../data/ArtistData_Daniil.json";
import dataLang from "../data/ArtistData_Lang.json";
import dataCho from "../data/ArtistData_Cho.json";
import dataYuja from "../data/ArtistData_Yuja.json";

const containerStyle = { width: "100%", height: "100vh" };
const worldCenter = { lat: 20, lng: 0 };
// 🔍 모든 줌 레벨 기본 18로 설정
const defaultZoom = 18;

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

// 추천 경로 기준: 최근접 이웃 근사 알고리즘
const computeRoute = (points) => {
  if (points.length < 2) return [];
  const remaining = [...points];
  const route = [remaining.shift()];
  while (remaining.length) {
    const last = route[route.length - 1];
    let nearestIdx = 0;
    let minDist = Infinity;
    remaining.forEach((p, i) => {
      const d = (p.lat - last.lat) ** 2 + (p.lng - last.lng) ** 2;
      if (d < minDist) {
        minDist = d;
        nearestIdx = i;
      }
    });
    route.push(remaining.splice(nearestIdx, 1)[0]);
  }
  return route;
};

const Map = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const artistId = searchParams.get("artist") || "1";
  const artist = artistData[artistId];

  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(id);
    }
  }, []);

  const sortedEvents = useMemo(
    () =>
      getArtistEvents(artistId).sort(
        (a, b) => parseDate(a.date) - parseDate(b.date)
      ),
    [artistId]
  );
  const allCoords = sortedEvents.map((e) => ({
    lat: e.coordinates.latitude,
    lng: e.coordinates.longitude,
  }));
  const routePath = useMemo(() => computeRoute(allCoords), [allCoords]);

  const [map, setMap] = useState(null);
  useEffect(() => {
    if (map) {
      const markers = sortedEvents.map(
        (e) =>
          new window.google.maps.Marker({
            position: {
              lat: e.coordinates.latitude,
              lng: e.coordinates.longitude,
            },
          })
      );
      new MarkerClusterer({ markers, map });
    }
  }, [map, sortedEvents]);

  const todayTime = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
  const shouldShowSidebar = location.pathname.startsWith("/map");

  const [infoPos, setInfoPos] = useState(null);
  const [infoEvent, setInfoEvent] = useState(null);

  const onMarkerClick = (event, e) => {
    const pos = { lat: e.coordinates.latitude, lng: e.coordinates.longitude };
    map.panTo(pos);
    map.setZoom(18); // 🔍 클릭 시 확대 레벨 18
    setInfoPos(pos);
    setInfoEvent(e);
  };

  return (
    <div className="map-container">
      <Header title={artist.mapName + " – 추천 경로"} />
      <div className="map-content">
        <div className="map-background">
          <LoadScript googleMapsApiKey="AIzaSyB7qMWWpc8N_fk7z1o45qYlAGY8uOlnCvM">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={worldCenter}
              zoom={defaultZoom}
              onLoad={(m) => setMap(m)}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                gestureHandling: "greedy",
                restriction: {
                  latLngBounds: {
                    north: 85,
                    south: -85,
                    west: -180,
                    east: 180,
                  },
                  strictBounds: true,
                },
                noWrap: true,
              }}
            >
              {routePath.length >= 2 && (
                <Polyline
                  path={routePath}
                  options={{
                    strokeColor: "#FF5722",
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                  }}
                />
              )}
              {sortedEvents.map((e, idx) => {
                const pos = {
                  lat: e.coordinates.latitude,
                  lng: e.coordinates.longitude,
                };
                return (
                  <Marker
                    key={idx}
                    position={pos}
                    onClick={(ev) => onMarkerClick(ev, e)}
                  />
                );
              })}

              {/* ⭐ 상세보기 버튼은 이 InfoWindow 내부, 마커 클릭 시 이 위치에 출력됩니다 ⭐ */}
              {infoPos && infoEvent && (
                <InfoWindow
                  position={infoPos}
                  onCloseClick={() => setInfoPos(null)}
                >
                  <div>
                    <div>
                      <strong>{infoEvent.venue.name}</strong>
                    </div>
                    <div>{infoEvent.date}</div>
                    <button
                      onClick={() =>
                        navigate(
                          `/mapinfo/basic?artist=${artistId}&event=${encodeURIComponent(
                            `${infoEvent.venue.city}, ${infoEvent.venue.name}`
                          )}`
                        )
                      }
                    >
                      상세보기
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {shouldShowSidebar && (
          <div className="map-sidebar">
            <Sidebar
              date={new Date(todayTime).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              events={sortedEvents.map((e) => ({
                name: `${e.venue.city}, ${e.venue.name}`,
                date: e.date,
              }))}
              onEventClick={(name) => {
                const ev = sortedEvents.find(
                  (ev) => `${ev.venue.city}, ${ev.venue.name}` === name
                );
                if (ev && map) {
                  const p = {
                    lat: ev.coordinates.latitude,
                    lng: ev.coordinates.longitude,
                  };
                  map.panTo(p);
                  map.setZoom(18); // 🔍 사이드바 클릭 시 확대 레벨 18
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

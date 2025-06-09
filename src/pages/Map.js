import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
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

// 맵 설정 상수
const containerStyle = { width: "100%", height: "100vh" };
const worldCenter = { lat: 20, lng: 0 };
const defaultZoom = 18;
const libraries = ["places"];

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
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);

  useEffect(() => {
    setShouldShowSidebar(location.pathname.startsWith("/map"));
  }, [location.pathname]);

  const [map, setMap] = useState(null);
  const [infoPos, setInfoPos] = useState(null);
  const [infoEvent, setInfoEvent] = useState(null);

  const sortedEvents = useMemo(
    () =>
      getArtistEvents(artistId).sort(
        (a, b) => parseDate(a.date) - parseDate(b.date)
      ),
    [artistId]
  );
  const routePath = useMemo(
    () =>
      computeRoute(
        sortedEvents.map((e) => ({
          lat: e.coordinates.latitude,
          lng: e.coordinates.longitude,
        }))
      ),
    [sortedEvents]
  );

  useEffect(() => {
    if (!map) return;
    const markers = sortedEvents.map((e) => {
      const marker = new window.google.maps.Marker({
        position: { lat: e.coordinates.latitude, lng: e.coordinates.longitude },
        map,
      });
      marker.addListener("click", () => {
        map.panTo(marker.getPosition());
        map.setZoom(defaultZoom);
        setInfoPos(marker.getPosition().toJSON());
        setInfoEvent(e);
      });
      return marker;
    });
    new MarkerClusterer({ markers, map });
    if (sortedEvents.length > 0) {
    const bounds = new window.google.maps.LatLngBounds();
    sortedEvents.forEach((e) => {
      bounds.extend({
        lat: e.coordinates.latitude,
        lng: e.coordinates.longitude,
      });
    });
    map.fitBounds(bounds);
  }
    return () => markers.forEach((m) => m.setMap(null));
  }, [map, sortedEvents]);

  const todayTime = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
//  const shouldShowSidebar = location.pathname.startsWith("/map");

  return (
    <div className="map-container">
      <Header title={`${artist.mapName} – 추천 경로`} />
      <div className="map-content">
        <div className="map-background">
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={worldCenter}
              zoom={defaultZoom}
              onLoad={(map) => {
                setMap(map);
              }}
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
              {routePath.length > 1 && (
                <Polyline
                  path={routePath}
                  options={{ strokeOpacity: 0.8, strokeWeight: 5 }}
                />
              )}
              {infoPos && infoEvent && (
                <InfoWindow
                  position={infoPos}
                  onCloseClick={() => setInfoPos(null)}
                >
                  <div>
                    <strong>{infoEvent.venue.name}</strong>
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
                  map.panTo({
                    lat: ev.coordinates.latitude,
                    lng: ev.coordinates.longitude,
                  });
                  map.setZoom(defaultZoom);
                }
             }}
            />
          </div>
      </div>
    </div>
  );
};

export default Map;

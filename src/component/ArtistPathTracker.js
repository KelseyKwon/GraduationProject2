// src/pages/Map.js
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

const worldCenter = { lat: 20, lng: 0 };

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

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일`;

  const [userLocation, setUserLocation] = useState(null);

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

  const filteredEvents = getArtistEvents(artistId).filter((event) => {
    const date = parseDate(event.date);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth()
    );
  });

  const groupedEvents = Object.values(
    filteredEvents.reduce((acc, event) => {
      const key = `${event.venue.city}, ${event.venue.name}`;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          coordinates: event.coordinates,
          dates: [],
        };
      }
      acc[key].dates.push(event.date);
      return acc;
    }, {})
  ).map((e) => ({
    ...e,
    dates: e.dates.sort(),
    dateRange:
      e.dates.length > 1
        ? `${e.dates[0]} - ${e.dates[e.dates.length - 1]}`
        : e.dates[0],
  }));

  const polylinePath = groupedEvents.map((e) => e.coordinates);

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
              {groupedEvents.map((event, index) => (
                <Marker
                  key={index}
                  position={event.coordinates}
                  label={{
                    text: `${index + 1}`,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                  title={`${event.name} - ${event.dateRange}`}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                  onClick={() =>
                    navigate(
                      `/mapinfo/basic?event=${encodeURIComponent(event.name)}`
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
          <Sidebar
            date={formattedDate}
            events={groupedEvents.map((e) => ({
              name: e.name,
              date: e.dateRange,
              coordinates: e.coordinates,
            }))}
            onEventClick={(eventName) => {
              const e = groupedEvents.find((e) => e.name === eventName);
              if (e) {
                navigate(`/mapinfo/basic?event=${encodeURIComponent(e.name)}`);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Map;

import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Header from "../../component/Header";
import Sidebar2 from "../../component/Sidebar2";
import "../../styles/Mapinfo.css";
import concertImage from "../../img/concert.png";
import ConcertInfo from "./ConcertInfo";
import NearInfo from "./NearInfo";
import AccompanyInfo from "./AccompanyInfo";
import ArtistPathTracker from "../../component/ArtistPathTracker";


import { useSearchParams } from "react-router-dom";
import dataLim from "../../data/ArtistData_Lim.json";
import dataTrif from "../../data/ArtistData_Daniil.json";
import dataLang from "../../data/ArtistData_Lang.json";
import dataCho from "../../data/ArtistData_Cho.json";
import dataYuja from "../../data/ArtistData_Yuja.json";

const getArtistDataById = (id) => {
  switch (id) {
    case "1": return dataLim;
    case "2": return dataTrif;
    case "3": return dataLang;
    case "4": return dataCho;
    case "5": return dataYuja;
    default: return [];
  }
};

const artistNames = {
  "1": "임윤찬",
  "2": "다니엘 트리포",
  "3": "랑랑",
  "4": "조성진",
  "5": "유자왕",
};

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split(".").filter(Boolean);
  return new Date(`${year}-${month}-${day}`);
};

const Mapinfo = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 쿼리 파라미터에서 artist와 event 이름 추출
  const artistId = searchParams.get("artist") || "1";
  const eventQueryRaw = searchParams.get("event") || "";
  const eventQuery = decodeURIComponent(eventQueryRaw).toLowerCase().trim();
  const artistName = artistNames[artistId] || "아티스트";

  console.log("Mapinfo artistId:", artistId);

  // 선택한 아티스트 데이터
  const artistData = useMemo(() => getArtistDataById(artistId), [artistId]);

  // 날짜순 정렬
  const filteredEvents = useMemo(() => {
    return artistData.slice().sort((a, b) => parseDate(a.date) - parseDate(b.date));
  }, [artistData]);

  // eventQuery와 매칭되는 이벤트 찾기
  const eventDetails = useMemo(() => {
    return filteredEvents.find((e) => {
      const eventStr = `${e.venue.city}, ${e.venue.name}`.toLowerCase().trim();
      return eventStr === eventQuery;
    });
  }, [filteredEvents, eventQuery]);

  // 지도 중심 좌표: 매칭된 이벤트가 있으면 그 좌표, 없으면 기본값
  const center = eventDetails
    ? {
        lat: eventDetails.coordinates.latitude,
        lng: eventDetails.coordinates.longitude,
      }
    : { lat: 47.050169, lng: 8.309307 }; // 기본 좌표

  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  const renderContent = () => {
    // 기존 라우팅 유지하면서 쿼리파라미터 있는 basic 경로에선 상세공연정보 표시
    if (location.pathname.includes("basic")) {
      if (!eventDetails) {
        return (
          <div className="info-card">
            <h3>상세 공연 정보를 찾을 수 없습니다.</h3>
          </div>
        );
      }
      return (
        <div className="info-card">
          <img
            src={concertImage}
            alt={`${eventDetails.venue.name} 공연장 이미지`}
            className="info-image"
          />
          <div className="info-details">
            <h3 className="info-title">{eventDetails.venue.name}</h3>
            <p className="info-description">
              {eventDetails.details ? eventDetails.details : ""}
            </p>
            <div className="info-tags">
            <span className="tag">{eventDetails.venue.country}</span>
              <span className="tag">{eventDetails.venue.city}</span>
              <span className="tag">공연 날짜: {eventDetails.date}</span>
              {/* 필요하면 인원 등 기타 태그 추가 가능 */}
            </div>
          </div>
        </div>
      );
    } else if (location.pathname.includes("concert")) {
      return <ConcertInfo />;
    } else if (location.pathname.includes("near")) {
      return <NearInfo concert={eventDetails} artistId={artistId}/>;
    } else if (location.pathname.includes("accompany")) {
      return <AccompanyInfo />;
    }
    return null;
  };

  return (
    <div className="mapinfo-wrapper">
      {/* Header */}
      <Header title={`${artistName} 맵`} />

      {/* Sidebar + Content */}
      <div className="sidebar2-wrapper">
        {/* Sidebar2 탭 메뉴 */}
        <Sidebar2 />

        {/* 구글맵 */}
        <LoadScript googleMapsApiKey="AIzaSyAEvELryy_YAdKvjzbf3bnGQ9IhlJ3xRaY">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
          >
            {eventDetails && (
              <Marker
                position={{
                  lat: eventDetails.coordinates.latitude,
                  lng: eventDetails.coordinates.longitude,
                }}
              />
            )}

            <ArtistPathTracker />
          </GoogleMap>
        </LoadScript>

        <div className="info-card-container">{renderContent()}</div>
      </div>
    </div>
  );
  // const location = useLocation();
  // const mapContainerStyle = {
  //   width: "100%",
  //   height: "100vh", // This will make the map cover the entire screen
  // };

  // const center = {
  //   lat: 47.050169, // Use the latitude of the location you want to show
  //   lng: 8.309307, // Use the longitude of the location you want to show
  // };

  // const renderContent = () => {
  //   if (location.pathname.includes("basic")) {
  //     return (
  //       <div className="info-card">
  //         <img
  //           src={concertImage}
  //           alt="루체른 문화 컨벤션 센터"
  //           className="info-image"
  //         />
  //         <div className="info-details">
  //           <h3 className="info-title">루체른 문화 컨벤션 센터</h3>
  //           <p className="info-description">관련 정보들 나열.</p>
  //           <div className="info-tags">
  //             <span className="tag">스위스</span>
  //             <span className="tag">콘서트홀</span>
  //             <span className="tag">리사이틀홀</span>
  //             <span className="tag">1800명</span>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   } else if (location.pathname.includes("concert")) {
  //     return <ConcertInfo />;
  //   } else if (location.pathname.includes("near")) {
  //     return <NearInfo />;
  //   } else if (location.pathname.includes("accompany")) {
  //     return <AccompanyInfo />;
  //   }
  //   return null;
  // };

  // return (
  //   <div className="mapinfo-wrapper">
  //     {/* Header */}
  //     <Header title="임윤찬 맵" />

  //     {/* Sidebar + Content */}
  //     <div className="sidebar2-wrapper">
  //       {/* Sidebar2 tab menu */}
  //       <Sidebar2 />

  //       {/* Google Map as background */}
  //       <LoadScript googleMapsApiKey="AIzaSyAEvELryy_YAdKvjzbf3bnGQ9IhlJ3xRaY">
  //         <GoogleMap
  //           mapContainerStyle={{ width: "100%", height: "100%" }}
  //           center={center}
  //           zoom={15}
  //         >
  //           <Marker position={center} />

  //           <ArtistPathTracker />
  //         </GoogleMap>
  //       </LoadScript>

  //       {/* Info Card */}
  //       <div className="info-card-container">{renderContent()}</div>
  //     </div>
  //   </div>
  // );
};

export default Mapinfo;

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../component/Header";
import Sidebar2 from "../../component/Sidebar2";
import "../../styles/Mapinfo.css";
import backgroundImage from "../../img/mapinfobackgroud.png";
import concertImage from "../../img/concert.png";
import ConcertInfo from "./ConcertInfo";
import NearInfo from "./NearInfo";
import AccompanyInfo from "./AccompanyInfo";

const Mapinfo = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname.includes("basic")) {
      return (
        <div className="info-card">
          <img
            src={concertImage}
            alt="루체른 문화 컨벤션 센터"
            className="info-image"
          />
          <div className="info-details">
            <h3 className="info-title">루체른 문화 컨벤션 센터</h3>
            <p className="info-description">관련 정보들 나열.</p>
            <div className="info-tags">
              <span className="tag">스위스</span>
              <span className="tag">콘서트홀</span>
              <span className="tag">리사이틀홀</span>
              <span className="tag">1800명</span>
            </div>
          </div>
        </div>
      );
    } else if (location.pathname.includes("concert")) {
      return <ConcertInfo />;
    } else if (location.pathname.includes("near")) {
      return <NearInfo />;
    } else if (location.pathname.includes("accompany")) {
      return <AccompanyInfo />;
    }
    return null;
  };

  return (
    <div className="mapinfo-wrapper">
      {/* 헤더 */}
      <Header title="임윤찬 맵" />

      {/* 사이드바 + 콘텐츠 */}
      <div className="sidebar2-wrapper">
        {/* Sidebar2 탭 메뉴 */}
        <Sidebar2 />

        {/* Info Card */}
        <div className="info-card-container">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Mapinfo;

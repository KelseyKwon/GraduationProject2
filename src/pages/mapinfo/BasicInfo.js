import React from "react";
import concertImg from "../../img/concert.png";
import "../../styles/Mapinfo.css";

const BasicInfo = () => {
  return (
    <div className="basic-info">
      <img src={concertImg} alt="Concert" className="basic-info-image" />
      <div className="basic-info-content">
        <h1 className="basic-info-title">루체른 문화 컨벤션 센터</h1>
        <p className="basic-info-description">관련 정보들 나열.</p>
        <div className="basic-info-tags">
          <span className="tag">스위스</span>
          <span className="tag">콘서트홀</span>
          <span className="tag">리사이틀홀</span>
          <span className="tag">1800명</span>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

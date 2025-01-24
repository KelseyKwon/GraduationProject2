import React from "react";
import "../../styles/ConcertInfo.css";

const concerts = [
  {
    date: "2025년 1월 15일",
    info: "루체른 심포니 오케스트라",
    link: "https://example.com",
  },
  {
    date: "2025년 1월 18일",
    info: "빈 필하모닉 오케스트라",
    link: "https://example.com",
  },
  {
    date: "2025년 1월 22일",
    info: "베를린 필하모닉 오케스트라",
    link: "https://example.com",
  },
  {
    date: "2025년 1월 27일",
    info: "런던 심포니 오케스트라",
    link: "https://example.com",
  },
  {
    date: "2025년 1월 30일",
    info: "뉴욕 필하모닉 오케스트라",
    link: "https://example.com",
  },
];

const ConcertInfo = () => {
  return (
    <div className="concert-info-container">
      {concerts.map((concert, index) => (
        <div className="concert-item" key={index}>
          <div className="concert-thumbnail" />
          <div className="concert-details">
            <div className="concert-date">{concert.date}</div>
            <div className="concert-name">{concert.info}</div>
            <a
              className="concert-link"
              href={concert.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              예매하러 가기
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConcertInfo;

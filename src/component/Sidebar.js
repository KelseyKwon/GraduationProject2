import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../styles/Sidebar.css";
import { CalendarButton } from "./Button";

const Sidebar = ({ date, onEventClick }) => {
  const events = [
    {
      name: "Philharmonie, Germany",
      date: "Jan 31, 2025",
    },
    {
      name: "Wiener Konzerthaus, Austria",
      date: "Jan 23, 2025",
    },
    {
      name: "KKL Kultur- und Kongresszentrum Luzern, Switzerland",
      date: "Jan 16, 2025",
    },
  ];

  const initialDate = isNaN(new Date(date).getTime())
    ? new Date()
    : new Date(date);
  const [selectedDate, setSelectedDate] = useState(initialDate); // 기본 날짜 설정
  const [showDatePicker, setShowDatePicker] = useState(false); // 캘린더 표시 여부

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setShowDatePicker(false); // 선택 후 드롭다운 닫기
  };

  return (
    <div className="sidebar-container">
      {/* 캘린더 아이콘 및 제목 */}
      <div className="sidebar-header">
        <h3 className="sidebar-title">
          {selectedDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <div className="calendar-wrapper">
          <CalendarButton onClick={() => setShowDatePicker(!showDatePicker)} />
          {showDatePicker && (
            <div className="datepicker-overlay">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                onClickOutside={() => setShowDatePicker(false)} // 드롭다운 외부 클릭 시 닫힘
                open // 팝업 강제 열림
                popperPlacement="bottom-end" // 드롭다운 위치 조정
                popperClassName="datepicker-popper" // 스타일 클래스 추가
              />
            </div>
          )}
        </div>
      </div>

      {/* 이벤트 리스트 */}
      <div className="sidebar-events">
        {events.map((event, index) => (
          <div
            className="event-item"
            key={index}
            onClick={() => onEventClick(event.name)}
          >
            {/* 라인 연결 */}
            {index > 0 && <div className="event-line"></div>}
            {/* 이벤트 아이콘 */}
            <div className="event-icon"></div>
            {/* 이벤트 정보 */}
            <div className="event-details">
              <div className="event-name">{event.name}</div>
              <div className="event-date">‐ {event.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

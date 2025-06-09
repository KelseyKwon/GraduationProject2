import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useSearchParams } from "react-router-dom"; // 🔥 navigate와 searchParams 추가
import "./../styles/Sidebar.css";
import { CalendarButton } from "./Button";

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split(".").filter(Boolean);
  return new Date(`${year}-${month}-${day}`);
};

const Sidebar = ({ date, events, onEventClick, onDetailClick }) => {
  const navigate = useNavigate(); // 🔥 navigate 훅 사용
  const [searchParams] = useSearchParams(); // 🔥 query 파라미터 훅
  const artistId = searchParams.get("artist") || "1"; // 🔥 artistId 추출

  const initialDate = isNaN(new Date(date).getTime())
    ? new Date()
    : new Date(date);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [useFilter, setUseFilter] = useState(false);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const filteredEvents = useFilter
    ? events.filter((event) => {
        const d = parseDate(event.date);
        return (
          d.getFullYear() === selectedDate.getFullYear() &&
          d.getMonth() === selectedDate.getMonth()
        );
      })
    : events;

  return (
    <div className="sidebar-container">
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
                onClickOutside={() => setShowDatePicker(false)}
                open
                popperPlacement="bottom-end"
                popperClassName="datepicker-popper"
              />
            </div>
          )}
        </div>
        <label
          style={{ marginLeft: "1rem", fontSize: "0.9rem", cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={useFilter}
            onChange={() => setUseFilter(!useFilter)}
            style={{ marginRight: "0.3rem" }}
          />
          해당 달만 보기
        </label>
      </div>

      <div className="sidebar-events">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div className="event-item" key={index}>
              <div
                className="event-info"
                onClick={() => onEventClick(event.name)}
              >
                {index > 0 && <div className="event-line"></div>}
                <div className="event-icon"></div>
                <div className="event-details">
                  <div className="event-name">{event.name}</div>
                  <div className="event-date">‐ {event.date}</div>
                </div>
              </div>
              <button
                className="detail-button"
                onClick={() =>
                  navigate(
                    `/mapinfo/basic?artist=${artistId}&event=${encodeURIComponent(
                      event.name
                    )}`
                  )
                }
              >
                상세보기
              </button>
            </div>
          ))
        ) : (
          <div className="no-events">해당하는 공연이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

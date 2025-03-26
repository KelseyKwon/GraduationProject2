import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar2.css";

const Sidebar2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const event = searchParams.get("event"); // 현재 URL의 event 값 가져오기

  const tabs = [
    { id: "basic", label: "기본 정보", path: "/mapinfo/basic" },
    { id: "concert", label: "공연 정보", path: "/mapinfo/concert" },
    { id: "near", label: "주변 정보", path: "/mapinfo/near" },
    { id: "accompany", label: "동행 구하기", path: "/mapinfo/accompany" },
  ];

  return (
    <div className="sidebar2-container">
      {/* 탭 메뉴 */}
      <div className="sidebar2-tabs">
        {tabs.map((tab) => {
          // 현재 URL에 event 값이 있다면 새로운 경로에 추가
          const newPath = event
            ? `${tab.path}?event=${encodeURIComponent(event)}`
            : tab.path;

          return (
            <button
              key={tab.id}
              className={`sidebar2-tab ${
                location.pathname.includes(tab.id) ? "active" : ""
              }`}
              onClick={() => navigate(newPath)} // event 값 유지하면서 이동
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar2;

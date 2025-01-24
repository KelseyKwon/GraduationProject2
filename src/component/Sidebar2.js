import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar2.css";

const tabs = [
  { id: "basic", label: "기본 정보", path: "/mapinfo/basic" },
  { id: "concert", label: "공연 정보", path: "/mapinfo/concert" },
  { id: "near", label: "주변 정보", path: "/mapinfo/near" },
  { id: "accompany", label: "동행 구하기", path: "/mapinfo/accompany" },
];

const Sidebar2 = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <div className="sidebar2-container">
      {/* 탭 메뉴 */}
      <div className="sidebar2-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar2-tab ${
              currentPath.includes(tab.id) ? "active" : ""
            }`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* 추가적인 사이드바 내용이 여기에 들어갈 수 있음 */}
      <div className="sidebar2-content">
        {" "}
        {/* 비어 있는 부분은 필요시 채울 수 있음 */}
      </div>
    </div>
  );
};

export default Sidebar2;

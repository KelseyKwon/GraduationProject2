import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuButton } from "./Button";
import "./../styles/Header.css";

const Header = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 URL에서 event 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const eventParam = searchParams.get("event");

  // 메뉴 토글 함수 추가 (오류 해결)
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // 페이지 이동 함수 (event 파라미터 유지)
  const handleNavigation = (path) => {
    const newPath = eventParam
      ? `${path}?event=${encodeURIComponent(eventParam)}`
      : path;
    navigate(newPath);
    setMenuOpen(false); // 이동 후 드롭다운 닫기
  };

  return (
    <div className="header-container">
      {/* 메뉴 버튼 */}
      <MenuButton onClick={toggleMenu} />

      {/* 중앙 타이틀 */}
      <div className="header-title">{title}</div>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <>
          <div className="overlay" onClick={toggleMenu}></div>
          <div className="dropdown-menu">
            <div onClick={() => handleNavigation("/mapinfo/basic")}>
              기본 정보
            </div>
            <div onClick={() => handleNavigation("/mapinfo/near")}>
              주변 정보
            </div>
            <div onClick={() => handleNavigation("/mapinfo/concert")}>
              공연 정보
            </div>
            <div onClick={() => handleNavigation("/mapinfo/accompany")}>
              동행 구하기
            </div>
            <div onClick={() => navigate("/")}>캐릭터 변경</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;

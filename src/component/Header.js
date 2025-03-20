import React, { useState } from "react";
import { MenuButton } from "./Button";
import "./../styles/Header.css";

const Header = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
            <div>기본 정보</div>
            <div>주변 정보</div>
            <div>공연 정보</div>
            <div>동행 구하기</div>
            <div>캐릭터 변경</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;

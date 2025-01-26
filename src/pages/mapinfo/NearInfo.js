// src/pages/mapinfo/NearInfo.js
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const NearInfo = () => {
  return (
    <div>
      <h3>Near Info Page</h3>
      {/* 네비게이션 메뉴 */}
      <nav>
        <ul>
          <li>
            <NavLink
              to="restaurant"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "blue" : "black",
              })}
            >
              Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink
              to="cafe"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "blue" : "black",
              })}
            >
              Cafes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="popular"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "blue" : "black",
              })}
            >
              Popular Attractions
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* 하위 컴포넌트를 렌더링 */}
      <Outlet />
    </div>
  );
};

export default NearInfo;

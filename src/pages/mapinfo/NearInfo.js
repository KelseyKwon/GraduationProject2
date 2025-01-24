// src/pages/mapinfo/NearInfo.js
import React from "react";
import { Outlet } from "react-router-dom";

const NearInfo = () => {
  return (
    <div>
      <h3>Near Info Page</h3>
      <Outlet />
    </div>
  );
};

export default NearInfo;

// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Select from "./pages/Select";
import Map from "./pages/Map";
import Mapinfo from "./pages/mapinfo/Mapinfo";
import BasicInfoWrapper from "./pages/mapinfo/BasicInfoWrapper";
import ConcertInfo from "./pages/mapinfo/ConcertInfo";
import NearInfo from "./pages/mapinfo/NearInfo";
import Cafe from "./pages/mapinfo/near/Cafe";
import Restaurant from "./pages/mapinfo/near/Restaurant";
import Popular from "./pages/mapinfo/near/Popular";
import AccompanyInfo from "./pages/mapinfo/AccompanyInfo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Select />} />
      <Route path="/map" element={<Map />} />
      <Route path="/mapinfo" element={<Mapinfo />}>
        {/* /mapinfo/basic/:id 라우트 */}
        <Route path="basic" element={<BasicInfoWrapper />} />

        <Route path="concert" element={<ConcertInfo />} />
        <Route path="near" element={<NearInfo />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="cafe" element={<Cafe />} />
        <Route path="popular" element={<Popular />} />
        <Route path="accompany" element={<AccompanyInfo />} />
      </Route>
    </Routes>
  );
}

export default App;

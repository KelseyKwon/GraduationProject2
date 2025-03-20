// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Select from "./pages/Select";
import Map from "./pages/Map";
import Mapinfo from "./pages/mapinfo/Mapinfo";
import BasicInfo from "./pages/mapinfo/BasicInfo";
import ConcertInfo from "./pages/mapinfo/ConcertInfo";
import NearInfo from "./pages/mapinfo/NearInfo";
import AccompanyInfo from "./pages/mapinfo/AccompanyInfo";
import Restaurant from "./pages/mapinfo/near/Restaurant";
import Cafe from "./pages/mapinfo/near/Cafe";
import Popular from "./pages/mapinfo/near/Popular";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Select />} />
      <Route path="/map" element={<Map />} />
      <Route path="/mapinfo" element={<Mapinfo />}>
        <Route path="basic" element={<BasicInfo />} />
        <Route path="concert" element={<ConcertInfo />} />
        <Route path="near" element={<NearInfo />}>
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="cafe" element={<Cafe />} />
          <Route path="popular" element={<Popular />} />
        </Route>
        <Route path="accompany" element={<AccompanyInfo />} />
      </Route>
    </Routes>
  );
}

export default App;

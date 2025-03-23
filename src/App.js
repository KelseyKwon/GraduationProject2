import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Select from "./pages/Select";
import Map from "./pages/Map";
import Mapinfo from "./pages/mapinfo/Mapinfo";
import BasicInfo from "./pages/mapinfo/BasicInfo";
import ConcertInfo from "./pages/mapinfo/ConcertInfo";
import NearInfo from "./pages/mapinfo/NearInfo";  // 수정: NearInfo가 JSON 데이터를 처리하도록 함
import Cafe from "./pages/mapinfo/near/Cafe"
import Restaurant from "./pages/mapinfo/near/Restaurant"
import Popular from "./pages/mapinfo/near/Popular"
import AccompanyInfo from "./pages/mapinfo/AccompanyInfo";
import data from "./data/ArtistData_Cho.json";  // JSON 파일 가져오기

function App() {
  return (
      <Routes>
        <Route path="/" element={<Select />} />
        <Route path="/map" element={<Map />} />
        <Route path="/mapinfo" element={<Mapinfo />}>
          <Route path="basic" element={<BasicInfo />} />
          <Route path="concert" element={<ConcertInfo />} />
          {/* NearInfo에 JSON 데이터를 넘겨줌 */}
          <Route path="near" element={<NearInfo data={data} />} />
            <Route path="restaurant" element={<Restaurant />} />
            <Route path="cafe" element={<Cafe />} />
            <Route path="popular" element={<Popular />} />
          <Route path="accompany" element={<AccompanyInfo />} />
        </Route>
      </Routes>
  );
}

export default App;

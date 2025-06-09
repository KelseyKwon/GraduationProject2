import React from "react";
import { useSearchParams } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import data from "../../data/ArtistData_Cho.json";

export default function BasicInfoWrapper() {
  const [searchParams] = useSearchParams();
  const artistIdx = parseInt(searchParams.get("artist"), 10);
  const eventParam = searchParams.get("event") || "";
  const eventData = data[artistIdx];
const venueName = eventData.venue.name;     // 정확한 이름
const country   = eventData.venue.country;

  if (!venueName) {
    return <p>잘못된 장소 이름입니다.</p>;
  }

  return <BasicInfo venueName={venueName} country={country} />;
}

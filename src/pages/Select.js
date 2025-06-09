import React from "react";
import { useNavigate } from "react-router-dom";
import { getArtistImgById } from "../util";
import "./../styles/Select.css";

const Select = () => {
  const navigate = useNavigate();
  const artists = [
    { id: 1, name: "임윤찬", enName: "Yun Chan Lim" },
    { id: 2, name: "다닐 트리포노프", enName: "Daniil Trifonov" },
    { id: 3, name: "랑랑", enName: "Lang Lang" },
    { id: 4, name: "조성진", enName: "Sung Jin Cho" },
    { id: 5, name: "유자 왕", enName: "Yuja Wang" },
  ];

  const handleArtistSelect = (id) => {
    navigate(`/map?artist=${id}`); // 선택한 아티스트로 이동
  };

  return (
    <div className="select-container">
      <h1 className="select-title">아티스트를 선택해 주세요</h1>
      <p className="select-description">
        선택한 아티스트를 기반으로 맞춤 지도가 형성됩니다.
      </p>
      {/* 첫 줄: 3명 */}
      <div className="artist-grid">
        {artists.slice(0, 3).map((artist) => (
          <div
            key={artist.id}
            className="artist-card"
            onClick={() => handleArtistSelect(artist.id)}
          >
            <img
              className="artist-image"
              src={getArtistImgById(artist.id)}
              alt={artist.name}
            />
            <div className="artist-name">
              {artist.name}
              <br />
              {artist.enName}
            </div>
          </div>
        ))}
      </div>
      {/* 둘째 줄: 2명 */}
      <div className="artist-grid">
        {artists.slice(3).map((artist) => (
          <div
            key={artist.id}
            className="artist-card"
            onClick={() => handleArtistSelect(artist.id)}
          >
            <img
              className="artist-image"
              src={getArtistImgById(artist.id)}
              alt={artist.name}
            />
            <div className="artist-name">
              {artist.name}
              <br />
              {artist.enName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;

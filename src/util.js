import lim from "./img/lim.png";
import daniil from "./img/daniil.png";
import lang from "./img/langlang.png";
import cho from "./img/cho.png";
import yuja from "./img/yuja.png";
import mapBackground from "./img/map.png";

export const getArtistImgById = (artistId) => {
  const targetArtistId = String(artistId);
  switch (targetArtistId) {
    case "1":
      return lim;
    case "2":
      return daniil;
    case "3":
      return lang;
    case "4":
      return cho;
    case "5":
      return yuja;
  }
};

// 아티스트 데이터
export const artistData = {
  1: { name: "임윤찬", mapName: "임윤찬 맵", background: mapBackground },
  2: {
    name: "다닐 트리포노프",
    mapName: "다닐 트리포노프 맵",
    background: mapBackground,
  },
  3: { name: "랑랑", mapName: "랑랑 맵", background: mapBackground },
  4: { name: "조성진", mapName: "조성진 맵", background: mapBackground },
  5: { name: "유자 왕", mapName: "유자 왕 맵", background: mapBackground },
};

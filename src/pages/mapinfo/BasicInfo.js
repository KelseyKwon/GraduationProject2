import React, { useReducer, useEffect } from "react";
import concertImg from "../../img/concert.png";
import "../../styles/Mapinfo.css";
import "../../styles/BasicInfo.css";

const initialState = {
  loading: true,
  error: null,
  summary: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const fetchSummary = async (venueName) => {
  const res = await fetch("/api/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeName: venueName }),
  });
  const { summary } = await res.json();
  return summary;
};

const BasicInfo = ({ venueName }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadSummary = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const summary = await fetchSummary(venueName);
        dispatch({ type: "FETCH_SUCCESS", payload: summary });
      } catch (err) {
        console.error("리뷰 요약 생성 중 오류:", err);
        dispatch({
          type: "FETCH_FAILURE",
          payload: "리뷰 요약을 불러오는 중 오류가 발생했습니다.",
        });
      }
    };
    loadSummary();
  }, [venueName]);

  const { loading, error, summary } = state;

  return (
    <div className="basic-info">
      <img src={concertImg} alt="Concert" className="basic-info-image" />
      <div className="basic-info-content">
        <h1 className="basic-info-title">{venueName}</h1>
        <p className="basic-info-description">관련 정보들 나열.</p>
        <div className="basic-info-tags">
          <span className="tag">스위스</span>
          <span className="tag">콘서트홀</span>
          <span className="tag">리사이틀홀</span>
          <span className="tag">1800명</span>
        </div>
        {loading && (
          <div className="basic-info-loading">리뷰를 불러오는 중...</div>
        )}
        {error && <div className="basic-info-error">{error}</div>}
        {!loading && !error && (
          <div className="basic-info-review-summary">
            <strong>리뷰 요약:</strong> {summary}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;

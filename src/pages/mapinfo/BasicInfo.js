import React, { useState, useEffect } from "react";
import concertImg from "../../img/concert.png";
import "../../styles/Mapinfo.css";

// GPT API 직접 호출
const summarizeReviews = async (reviews) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const reviewTexts = reviews
    .map((r) => `- (${r.rating}) ${r.text}`)
    .join("\n");
  const prompt = `다음 공연장 리뷰를 참고해 평균 평점을 계산하고, 주요 키워드 세 가지를 요약하며, 마지막에 한 문장으로 총평을 작성하세요.\n${reviewTexts}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
};

// Google Places API로 리뷰 가져오기
const fetchReviews = async (placeName) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const findRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      placeName
    )}&inputtype=textquery&fields=place_id&key=${apiKey}`
  );
  const findData = await findRes.json();
  if (!findData.candidates?.length) return [];
  const placeId = findData.candidates[0].place_id;
  const detailsRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,reviews&key=${apiKey}`
  );
  const detailsData = await detailsRes.json();
  return (
    detailsData.result?.reviews
      ?.slice(0, 5)
      .map((r) => ({ text: r.text, rating: r.rating })) || []
  );
};

const BasicInfo = ({ venueName }) => {
  const [reviewSummary, setReviewSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const reviews = await fetchReviews(venueName);
        if (!reviews.length) {
          setReviewSummary("리뷰가 없습니다.");
        } else {
          const summary = await summarizeReviews(reviews);
          setReviewSummary(summary);
        }
      } catch (err) {
        console.error("리뷰 요약 생성 중 오류:", err);
        setError("리뷰 요약을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, [venueName]);

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
        {/* 로딩/오류/요약 표시 */}
        {loading && (
          <div className="basic-info-loading">리뷰를 불러오는 중...</div>
        )}
        {error && <div className="basic-info-error">{error}</div>}
        {!loading && !error && (
          <div className="basic-info-review-summary">
            <strong>리뷰 요약:</strong> {reviewSummary}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;

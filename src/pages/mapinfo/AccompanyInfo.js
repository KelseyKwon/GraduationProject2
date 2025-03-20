import React from "react";
import "../../styles/AccompanyInfo.css";

const posts = [
  {
    id: 1,
    title: "루체른 콘서트 동행 구합니다.",
    date: "2025-01-15",
    author: "사용자1",
  },
  {
    id: 2,
    title: "빈 필하모닉 리허설 같이 보실 분",
    date: "2025-01-20",
    author: "사용자2",
  },
  {
    id: 3,
    title: "베를린에서 함께 여행하실 분?",
    date: "2025-01-25",
    author: "사용자3",
  },
];

const AccompanyInfo = () => {
  return (
    <div className="accompany-info-container">
      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="search-input"
        />
        <button className="search-button">
          <img
            src="https://via.placeholder.com/21x21"
            alt="검색 아이콘"
            className="search-icon"
          />
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <div className="post-title">{post.title}</div>
            <div className="post-meta">
              <span className="post-date">{post.date}</span>
              <span className="post-author">{post.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccompanyInfo;

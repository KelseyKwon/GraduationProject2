import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import "../../styles/AccompanyInfo.css";

const posts = [
  {
    id: 1,
    title: "루체른 콘서트 동행 구합니다.",
    date: "2025-01-15",
    author: "사용자1",
    content: "루체른에서 콘서트를 함께 보실 분을 구합니다!",
  },
  {
    id: 2,
    title: "빈 필하모닉 리허설 같이 보실 분",
    date: "2025-01-20",
    author: "사용자2",
    content: "빈 필하모닉 오케스트라 리허설을 같이 보실 분 구합니다!",
  },
  {
    id: 3,
    title: "베를린에서 함께 여행하실 분?",
    date: "2025-01-25",
    author: "사용자3",
    content: "베를린에서 음악 여행을 함께 떠나실 분을 찾습니다!",
  },
  {
    id: 4,
    title: "베를린 필하모닉 공연 동행 구합니다.",
    date: "2025-02-01",
    author: "사용자4",
    content: "베를린 필하모닉 공연을 함께 보실 분 구합니다.",
  },
  {
    id: 5,
    title: "런던 심포니와 함께 공연 관람하실 분!",
    date: "2025-02-10",
    author: "사용자5",
    content: "런던 심포니 공연을 같이 보실 분을 찾습니다!",
  },
];

const AccompanyInfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // 게시글 클릭 시 모달 열기
  const openModal = (post) => {
    setSelectedPost(post);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedPost(null);
  };

  // 쪽지 모달 열기
  const openMessageModal = () => {
    setShowMessageModal(true);
  };

  // 쪽지 모달 닫기
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageContent("");
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="accompany-info-container">
      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">
          <LuSearch className="search-icon" />
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="post-list">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="post-item"
            onClick={() => setSelectedPost(post)}
          >
            <FaEdit className="post-icon" />
            <div className="post-content">
              <div className="post-title">{post.title}</div>
              <div className="post-meta">
                <span className="post-date">{post.date}</span>
                <span className="post-author">{post.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 게시글 상세보기 모달 */}
      {selectedPost && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedPost.title}</h2>
            <p className="modal-date">{selectedPost.date}</p>
            <p className="modal-author">작성자: {selectedPost.author}</p>
            <p className="modal-text">{selectedPost.content}</p>

            {/* 쪽지 보내기 버튼 */}
            <button className="message-button" onClick={openMessageModal}>
              쪽지 보내기
            </button>

            <button className="close-button" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 쪽지 모달 */}
      {showMessageModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>쪽지 보내기</h2>
            <textarea
              placeholder="쪽지 내용을 입력하세요..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="message-input"
            />
            <button className="send-message-button" onClick={closeMessageModal}>
              보내기
            </button>
            <button className="close-button" onClick={closeMessageModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccompanyInfo;

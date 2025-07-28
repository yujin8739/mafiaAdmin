import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NoticeUpload = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 등록 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      // FormData 생성
      const formData = new FormData();

      // JSON 데이터를 Blob으로 변환
      const noticeData = { title, content };
      const noticeBlob = new Blob([JSON.stringify(noticeData)], {
        type: "application/json",
      });

      formData.append("notice", noticeBlob);
      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post("/api/noticeUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      alert(response.data); // 서버에서 오는 메시지 출력
      navigate("/notice"); // 등록 후 공지사항 목록으로 이동
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("공지사항 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">공지사항 등록</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* 제목 입력 */}
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 파일 업로드 */}
        <div className="form-group mt-3">
          <label htmlFor="upfile">첨부파일</label>
          <input
            type="file"
            id="upfile"
            className="form-control-file border"
            onChange={handleFileChange}
          />
        </div>

        {/* 내용 입력 */}
        <div className="form-group mt-3">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            className="form-control"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {/* 버튼 영역 */}
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            등록
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={() => navigate("/notice")}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeUpload;

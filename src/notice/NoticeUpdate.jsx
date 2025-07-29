import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/notice/NoticeUpdate.css'; 



const NoticeUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ navigate에서 전달된 notice 객체 가져오기
  const notice = location.state?.notice || {};

  // ✅ 초기값 설정
  const [title, setTitle] = useState(notice.title || "");
  const [content, setContent] = useState(notice.content || "");
  const [file, setFile] = useState(null);

  // ✅ 기존 파일 정보
  const [originName] = useState(notice.originName || "");
  const [changeName] = useState(notice.changeName || "");

  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await axios.get(
        `/api/download/${filePath}`,
        {
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Blob 데이터를 가상 링크로 만들어 강제 다운로드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // 실제 다운로드 파일명 지정
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      alert("파일을 다운로드할 수 없습니다.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      const formData = new FormData();

      // ✅ JSON 데이터를 Blob으로 변환
      const updatedNotice = {
        noticeNo: notice.noticeNo,
        title,
        content,
        originName,
        changeName,
      };
      const noticeBlob = new Blob([JSON.stringify(updatedNotice)], {
        type: "application/json",
      });

      formData.append("notice", noticeBlob);
      if (file) {
        formData.append("file", file);
      }

      // ✅ API 호출
      const response = await axios.put(
        `/api/noticeUpdate/${notice.noticeNo}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      alert(response.data); // 성공 메시지 출력
      navigate("/notice"); // 목록 페이지 이동
    } catch (error) {
      console.error("공지사항 수정 실패:", error);
      alert("공지사항 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="update-container">
      <h3 className="update-title">공지사항 수정</h3>

      <form onSubmit={handleUpdate} encType="multipart/form-data" className="update-form">
        {/* 제목 */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">제목</label>
          <input
            type="text"
            id="title"
            className="form-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 첨부파일 */}
        <div className="form-group mt-3">
          <label htmlFor="upfile" className="form-label">첨부파일</label>
          <input
            type="file"
            id="upfile"
            className="form-file2"
            onChange={handleFileChange}
          />

          {/* 기존 파일 정보 */}
          <div className="file-info">
            <label className="form-label">현재 업로드된 파일: </label>
            {originName ? (
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() =>
                downloadFile(
                  changeName.split("/").pop(), // 서버에 보낼 실제 파일명
                  originName // 사용자에게 보여줄 원본 파일명
                )
              }
            >
              {originName}
            </button>
            ) : (
              <span className="file-none">첨부파일이 없습니다.</span>
            )}
          </div>
        </div>

        {/* 내용 */}
        <div className="form-group mt-3">
          <label htmlFor="content" className="form-label">내용</label>
          <textarea
            id="content"
            className="form-content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {/* 버튼 */}
        <div className="btn-area">
          <button type="submit" className="update-btn">
            수정하기
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/notice")}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeUpdate;

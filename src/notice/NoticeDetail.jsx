import React from "react";
import "../css/notice/NoticeDetail.css";
import axios from "axios";

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

const NoticeDetail = ({ selectedNotice, onClose }) => {
  if (!selectedNotice) return null;

  return (
    <div className="notice-detail-block">
      {/* 제목 & 닫기 버튼 */}
      <div className="notice-header">
        <h4 className="mb-0">{selectedNotice.title}</h4>
      </div>

      {/* 작성일 + 첨부파일 + 조회수 */}
      <div className="notice-meta">
        <div className="mr-3">
          작성일: {selectedNotice.createDate?.slice(0, 10) || "-"}
        </div>
        <div className="mr-3">
          첨부파일:{" "}
          {selectedNotice.originName ? (
            <button
              className="btn btn-link p-0"
              onClick={() =>
                downloadFile(
                  selectedNotice.changeName.split("/").pop(), // 서버에 보낼 실제 파일명
                  selectedNotice.originName // 사용자에게 보여줄 원본 파일명
                )
              }
            >
              {selectedNotice.originName}
            </button>
          ) : (
            "첨부파일이 없습니다."
          )}
        </div>
        <div>조회수: {selectedNotice.count}</div>
      </div>

      {/* 내용 */}
      <div className="notice-content border p-3 rounded bg-white">
        {selectedNotice.content || "내용이 없습니다."}
      </div>

      <button className="notice-close-btn" onClick={onClose}>
        닫기
      </button>
    </div>
  );
};

export default NoticeDetail;

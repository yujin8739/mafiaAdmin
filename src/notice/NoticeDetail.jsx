import React from "react";

const NoticeDetail = ({ selectedNotice, onClose }) => {
  if (!selectedNotice) return null;

  return (
    <div className="notice-detail-block p-4 border rounded bg-light mt-3">
      {/* 제목 & 닫기 버튼 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{selectedNotice.title}</h4>
      </div>

      {/* 작성일 + 첨부파일 + 조회수 */}
      <div className="d-flex justify-content-start text-muted small mb-3 flex-wrap">
        <div className="mr-3">
          작성일: {selectedNotice.createDate?.slice(0, 10) || "-"}
        </div>
        <div className="mr-3">
          첨부파일:{" "}
          {selectedNotice.originName ? (
            <a href={selectedNotice.changeName} download={selectedNotice.originName}>
              {selectedNotice.originName}
            </a>
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

      <button className="btn btn-secondary btn-sm" onClick={onClose}>
        닫기
      </button>
    </div>
  );
};

export default NoticeDetail;

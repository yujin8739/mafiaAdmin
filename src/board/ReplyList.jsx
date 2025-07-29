import { useEffect, useState } from "react";
import axios from "axios";
import "../css/board/ReplyList.css";

const ReplyList = ({ postId }) => {
  const [replyList, setReplyList] = useState([]);

  useEffect(() => {
    if (!postId) return;
    axios
      .get("/api/board/getReplyList", {
        params: { boardNo: postId },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setReplyList(res.data))
      .catch((err) => console.error(err));
  }, [postId]);

  const handleDelete = (replyNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    axios
      .delete(`/api/board/deleteReply`, {
        params: { replyNo : replyNo },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setReplyList(replyList.filter((r) => r.replyNo !== replyNo));
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (reply) => {
  try {
    const response = await axios.get(
      `/api/board/file/download?changeName=${encodeURIComponent(reply.changeName)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', reply.originName || 'file'); // 실제 파일명 적용
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('파일 다운로드 실패', error);
  }
};

  return (
    <div className="reply-list-container">
      <h4>댓글 목록</h4>
      {replyList.length === 0 ? (
        <p className="no-reply">댓글이 없습니다.</p>
      ) : (
        <ul className="reply-list">
          {replyList.map((reply) => (
            <li key={reply.replyNo} className="reply-item">
              <div className="reply-header">
                <span className="reply-writer">{reply.nickName}</span>
                <span className="reply-date">{reply.createDate}</span>
              </div>
              <div className="reply-content">{reply.replyContent}</div>
              {reply.changeName && (
                <button
                    onClick={() => {handleDownload(reply);}}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        display: 'block',
                        padding: '4px 0'
                    }}
                >
                    {reply.originName}
                </button>
              )}
              <button
                className="reply-delete-btn"
                onClick={() => handleDelete(reply.replyNo)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReplyList;

import { useState, useEffect } from "react";
import axios from "axios";
import "../css/message/Message.css";

const MessageDetail = ({ messageId, onClose }) => {
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    // 쪽지 상세 조회 함수는 useEffect 내부에만 존재합니다.

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await axios.get(`/api/messages/${messageId}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                
                if (response.data.success) {
                    setMessage(response.data.message);
                } else {
                    alert("쪽지를 불러올 수 없습니다: " + response.data.message);
                    onClose();
                }
            } catch (error) {
                console.error("쪽지 조회 실패:", error);
                alert("쪽지 조회에 실패했습니다.");
                onClose();
            } finally {
                setLoading(false);
            }
        };

        if (messageId) {
            fetchMessage();
        }
    }, [messageId, onClose]);

    // 날짜 포맷
    function formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
   }

    // 읽음여부 표시
    const getReadStatus = (readYn) => {
        return readYn === 'Y' ? 
            <span className="status-read">읽음</span> : 
            <span className="status-unread">안읽음</span>;
    };

    // 삭제상태 표시
    const getDeleteStatus = (deleteSender, deleteReceiver) => {
        if (deleteSender === 'Y' && deleteReceiver === 'Y') {
            return <span className="status-deleted">양쪽삭제</span>;
        } else if (deleteSender === 'Y') {
            return <span className="status-deleted">발신자삭제</span>;
        } else if (deleteReceiver === 'Y') {
            return <span className="status-deleted">수신자삭제</span>;
        } else {
            return <span className="status-normal">정상</span>;
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>쪽지 상세보기</h3>
                        <button className="btn btn-secondary" onClick={onClose}>×</button>
                    </div>
                    <div className="loading-text">
                        <div>로딩 중...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!message) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>쪽지 상세보기</h3>
                    <button className="btn btn-secondary" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <div className="detail-info">
                        <div className="info-row">
                            <label>쪽지 번호:</label>
                            <span>{message.privateMsgNo}</span>
                        </div>
                        
                        <div className="info-row">
                            <label>발신자:</label>
                            <span>{message.senderNickName || message.senderUserName}</span>
                        </div>
                        
                        <div className="info-row">
                            <label>수신자:</label>
                            <span>{message.receiverNickName || message.receiverUserName}</span>
                        </div>
                        
                        <div className="info-row">
                            <label>제목:</label>
                            <span className="message-title">{message.title}</span>
                        </div>
                        
                        <div className="info-row">
                            <label>쪽지 타입:</label>
                            <span className="message-type">{message.messageType}</span>
                        </div>
                        
                        <div className="info-row">
                            <label>보낸 날짜:</label>
                            <span>{formatDate(message.sendDate)}</span>
                        </div>
                        
                        <div className="info-row">
                            <label>읽은 날짜:</label>
                            <span>{formatDate(message.readDate)}</span>
                        </div>
                        
                        <div className="info-row">
                            <label>읽음 여부:</label>
                            {getReadStatus(message.readYn)}
                        </div>
                        
                        <div className="info-row">
                            <label>삭제 상태:</label>
                            {getDeleteStatus(message.deleteSender, message.deleteReceiver)}
                        </div>
                        
                        {message.parentPrivateMsgNo && (
                            <div className="info-row">
                                <label>원본 쪽지:</label>
                                <span>#{message.parentPrivateMsgNo}</span>
                            </div>
                        )}
                        
                        <div className="content-section">
                            <label>내용:</label>
                            <div className="message-content">
                                {message.content}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageDetail;
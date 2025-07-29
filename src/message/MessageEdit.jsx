import { useState, useEffect } from "react";
import axios from "axios";
import '../css/message/Message.css';

const MessageEdit = ({ messageId, onClose, onUpdate }) => {
    const [message, setMessage] = useState({
        title: '',
        content: '',
        messageType: '',
        readYn: '',
        deleteSender: '',
        deleteReceiver: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 쪽지 상세 조회
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

    useEffect(() => {
        if (messageId) {
            fetchMessage();
        }
    }, [messageId]);

    // 입력값 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 수정 저장
    const handleSave = async () => {
        // 필수값 검증
        if (!message.title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!message.content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        setSaving(true);
        try {
            const response = await axios.put(`/api/messages/${messageId}`, {
                title: message.title.trim(),
                content: message.content.trim(),
                messageType: message.messageType,
                readYn: message.readYn,
                deleteSender: message.deleteSender,
                deleteReceiver: message.deleteReceiver
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.data.success) {
                alert("쪽지가 수정되었습니다.");
                onUpdate(); // 목록 새로고침
                onClose();  // 모달 닫기
            } else {
                alert("수정 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("수정 실패:", error);
            alert("수정에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div>로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>쪽지 수정</h3>
                    <button className="btn btn-secondary" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <form>
                        <div className="form-group">
                            <label>발신자:</label>
                            <input 
                                type="text" 
                                value={message.senderNickName || message.senderUserName} 
                                disabled 
                                className="form-control"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>수신자:</label>
                            <input 
                                type="text" 
                                value={message.receiverNickName || message.receiverUserName} 
                                disabled 
                                className="form-control"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>제목:</label>
                            <input 
                                type="text" 
                                name="title"
                                value={message.title}
                                onChange={handleChange}
                                className="form-control"
                                maxLength="200"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>내용:</label>
                            <textarea 
                                name="content"
                                value={message.content}
                                onChange={handleChange}
                                className="form-control"
                                rows="5"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>쪽지 타입:</label>
                            <select 
                                name="messageType"
                                value={message.messageType}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="PERSONAL">일반</option>
                                <option value="REPLY">답장</option>
                                <option value="FRIEND_REQUEST">친구요청</option>
                                <option value="TRADE">거래</option>
                                <option value="GAME_INVITE">게임초대</option>
                                <option value="SYSTEM">시스템</option>
                                <option value="BLOCK">차단</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>읽음 여부:</label>
                            <select 
                                name="readYn"
                                value={message.readYn}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="Y">읽음</option>
                                <option value="N">안읽음</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>발신자 삭제:</label>
                            <select 
                                name="deleteSender"
                                value={message.deleteSender}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="N">정상</option>
                                <option value="Y">삭제</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>수신자 삭제:</label>
                            <select 
                                name="deleteReceiver"
                                value={message.deleteReceiver}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="N">정상</option>
                                <option value="Y">삭제</option>
                            </select>
                        </div>
                    </form>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "저장 중..." : "저장"}
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={onClose}
                        disabled={saving}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageEdit;
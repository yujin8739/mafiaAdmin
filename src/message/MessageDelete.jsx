import { useState } from "react";
import axios from "axios";
import "../css/message/Message.css";

const MessageDelete = () => {
    const [privateMsgNo, setPrivateMsgNo] = useState('');
    const [deleting, setDeleting] = useState(false);

    // 쪽지 번호 입력 변경
    const handleChange = (e) => {
        setPrivateMsgNo(e.target.value);
    };

    // 쪽지 삭제
    const handleDelete = async () => {
        if (!privateMsgNo.trim()) {
            alert("삭제할 쪽지 번호를 입력해주세요.");
            return;
        }

        if (!confirm(`쪽지 번호 ${privateMsgNo}를 정말 삭제하시겠습니까?`)) {
            return;
        }

        setDeleting(true);
        try {
            const response = await axios.delete(`/api/messages/${privateMsgNo}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.data.success) {
                alert("쪽지가 삭제되었습니다.");
                setPrivateMsgNo(''); // 입력 필드 초기화
            } else {
                alert("삭제 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <h3>번호로 쪽지 삭제</h3>
            <p>특정 쪽지 번호를 알고 있을 때 직접 삭제할 수 있습니다.</p>
            
            <div className="delete-form">
                <input
                    type="number"
                    placeholder="쪽지 번호 입력"
                    value={privateMsgNo}
                    onChange={handleChange}
                    min="1"
                />
                <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "삭제 중..." : "삭제"}
                </button>
            </div>
        </div>
    );
};

export default MessageDelete;
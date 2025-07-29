import axios from 'axios';
import { useEffect, useState } from 'react';
import ReplyList from './ReplyList';
import '../css/board/LoungeDetail.css'; // 외부 CSS 파일 import

const LoungeDetail = ({ selectedBoard, onClose, typeName }) => {
    const [board, setBoard] = useState(null);

    useEffect(() => {
        if (!selectedBoard?.boardNo) return;

        const fetchBoardDetail = async () => {
            try {
                const response = await axios.get(`/api/board/lounge/detail/${selectedBoard.boardNo}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                setBoard(response.data);
            } catch (error) {
                console.error("게시글 상세 조회 실패", error);
            }
        };

        fetchBoardDetail();
    }, [selectedBoard]);

    const handleDownload = async (file) => {
        if (!file) return;

        try {
            const response = await axios.post(
                '/api/board/file/download',
                { file, typeName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    responseType: 'blob',
                }
            );

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.originName || 'file');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('파일 다운로드 실패', error);
        }
    };

    if (!selectedBoard || !board) return null;

    return (
        <div className="lounge-detail-wrapper">
            <div className="lounge-detail-card">
                <div className="lounge-detail-header">
                    <h3>게시글 상세 정보</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="lounge-detail-body">
                    <p><strong>번호:</strong> {board.boardNo}</p>
                    <p><strong>제목:</strong> {board.title}</p>
                    <p><strong>내용:</strong></p>
                    <div
                        className="board-content"
                        dangerouslySetInnerHTML={{ __html: board.detail }}
                    />
                    <div className="file-section">
                        <strong>첨부 파일:</strong>
                        {board.fileList?.length > 0 ? (
                            board.fileList
                                .filter(file => file.fileNo !== 0)
                                .map((file, idx) => (
                                    <button
                                        key={idx}
                                        className="file-download-btn"
                                        onClick={() => handleDownload(file)}
                                    >
                                        {file.originName}
                                    </button>
                                ))
                        ) : (
                            <span>없음</span>
                        )}
                    </div>
                    <div className="reply-section">
                        <strong>댓글 목록:</strong>
                        <ReplyList postId={selectedBoard.boardNo} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoungeDetail;

import axios from 'axios';
import { useEffect, useState } from 'react';

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

                setBoard(response.data); // ✅ 이건 state니까 변경 가능

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
        {
         file,
         typeName   
        }, // 파일 정보만 넘김
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
        <div className="room-detail-block">
            <h3>게시글 상세 정보</h3>
            <p><strong>번호:</strong> {board.boardNo}</p>
            <p><strong>제목:</strong> {board.title}</p>
            <p><strong>내용:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: board.detail }} />
            <div>
                <strong>댓글 목록:</strong>
                <div>
                    {board.replyList?.length > 0 ? (
                        board.replyList.map((reply, i) => (
                            <div key={i}>{reply.replyContent}</div>
                        ))
                    ) : (
                        <div>댓글 없음</div>
                    )}
                </div>
            </div>
            <p>
                <strong>첨부 파일:</strong>
                {board.fileList?.length > 0 ? (
                    board.fileList
                    .filter(file => file.fileNo !== 0)
                    .map((file, idx) => (
                        <button
                        key={idx}
                        onClick={() => handleDownload(file)}
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
                        {file.originName}
                        </button>
                    ))
                ) : (
                    "없음"
                )}
                </p>
            <button onClick={onClose}>닫기</button>
        </div>
    );
};

export default LoungeDetail;

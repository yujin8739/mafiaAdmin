import axios from 'axios';
import { useEffect, useState } from 'react';

const LoungeDetail = ({ selectedBoard, onClose }) => {
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

                console.log("받아온 게시글 상세 정보 ", response.data);
                setBoard(response.data); // ✅ 이건 state니까 변경 가능

            } catch (error) {
                console.error("게시글 상세 조회 실패", error);
            }
        };

        fetchBoardDetail();
    }, [selectedBoard]);

    const handleDownload = async () => {
  if (!board) return;

  try {
        const response = await axios.post('/api/board/lounge/file/download',
        JSON.stringify(board),  // Board 객체를 JSON 문자열로
        {
            headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
            },
            responseType: 'blob', // 바이너리 데이터 받기
        }
        );

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 원본 파일명으로 저장
        link.setAttribute('download', board.fileList?.[0]?.originName || 'file');

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('파일 다운로드 실패', error);
        }
    };



    if (!selectedBoard || !board) return null;

    const originName = board?.fileList?.[0]?.originName;
    const changeName = board?.fileList?.[0]?.changeName;

    return (
        <div className="room-detail-block">
            <h3>게시글 상세 정보</h3>
            <p><strong>번호:</strong> {board.boardNo}</p>
            <p><strong>제목:</strong> {board.title}</p>
            <p><strong>내용:</strong> {board.detail}</p>
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
                {board.fileList?.[0]?.fileNo !== 0 ? (
                    <button onClick={handleDownload} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    {originName}
                    </button>
                ) : (
                    "없음"
                )}
            </p>
            <button onClick={onClose}>닫기</button>
        </div>
    );
};

export default LoungeDetail;

import { useState, useEffect } from "react";
import axios from "axios";
import MessageDetail from "./MessageDetail.jsx";
import MessageEdit from "./MessageEdit.jsx";
import '../css/message/Message.css';

const MessageList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [deleting, setDeleting] = useState(false);
    
    // 상세보기 모달 상태 관리
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    
    // 수정 모달 상태 관리
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMessageId, setEditMessageId] = useState(null);

    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [pageInfo, setPageInfo] = useState(null);

    // 쪽지 목록 조회 - 페이지네이션 파라미터 추가
    const fetchMessages = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get("/api/messages", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                params: {
                    page: page,
                    size: pageSize
                }
            });
            
            if (response.data.success) {
                setMessages(response.data.messages || []);
                setTotalCount(response.data.totalCount || 0);
                setPageInfo(response.data.pageInfo);
                setCurrentPage(page);
            } else {
                console.error("쪽지 조회 실패:", response.data.message);
            }
        } catch (error) {
            console.error("쪽지 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // 체크박스 개별 선택/해제
    const handleCheckboxChange = (msgNo, isChecked) => {
        if (isChecked) {
            setSelectedMessages(prev => [...prev, msgNo]);
        } else {
            setSelectedMessages(prev => prev.filter(id => id !== msgNo));
        }
    };

    // 전체 선택/해제
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedMessages(messages.map(msg => msg.privateMsgNo));
        } else {
            setSelectedMessages([]);
        }
    };

    // 선택된 쪽지들 삭제
    const handleSelectedDelete = async () => {
        if (selectedMessages.length === 0) {
            alert("삭제할 쪽지를 선택해주세요.");
            return;
        }

        if (!confirm(`선택된 ${selectedMessages.length}개의 쪽지를 정말 삭제하시겠습니까?`)) {
            return;
        }

        setDeleting(true);
        try {
            const response = await axios.post("/api/messages/bulk-delete", {
                messageIds: selectedMessages
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.data.success) {
                alert(`${response.data.deletedCount}개의 쪽지가 삭제되었습니다.`);
                setSelectedMessages([]); // 선택 초기화
                fetchMessages(currentPage); // 현재 페이지로 새로고침
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

    // 개별 쪽지 삭제
    const handleSingleDelete = async (msgNo) => {
        if (!confirm(`쪽지 번호 ${msgNo}를 정말 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await axios.delete(`/api/messages/${msgNo}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.data.success) {
                alert("쪽지가 삭제되었습니다.");
                fetchMessages(currentPage); // 현재 페이지로 새로고침
            } else {
                alert("삭제 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // 상세보기 모달 열기
    const handleShowDetail = (messageId) => {
        setSelectedMessageId(messageId);
        setShowDetailModal(true);
    };

    // 상세보기 모달 닫기
    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedMessageId(null);
    };

    // 수정 모달 열기
    const handleShowEdit = (messageId) => {
        setEditMessageId(messageId);
        setShowEditModal(true);
    };

    // 수정 모달 닫기
    const handleCloseEdit = () => {
        setShowEditModal(false);
        setEditMessageId(null);
    };

    // 수정 완료 후 목록 새로고침
    const handleUpdateComplete = () => {
        fetchMessages(currentPage);
    };

    // 페이지 변경 핸들러 추가
    const handlePageChange = (page) => {
        fetchMessages(page);
        setSelectedMessages([]); // 페이지 변경 시 선택 초기화
    };

    // 페이지네이션 컴포넌트
    const renderPagination = () => {
        if (!pageInfo || totalCount === 0) return null;

        const totalPages = pageInfo.maxPage;
        const pages = [];

        // 이전 버튼 (항상 표시)
        pages.push(
            <button 
                key="prev" 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                이전
            </button>
        );

        // 페이지 번호들
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            pages.push(
                <button 
                    key={1} 
                    className="pagination-btn"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="pagination-dots">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button 
                    key={i} 
                    className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="pagination-dots">...</span>);
            }
            pages.push(
                <button 
                    key={totalPages} 
                    className="pagination-btn"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        // 다음 버튼 (항상 표시)
        pages.push(
            <button 
                key="next" 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                다음
            </button>
        );

        return (
            <div className="pagination-container">
                <div className="pagination">
                    {pages}
                </div>
                <div className="pagination-info">
                    총 {totalCount}개 중 {((currentPage - 1) * pageSize + 1)}~{Math.min(currentPage * pageSize, totalCount)}개 표시
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div>
            <h3>쪽지 목록</h3>
            
            {/* 선택 관리 영역 */}
            <div className="selection-controls">
                <span>선택된 쪽지: {selectedMessages.length}개</span>
                <button 
                    className="btn btn-danger" 
                    onClick={handleSelectedDelete}
                    disabled={deleting || selectedMessages.length === 0}
                >
                    {deleting ? "삭제 중..." : `선택된 ${selectedMessages.length}개 삭제`}
                </button>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedMessages([])}
                    disabled={selectedMessages.length === 0}
                >
                    선택 해제
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={messages.length > 0 && selectedMessages.length === messages.length}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                            전체선택
                        </th>
                        <th>번호</th>
                        <th>발신자</th>
                        <th>수신자</th>
                        <th>제목</th>
                        <th>보낸날짜</th>
                        <th>읽음여부</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <tr key={msg.privateMsgNo}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedMessages.includes(msg.privateMsgNo)}
                                        onChange={(e) => handleCheckboxChange(msg.privateMsgNo, e.target.checked)}
                                    />
                                </td>
                                <td>{msg.privateMsgNo}</td>
                                <td>{msg.senderNickName || msg.senderUserName}</td>
                                <td>{msg.receiverNickName || msg.receiverUserName}</td>
                                <td>{msg.title}</td>
                                <td>{new Date(msg.sendDate).toLocaleDateString()}</td>
                                <td>{msg.readYn === 'Y' ? '읽음' : '안읽음'}</td>
                                <td>
                                    {msg.deleteSender === 'Y' && msg.deleteReceiver === 'Y' ? '양쪽삭제' :
                                     msg.deleteSender === 'Y' ? '발신자삭제' :
                                     msg.deleteReceiver === 'Y' ? '수신자삭제' : '정상'}
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleShowDetail(msg.privateMsgNo)}
                                    >
                                        상세
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleShowEdit(msg.privateMsgNo)}
                                    >
                                        수정
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleSingleDelete(msg.privateMsgNo)}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">등록된 쪽지가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {/* 페이지네이션 추가 */}
            {renderPagination()}
            
            {/* 상세보기 모달 */}
            {showDetailModal && (
                <MessageDetail 
                    messageId={selectedMessageId}
                    onClose={handleCloseDetail}
                />
            )}
            
            {/* 수정 모달 */}
            {showEditModal && (
                <MessageEdit 
                    messageId={editMessageId}
                    onClose={handleCloseEdit}
                    onUpdate={handleUpdateComplete}
                />
            )}
        </div>
    );
};

export default MessageList;
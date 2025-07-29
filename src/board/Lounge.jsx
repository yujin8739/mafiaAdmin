import { useState, useEffect } from "react";
import axios from "axios";
import LoungeDelete from "./LoungeDelete";
import LoungeDetail from "./LoungeDetail";
import '../css/board/Lounge.css';
import Pagination from "../util/pagination/Pagination";

const Lounge = () => {
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [boardType, setBoardType] = useState(""); // "", "갤러리", "영상"
  const [searchCondition, setSearchCondition] = useState("title"); // 기본값: 제목
  const [searchKeyword, setSearchKeyword] = useState("");

  const limit = 10;

  const boardTypes = ["", "갤러리", "영상"];

  const handlePrevType = () => {
    const currentIndex = boardTypes.indexOf(boardType);
    const newIndex = (currentIndex - 1 + boardTypes.length) % boardTypes.length;
    setBoardType(boardTypes[newIndex]);
    setPage(1); // 페이지도 초기화
    setSearchCondition("title");
    setSearchKeyword("");
    setSelectedBoard(null);
  };

  const handleNextType = () => {
    const currentIndex = boardTypes.indexOf(boardType);
    const newIndex = (currentIndex + 1) % boardTypes.length;
    setBoardType(boardTypes[newIndex]);
    setPage(1); // 페이지도 초기화
    setSearchCondition("title");
    setSearchKeyword("");
    setSelectedBoard(null);
  };
 
  const fetchBoardList = async (pageNum = 1) => {
    try {
      const response = await axios.get("/api/board/", {
        params : {
          currentPage : pageNum,
          typeName: boardType,
          condition: searchCondition,
          keyword: searchKeyword
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setBoardList(response.data.boardList);
      setTotalPages(Math.ceil(response.data.listCount / limit));
    } catch (error) {
      console.error(error);
      alert("게시글 목록 불러오기 중 오류가 발생하였습니다.");
    }
  };
  
  useEffect(() => { fetchBoardList(page); }, [page,boardType]);

  const handleDeleteSuccess = (deletedBoardNo) => {
    setBoardList(boardList.filter((board) => board.boardNo !== deletedBoardNo));
  };

  const handleRowClick = (board) => {
        setSelectedBoard(board);
  };

  return (
    <div className="board-container">
      <div className="board-header">
        <button onClick={handlePrevType} className="arrow-button">◀</button>
        <h2>{boardType === "" ? `관리자 일반 게시글 목록` : `관리자 ${boardType} 게시글 목록`}</h2>
        <button onClick={handleNextType} className="arrow-button">▶</button>
      </div>
      <div className="search-bar">
        <select value={searchCondition} onChange={(e) => setSearchCondition(e.target.value)}>
          <option value="title">제목</option>
          <option value="writer">작성자</option>
          <option value="content">내용</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              fetchBoardList(1);
            }
          }}
        />
        <button onClick={() => { setPage(1); fetchBoardList(1); }}>검색</button>
      </div>
      <table className="board-table" width="100%">
        <thead>
          <tr>
            <th>글번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {boardList?.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">게시글이 없습니다.</td>
            </tr>
          ) : (
            boardList?.map((board) => (
              <tr key={board.boardNo} onClick={() => handleRowClick(board)}>
                <td>{board.boardNo}</td>
                <td>{board.title}</td>
                <td>{board.nickName}</td>
                <td>
                  <LoungeDelete
                    boardNo={board.boardNo}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => {setPage(newPage); setSelectedBoard(null);}} />
      <LoungeDetail selectedBoard={selectedBoard} onClose={() => setSelectedBoard(null)} typeName={boardType}/>
    </div>
  );
};

export default Lounge;
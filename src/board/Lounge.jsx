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
  const limit = 10;

 
    const fetchBoardList = async (pageNum = 1) => {
      try {
        console.log(pageNum);
        const response = await axios.get("/api/board/lounge", {
          params : {
            currentPage : pageNum
            
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
  
   useEffect(() => { fetchBoardList(page); }, [page]);

  const handleDeleteSuccess = (deletedBoardNo) => {
    setBoardList(boardList.filter((board) => board.boardNo !== deletedBoardNo));
  };

  const handleRowClick = (board) => {
        setSelectedBoard(board);
  };

  return (
    <div className="board-container">
      <h2>관리자 게시글 목록</h2>
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
      <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
      <LoungeDetail selectedBoard={selectedBoard} onClose={() => setSelectedBoard(null)} />
    </div>
  );
};

export default Lounge;
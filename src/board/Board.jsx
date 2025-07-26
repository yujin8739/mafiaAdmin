import { useState, useEffect } from "react";
import axios from "axios";
import BoardDelete from "./BoardDelete";

const Board = () => {
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.post("/api/board/boardList", null, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setBoardList(response.data);
      } catch (error) {
        console.error(error);
        alert("게시글 목록 불러오기 중 오류가 발생하였습니다.");
      }
    };

    fetchBoardList();
  }, []);

  const handleDeleteSuccess = (deletedBoardNo) => {
    setBoardList(boardList.filter((board) => board.boardNo !== deletedBoardNo));
  };

  return (
    <div>
      <h1>관리자 게시글 목록</h1>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>글번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {boardList.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">게시글이 없습니다.</td>
            </tr>
          ) : (
            boardList.map((board) => (
              <tr key={board.boardNo}>
                <td>{board.boardNo}</td>
                <td>{board.title}</td>
                <td>{board.writer}</td>
                <td>
                  <BoardDelete
                    boardNo={board.boardNo}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Board;

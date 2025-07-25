import axios from "axios";
import React from "react";
import '../css/gameRoom/GameRoom.css';

function GameRoom() {
    const [gameRooms, setGameRooms] = React.useState([]);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const limit = 10;

    const handleGameRoomList = async (pageNum = 1) => {
        try {
            const response = await axios.get("/api/gameroom/list", {
                params: { offset: (pageNum - 1) * limit, limit },
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            });
            if (response.status !== 200) throw new Error("네트워크 오류");
            setGameRooms(response.data.gameRooms);
            setTotalPages(Math.ceil(response.data.totalCount / limit));
        } catch (error) {
            console.error("게임 방 리스트 가져오기 실패:", error);
        }
    };

    React.useEffect(() => { handleGameRoomList(page); }, [page]);

    const handleRowClick = (room) => {
        setSelectedRoom(room);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="game-room-container">
            <h2>게임 방 리스트</h2>
            <table>
                <thead>
                    <tr>
                        <th>방 번호</th>
                        <th>방 이름</th>
                        <th>참여 인원</th>
                        <th>최대 인원</th>
                        <th>참여자 목록</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {gameRooms.length > 0 ? (
                        gameRooms.map((room) => (
                            <tr key={room.roomNo} onClick={() => handleRowClick(room)} style={{ cursor: "pointer" }}>
                                <td>{room.roomNo}</td>
                                <td>{room.roomName}</td>
                                <td>{
                                    (() => {
                                        let users = room.userList;
                                        if (typeof users === "string") {
                                            try { users = JSON.parse(users); } catch { users = []; }
                                        }
                                        return Array.isArray(users) ? users.length : 0;
                                    })()
                                }</td>
                                <td>{room.headCount}</td>
                                <td>
                                    {typeof room.userList === "string"
                                        ? JSON.parse(room.userList).join(", ")
                                        : Array.isArray(room.userList)
                                            ? room.userList.join(", ")
                                            : ""}
                                </td>
                                <td>{room.isGaming ? "게임 중" : "대기 중"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                게임 방이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>이전</button>
                <span>{page} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages}>다음</button>
            </div>
            {selectedRoom && (
                <div className="room-detail-block">
                    <h3>방 상세 정보</h3>
                    <p><strong>방 번호:</strong> {selectedRoom.roomNo}</p>
                    <p><strong>방 이름:</strong> {selectedRoom.roomName}</p>
                    <p><strong>참여 인원:</strong> {
                        (() => {
                            let users = selectedRoom.userList;
                            if (typeof users === "string") {
                                try { users = JSON.parse(users); } catch { users = []; }
                            }
                            return Array.isArray(users) ? users.length : 0;
                        })()
                    }</p>
                    <p><strong>최대 인원:</strong> {selectedRoom.headCount}</p>
                    <p><strong>참여자 목록:</strong> {
                        typeof selectedRoom.userList === "string"
                            ? JSON.parse(selectedRoom.userList).join(", ")
                            : Array.isArray(selectedRoom.userList)
                                ? selectedRoom.userList.join(", ")
                                : ""
                    }</p>
                    <p><strong>상태:</strong> {selectedRoom.isGaming ? "게임 중" : "대기 중"}</p>
                    <button onClick={() => setSelectedRoom(null)}>닫기</button>
                </div>
            )}
        </div>
    );
}

export default GameRoom;
import axios from "axios";
import React from "react";
import '../css/gameRoom/GameRoom.css';
import GameRoomDetail from "./GameRoomDetail";
import Pagination from "../util/pagination/Pagination";

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

    const handleRowClick = (room) => {
        setSelectedRoom(room);
    };


    React.useEffect(() => { handleGameRoomList(page); }, [page]);

    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <div className="game-room-container">
                <h2>로그인 해주세요</h2>
            </div>
        );
    }

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
                    {gameRooms?.length > 0 ? (
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
            <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
            <GameRoomDetail selectedRoom={selectedRoom} onClose={() => setSelectedRoom(null)} />
        </div>
    );
}

export default GameRoom;
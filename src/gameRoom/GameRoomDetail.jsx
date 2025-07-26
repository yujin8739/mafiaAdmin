const GameRoomDetail = ({ selectedRoom, onClose }) => {
    if (!selectedRoom) return null;

    let users = selectedRoom.userList;
    if (typeof users === "string") {
        try { users = JSON.parse(users); } catch { users = []; }
    }

    return (
        <div className="room-detail-block">
            <h3>방 상세 정보</h3>
            <p><strong>방 번호:</strong> {selectedRoom.roomNo}</p>
            <p><strong>방 이름:</strong> {selectedRoom.roomName}</p>
            <p><strong>참여 인원:</strong> {Array.isArray(users) ? users.length : 0}</p>
            <p><strong>최대 인원:</strong> {selectedRoom.headCount}</p>
            <p><strong>참여자 목록:</strong> {Array.isArray(users) ? users.join(", ") : ""}</p>
            <p><strong>상태:</strong> {selectedRoom.isGaming ? "게임 중" : "대기 중"}</p>
            <button onClick={onClose}>닫기</button>
        </div>
    );
};

export default GameRoomDetail;
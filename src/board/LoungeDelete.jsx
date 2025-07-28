import axios from "axios";

const LoungeDelete = ({ boardNo, onDeleteSuccess }) => {
    
    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `/api/board/lounge/delete/${boardNo}`,
                null,
                {
                    headers : {
                        Authorization : "Bearer " + localStorage.getItem("token")  
                    }
                }
            );

            if(response.status === 200){
                alert('게시글이 정상적으로 삭제되었습니다.');
                onDeleteSuccess(boardNo); // 삭제 성공 시 부모에게 알림
            } else {
                alert("게시글 삭제에 실패하였습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <button onClick={handleDelete}>
            삭제
        </button>
    );
};

export default LoungeDelete;
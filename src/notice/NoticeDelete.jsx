import axios from "axios";

const NoticeDelete = ({ noticeNo, onDeleteSuccess }) => {
  const handleDelete = async () => {
    if (!window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/noticeDelete/${noticeNo}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      alert("공지사항이 삭제되었습니다.");
      onDeleteSuccess(); // 부모 컴포넌트에서 리스트 새로고침
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <button className="btn btn-danger btn-sm" onClick={handleDelete}>
      삭제
    </button>
  );
};

export default NoticeDelete;
// src/artshop/ArtShopDelete.jsx
import axios from "axios";

const ArtShopDelete = ({ artId, onDelete }) => {
  const handleArtDelete = async (e) => {
    e.stopPropagation(); // 행(row) 클릭 이벤트 방지

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.post(
        "/api/artDelete",
        { artId },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      alert("삭제 완료");
      onDelete(); // 부모 컴포넌트에 삭제 완료 알림
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제 실패");
    }
  };

  return <button onClick={handleArtDelete}>삭제</button>;
};

export default ArtShopDelete;

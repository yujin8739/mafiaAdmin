// src/artshop/ArtShopDelete.jsx
import axios from "axios";

const ArtShopDelete = ({ artId, onDelete }) => {
  const handleArtDelete = async () => {
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
      onDelete(); // 부모에게 삭제 후 처리 알려주기
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제 실패");
    }
  };

  return <button onClick={handleArtDelete}>삭제</button>;
};

export default ArtShopDelete;

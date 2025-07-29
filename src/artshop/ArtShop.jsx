import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../util/pagination/Pagination";
import ArtShopDetail from "./ArtShopDetail";
import ArtShopDelete from "./ArtShopDelete"; // ✅ 추가

function ArtShop() {
  const [artList, setArtList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const limit = 10;

  const fetchArtList = async (pageNum = 1) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("토큰이 없습니다. 로그인 해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get("/api/artShop/artList", {
        params: {
          offset: (pageNum - 1) * limit,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setArtList(response.data.artList || []);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching art list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtList(page);
  }, [page]);

  const handleRowClick = (art) => {
    setSelectedArt(art);
  };

  return (
    <div className="art-shop-container">
      <h2>Art Shop</h2>
      <table>
        <thead>
          <tr>
            <th>Artwork ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {artList && artList.length > 0 ? (
            artList.map((art) => (
              <tr
                key={art.artId}
                onClick={() => handleRowClick(art)}
                style={{ cursor: "pointer" }}
              >
                <td>{art.artId}</td>
                <td>{art.title}</td>
                <td>{art.price}</td>
                <td>
                  <ArtShopDelete
                    artId={art.artId}
                    onDelete={() => {
                        fetchArtList(page)
                        setSelectedArt(null);
                        
                    }} // 삭제 후 목록 다시 불러오기
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                미술 작품이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalPages={Math.ceil(totalCount / limit)}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {selectedArt && <ArtShopDetail art={selectedArt} />}
    </div>
  );
}

export default ArtShop;

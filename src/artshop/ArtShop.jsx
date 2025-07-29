import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../util/pagination/Pagination";
import ArtShopDetail from "./ArtShopDetail"; // 상세 정보 컴포넌트

function ArtShop() {
    const [artList, setArtList] = useState([]); // 미술 작품 리스트 (빈 배열로 초기화)
    const [totalCount, setTotalCount] = useState(0); // 전체 데이터 개수
    const [page, setPage] = useState(1); // 현재 페이지
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [selectedArt, setSelectedArt] = useState(null); // 선택된 일러스트 정보
    const limit = 10; // 페이지당 항목 수

    // 일러스트 목록 가져오기
    const fetchArtList = async (pageNum = 1) => {
        const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기

        if (!token) {
            console.error("토큰이 없습니다. 로그인 해주세요.");
            return;
        }

        setLoading(true); // 로딩 시작

        try {
            const response = await axios.get("/api/artShop/artList", {
                params: {
                    offset: (pageNum - 1) * limit,
                    limit
                },
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setArtList(response.data.artList || []); // 빈 배열로 처리
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error("Error fetching art list:", error);
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    useEffect(() => {
        fetchArtList(page);
    }, [page]);

    // 일러스트 클릭 시 상세 정보 보여주기
    const handleRowClick = (art) => {
        setSelectedArt(art); // 선택된 일러스트 정보 설정
    };

    if (loading) {
        return <div>Loading...</div>; // 로딩 중 표시
    }

    return (
        <div className="art-shop-container">
            <h2>Art Shop</h2>
            <table>
                <thead>
                    <tr>
                        <th>Artwork ID</th>
                        <th>Title</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {artList && artList.length > 0 ? (
                        artList.map((art) => (
                            <tr
                                key={art.artId}
                                onClick={() => handleRowClick(art)} // 클릭 시 상세 정보 표시
                                style={{ cursor: "pointer" }}
                            >
                                <td>{art.artId}</td>
                                <td>{art.title}</td>
                                <td>{art.price}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
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

            {/* 선택된 일러스트 정보 표시 */}
            {selectedArt && <ArtShopDetail art={selectedArt} />}
        </div>
    );
}

export default ArtShop;

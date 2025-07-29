import React from "react";

const ArtShopDetail = ({ art }) => {
    if (!art) return null; // 선택된 일러스트가 없으면 아무 것도 표시하지 않음

    // art 객체에 있는 소문자 필드명으로 수정
    // const imageUrl = `http://yourdomain.com/godDaddy_uploadImage/artshopImage/${art.imagePath}`;
    const imageUrl = `http://localhost:8081/${art.imagePath.replace(/^\/+/, '')}`;

    console.log(art.imagePath);//이미지 값 오는지 확인하는 구문
    console.log(imageUrl);

    return (
        <div className="art-shop-detail">
            <h3>일러스트 상세 정보</h3>
            {/* 이미지 경로를 올바르게 변환 */}
            <img 
                src={imageUrl || "default_image_url"} 
                alt="일러스트 이미지" 
                style={{ width: '200px', height: 'auto' }} 
            />
            <p><strong>Artwork ID:</strong> {art.artId || "ID 없음"}</p>
            <p><strong>Title:</strong> {art.title || "제목 없음"}</p>
            <p><strong>Price:</strong> {art.price || "가격 미정"}</p>
            <p><strong>Artist:</strong> {art.sellerName || "작가 정보 없음"}</p>
            <p><strong>Description:</strong> {art.description || "설명 없음"}</p>
            <p><strong>Status:</strong> {art.status || "상태 없음"}</p>
            <p><strong>Upload Date:</strong> {new Date(art.uploadDate).toLocaleDateString() || "날짜 없음"}</p>
        </div>
    );
};

export default ArtShopDetail;

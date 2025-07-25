import React, { useEffect, useState } from "react";
import axios from "axios";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 필터 조건 상태
  const [keyword, setKeyword] = useState("");
  const [condition, setCondition] = useState("title");
  const [sort, setSort] = useState("byDate");
  const [currentPage, setCurrentPage] = useState(1);

  // 공지사항 불러오기 함수
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/notices",
      {
        params: {
          currentPage: currentPage,
          keyword: keyword,
          condition: condition,
          sort: sort
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      setNotices(response.data.noticeList);
    } catch (error) {
      console.error("공지사항 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 처음 로드될 때 1번 실행
  useEffect(() => {
    fetchNotices();
  }, []);

  // 정렬 기준이 바뀔 때 자동 재조회
  useEffect(() => {
    fetchNotices();
  }, [sort]);

  // 검색 폼 제출 처리
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNotices();
  };

  return (
    <div className="container mt-5">
      <h1>공지사항</h1>

      {/* 정렬 기준 + 검색 폼 */}
      <div className="d-flex justify-content-between align-items-center my-3 flex-wrap">
        {/* 정렬 기준 */}
        <form className="form-inline">
          <label className="mr-2 font-weight-bold">정렬 기준:</label>
          <select
            className="form-control"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="byDate">게시일 순</option>
            <option value="count">조회수 순</option>
          </select>
        </form>

        {/* 검색 폼 */}
        <form className="form-inline" onSubmit={handleSearchSubmit}>
          <select
            className="form-control mr-2"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            className="form-control mr-2"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어 입력"
          />
          <button type="submit" className="btn btn-secondary">
            검색
          </button>
        </form>
      </div>

      {/* 목록 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : notices.length === 0 ? (
        <p>조회된 공지사항이 없습니다.</p>
      ) : (
        <table className="table table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th>글번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>게시일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.noticeNo}>
                <td>{notice.noticeNo}</td>
                <td>{notice.title}</td>
                <td>관리자</td>
                <td>{notice.createDate?.slice(0, 10)}</td>
                <td>{notice.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Notice;

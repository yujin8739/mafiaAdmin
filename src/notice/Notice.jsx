import React, { useEffect, useState } from "react";
import axios from "axios";
import NoticeDelete from "./NoticeDelete";
import Pagination from "../util/pagination/Pagination";
import '../css/notice/Notice.css';
import { useNavigate } from "react-router-dom";
import NoticeDetail from "./NoticeDetail";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState(null);
  const Navigate = useNavigate();

  // 필터 조건 상태
  const [keyword, setKeyword] = useState("");
  const [condition, setCondition] = useState("title");
  const [sort, setSort] = useState("byDate");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // 공지사항 불러오기 함수
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/notices", {
        params: {
          currentPage: page,
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
      setPageInfo(response.data.pi);
      setTotalPages(response.data.pi.maxPage);
    } catch (error) {
      console.error("공지사항 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotices();
  }, [page, sort]);

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
    setPage(1);
    fetchNotices();
  };

  const handleUpdateClick = (notice) => {
    Navigate(`/notice/update/${notice.noticeNo}`, { state: { notice } });
  };

  const navigate = useNavigate();

  const handleRowClick = (notice) => {
    setSelectedNotice(notice);
  };

  return (
    <div className="notice-container">
      <h2>공지사항</h2>
      <div className="notice-header-bar">
        {/* 공지사항 등록 버튼 */}
        <button
          className="btn btn-primary notice-upload-btn"
          onClick={() => navigate("/notice/upload")}
        >
          공지사항 등록
        </button>

        {/* 정렬 + 검색 영역 */}
        <div className="d-flex align-items-center flex-wrap">
          {/* 정렬 */}
          <form className="form-inline mr-3">
            <label className="mr-2 font-weight-bold">정렬 :</label>
            <select
              className="form-control"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="byDate">게시일 순</option>
              <option value="count">조회수 순</option>
            </select>
          </form>

          {/* 검색 */}
          <form className="form-inline d-flex" onSubmit={handleSearchSubmit}>
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
      </div>

      {/* 목록 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : !Array.isArray(notices) || notices.length === 0 ? (
        <p>조회된 공지사항이 없습니다.</p>
      ) : (
        <>
        <table className="table table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th>글번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>게시일</th>
              <th>조회수</th>
              <th>수정 / 삭제</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <React.Fragment key={notice.noticeNo}>
                  <tr
                    onClick={() => handleRowClick(notice)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedNotice?.noticeNo === notice.noticeNo
                          ? "#f9f9f9"
                          : "white",
                    }}
                  >
                    <td>{notice.noticeNo}</td>
                    <td>{notice.title}</td>
                    <td>관리자</td>
                    <td>{notice.createDate?.slice(0, 10)}</td>
                    <td>{notice.count}</td>
                    <td>
                      <button
                        className="custom-update-btn"
                        onClick={(e) => handleUpdateClick(notice, e)}
                      >
                        수정
                      </button>
                      <NoticeDelete
                        noticeNo={notice.noticeNo}
                        onDeleteSuccess={fetchNotices}
                      />
                    </td>
                  </tr>
                  {selectedNotice?.noticeNo === notice.noticeNo && (
                    <tr>
                      <td colSpan="6" style={{ padding: 0 }}>
                        <NoticeDetail
                          selectedNotice={selectedNotice}
                          onClose={() => setSelectedNotice(null)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
            ))}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
      </>
      )}
    </div>
  );
};

export default Notice;

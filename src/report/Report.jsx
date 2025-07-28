import { useEffect, useState } from "react";

function Report() {
    const [reportList, setReportList] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const limit = 10;

    const handleReportList = async(pageNum = 1) => {
        const response = await axios.get("/api/getReportList", 
        {
            params : {
                reportNo : reportNo, 
                offset : (pageNum - 1) * limit, 
                limit : limit
            },
            headers : {
                "Authorization": 'Bearer ' + localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });

        setTotalPages(Math.ceil(response.data.totalCount / limit));
        setReportList(response.data.report);
    }

    const handleRowClick = (room) => {
        setSelectedRoom(room);
    };

    React.useEffect(() => { handleReportList(page); }, [page]);

    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <div className="game-room-container">
                <h2>로그인 해주세요</h2>
            </div>
        );
    }

    return (
        <div className="game-room-container">
            <h2>신고리스트</h2>
            <table>
                <thead>
                    <tr>
                        <th>신고번호</th>
                        <th>신고자명</th>
                        <th>신고내용</th>
                        <th>신고게시글</th>
                        <th>신고처리</th>
                    </tr>
                </thead>
                <tbody>
                    {reportList>0?
                        reportList.map((report)=>(
                            <tr key={report.reportNo} onClick={() => {handleRowClick(report.reportNo)}} style={{ cursor: "pointer" }}>
                                <td>{report.reportNo}</td>
                                <td>{report.reportUser}</td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                신고내역이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
            <GameRoomDetail selectedRoom={selectedRoom} onClose={() => setSelectedRoom(null)} />
        </div>
    );


}

export default Report;
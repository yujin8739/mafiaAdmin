import { useEffect, useState } from "react";
import ReportManager from "../report/ReportManager"

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

    const handleReportManager = (reportedName) => {
        setReportedName(reportedName);
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
                        <th>신고자ID</th>
                        <th>대상ID</th>
                        <th>신고사유</th>
                        <th>날짜</th>
                        <th>신고처리</th>
                    </tr>
                </thead>
                <tbody>
                    {reportList>0?
                        reportList.map((report)=>(
                            <tr key={report.reportId} onClick={() => {handleRowClick(report.reportNo)}} style={{ cursor: "pointer" }}>
                                <td>{report.reporterId}</td>
                                <td>{report.reportedName}</td>
                                <td>{report.reason}</td>
                                <td>{report.reportedat}</td>
                                <td>
                                    <button onClick={() => handleReportManager(report.reportedName)}>신고처리</button>
                                </td>
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

            <ReportManager onClose={() => setSelectedRoom(null)} />
            <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
            
        </div>
    );


}

export default Report;
import React from "react";
import ReportManager from "../report/ReportManager"
import axios from "axios";
import Pagination from "../util/pagination/Pagination";

function Report() {
    const [reportList, setReportList] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [selectedReport, setSelectedReport] = React.useState(null);
    const limit = 10;

    const handleReportList = async(pageNum = 1) => {
        const response = await axios.get("/api/getReportList", 
        {
            params : {
                offset : (pageNum - 1) * limit, 
                limit : limit
            },
            headers : {
                "Authorization": 'Bearer ' + localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });

        setReportList(response.data.report);
        setTotalPages(Math.ceil(response.data.totalCount / limit));
    };

    const handleReportManager = (report) => {
        setSelectedReport(report);
    };

    React.useEffect(() => { handleReportList(page); }, [page]);
 
    React.useEffect(() => {
        if (selectedReport === null) {
            handleReportList(page);
        }   
        // eslint-disable-next-line
    }, [selectedReport]);

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
                        <th>대상닉네임</th>
                        <th>신고사유</th>
                        <th>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {reportList.length>0?
                        reportList.map((report)=>(
                            <tr key={report.reportId} onClick={() => {handleReportManager(report)}} style={{ cursor: "pointer" }}>
                                <td>{report.reportId}</td>
                                <td>{report.reporterId}</td>
                                <td>{report.reportedName}</td>
                                <td>{report.reportedNickName}</td>
                                <td>{report.reason}</td>
                                <td>{report.reportedAt}</td>
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
            
            {selectedReport && (
                <ReportManager 
                    report={selectedReport} 
                    onClose={() => setSelectedReport(null)} 
                />
            )}
            <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
            
        </div>
    );


}

export default Report;
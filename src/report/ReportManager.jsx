import React from "react";
import axios from "axios";
import "../css/report/ReportDetail.css";
import qs from "qs";

const ReportManager = ({ report, onClose }) => {
    const [selectedReport, setSelectedReport] = React.useState(report);

    React.useEffect(() => {
        setSelectedReport(report);
    }, [report]);

    if (!report) return null;

    const handleReportManager = async (e) => {
        e.preventDefault();
        await axios.post("/api/blockUser",
             qs.stringify({
                userName: selectedReport.reportedName,
                reportId: selectedReport.reportId
            }),
            {
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem("token"),
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        onClose();
    };

    const handleRejectReport = async () => {
        await axios.post("/api/rejectReport",
             qs.stringify({
                reportId: selectedReport.reportId
            }),
            {
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem("token"),
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        onClose();
    };

    return (
        <div className="report-manager-container">
            <div className="report-manager-modal">
                <h2 className="report-manager-title">신고 처리</h2>
                <div className="report-manager-field"><strong>신고 번호:</strong> {selectedReport.reportId}</div>
                <div className="report-manager-field"><strong>신고 대상 ID:</strong> {selectedReport.reportedName}</div>
                <div className="report-manager-field"><strong>닉네임:</strong> {selectedReport.reportedNickName}</div>
                <div className="report-manager-field"><strong>신고 사유:</strong> {selectedReport.reason}</div>
                <div className="report-manager-field"><strong>날짜:</strong> {selectedReport.reportedAt}</div>

                <div className="report-manager-buttons">
                    <button onClick={handleReportManager} className="report-manager-button approve">
                        신고 처리
                    </button>
                    <button onClick={handleRejectReport} className="report-manager-button reject">
                        반려
                    </button>
                    <button onClick={onClose} className="report-manager-button close">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportManager;

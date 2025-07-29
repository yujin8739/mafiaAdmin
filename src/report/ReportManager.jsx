import React from "react";

function ReportManager () {

    const [reportedName,setReportedName] = React.useState("");

    const handleReportManager = async() => {
        const response = axios.post("/api/blockUser", 
        {
            userName :userName
        },
        {
            headers : {
                "Authorization": 'Bearer ' + localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });    
    }

    return (
        <div className="report-manager-container">
            <h2>신고 처리</h2>
            <form onSubmit={handleReportManager}>
                <label>
                    신고 대상 사용자:
                    <input 
                        type="text" 
                        value={reportedName} 
                        onChange={(e) => setReportedName(e.target.value)} 
                        required 
                    />
                </label>
                <button type="submit">신고 처리</button>
            </form>
        </div>
    );
}

export default ReportManager;
import { useState } from "react";
import axios from "axios";
import "../css/message/Message.css";

const MessageSearch = () => {
    const [searchData, setSearchData] = useState({
        senderUserName: '',
        receiverUserName: '',
        title: '',
        messageType: '',
        readYn: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // 입력값 변경
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 검색 실행
    const handleSearch = async () => {
        setSearching(true);
        try {
            // 검색 조건이 있는 것만 파라미터로 전달
            const params = new URLSearchParams();
            Object.keys(searchData).forEach(key => {
                if (searchData[key].trim()) {
                    params.append(key, searchData[key].trim());
                }
            });

            const response = await axios.get(`/api/messages/search?${params.toString()}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.data.success) {
                setSearchResults(response.data.messages || []);
                alert(`검색 완료: ${response.data.messages?.length || 0}개 결과`);
            } else {
                alert("검색 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("검색 실패:", error);
            alert("검색에 실패했습니다.");
        } finally {
            setSearching(false);
        }
    };

    // 검색 초기화
    const handleReset = () => {
        setSearchData({
            senderUserName: '',
            receiverUserName: '',
            title: '',
            messageType: '',
            readYn: ''
        });
        setSearchResults([]);
    };

    return (
        <div>
            <h3>쪽지 검색</h3>
            <div className="search-form">
                <div className="search-row">
                    <input
                        type="text"
                        name="senderUserName"
                        placeholder="발신자 검색"
                        value={searchData.senderUserName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="receiverUserName"
                        placeholder="수신자 검색"
                        value={searchData.receiverUserName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="제목 검색"
                        value={searchData.title}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="search-row">
                    <select
                        name="messageType"
                        value={searchData.messageType}
                        onChange={handleChange}
                    >
                        <option value="">전체 타입</option>
                        <option value="PERSONAL">일반</option>
                        <option value="REPLY">답장</option>
                        <option value="FRIEND_REQUEST">친구요청</option>
                        <option value="TRADE">거래</option>
                        <option value="GAME_INVITE">게임초대</option>
                        <option value="SYSTEM">시스템</option>
                        <option value="BLOCK">차단</option>
                    </select>
                    
                    <select
                        name="readYn"
                        value={searchData.readYn}
                        onChange={handleChange}
                    >
                        <option value="">전체</option>
                        <option value="Y">읽음</option>
                        <option value="N">안읽음</option>
                    </select>
                    
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSearch}
                        disabled={searching}
                    >
                        {searching ? "검색 중..." : "검색"}
                    </button>
                    
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleReset}
                    >
                        초기화
                    </button>
                </div>
            </div>

            {/* 검색 결과 */}
            {searchResults.length > 0 && (
                <div>
                    <h4>검색 결과 ({searchResults.length}개)</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>발신자</th>
                                <th>수신자</th>
                                <th>제목</th>
                                <th>타입</th>
                                <th>보낸날짜</th>
                                <th>읽음여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((msg) => (
                                <tr key={msg.privateMsgNo}>
                                    <td>{msg.privateMsgNo}</td>
                                    <td>{msg.senderNickName || msg.senderUserName}</td>
                                    <td>{msg.receiverNickName || msg.receiverUserName}</td>
                                    <td>{msg.title}</td>
                                    <td>{msg.messageType}</td>
                                    <td>{new Date(msg.sendDate).toLocaleDateString()}</td>
                                    <td>{msg.readYn === 'Y' ? '읽음' : '안읽음'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MessageSearch;
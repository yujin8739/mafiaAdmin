import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import MainRouter from "./routes/MainRouter";
import './css/App.css'; 
import mainLogo from './assets/mainLogo.png';
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 예시: localStorage에 토큰이 있으면 로그인 상태로 간주
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <img src={mainLogo} alt="Logo" className="login-logo" />
      <h1 className="login-title">관리자 페이지</h1>
      <nav>
        <Link to="/">홈</Link> | 
        <Link to="/board">게시글</Link> |
        <Link to="/notice">공지사항</Link> |
        <Link to="/artshop">아트샵 관리</Link> |
        {isLoggedIn ? (
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </nav>
      <MainRouter />
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
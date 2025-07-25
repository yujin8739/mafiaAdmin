import { BrowserRouter, Link } from "react-router-dom";
import MainRouter from "./routes/MainRouter";
import './css/App.css'; 
import mainLogo from './assets/mainLogo.png';

function App() {
  return (
    <BrowserRouter>
    <img src={mainLogo} alt="Logo" className="login-logo" />
    <h1 className="login-title">관리자 페이지</h1>
      <nav>
        <Link to="/">홈</Link> | 
        <Link to="/board">게시글</Link> |
        <Link to="/notice">공지사항</Link> |
        <Link to="/profile">프로필</Link> |
        <Link to="/login">로그인</Link> |
      </nav>
      <MainRouter />
    </BrowserRouter>
  );
}

export default App;
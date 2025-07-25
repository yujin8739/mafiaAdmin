import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import MainRouter from "./routes/MainRouter";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">홈</Link> |<Link to="/about">게시글</Link> |
        <Link to="/notice">공지사항</Link> |<Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
        <Link to="/profile">프로필</Link>
      </nav>
      <MainRouter />
    </BrowserRouter>
  );
}

export default App;

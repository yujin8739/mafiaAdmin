import React from "react";
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx";
import Notice from "../notice/Notice.jsx";
import Board from "../board/Board.jsx"; 
import GameRoom from "../gameRoom/GameRoom.jsx";

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/board" element={<Board />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/" element={<GameRoom />} />
    </Routes>
  );
}

export default MainRouter;

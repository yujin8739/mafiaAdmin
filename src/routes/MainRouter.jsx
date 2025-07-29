import React from "react";
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx";
import Notice from "../notice/Notice.jsx";
import Board from "../board/Board.jsx"; 
import GameRoom from "../gameRoom/GameRoom.jsx";
import Message from "../message/Message.jsx"

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/board" element={<Board />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/" element={<GameRoom />} />
      <Route path="/message" element={<Message />} />
    </Routes>
  );
}

export default MainRouter;

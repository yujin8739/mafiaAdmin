import React from "react";
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx";
import Notice from "../notice/Notice.jsx";
import Lounge from "../board/Lounge.jsx"; 
import GameRoom from "../gameRoom/GameRoom.jsx";

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/lounge" element={<Lounge />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/" element={<GameRoom />} />
    </Routes>
  );
}

export default MainRouter;

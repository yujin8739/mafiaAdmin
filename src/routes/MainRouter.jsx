import React from "react";
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx";
import Notice from "../notice/Notice.jsx";
import Lounge from "../board/Lounge.jsx"; 
import NoticeUpdate from "../notice/NoticeUpdate.jsx";
import GameRoom from "../gameRoom/GameRoom.jsx";
import ArtShop from "../artshop/ArtShop.jsx";
import Message from "../message/Message.jsx"
import NoticeUpload from "../notice/NoticeUpload.jsx";
import Report from "../report/report.jsx";



function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/lounge" element={<Lounge />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/notice/update/:noticeNo" element={<NoticeUpdate />} />
      <Route path="/notice/upload" element={<NoticeUpload />} />
      <Route path="/report" element={<Report/>}/>
      <Route path="/" element={<GameRoom />} />
      <Route path="/artshop" element={<ArtShop />} />
      <Route path="/message" element={<Message />} />
    </Routes>
  );
}

export default MainRouter;

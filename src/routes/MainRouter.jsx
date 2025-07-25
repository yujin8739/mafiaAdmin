import React from "react";
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx";

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/notice/delete/:noticeNo" element={<NoticeDelete />} />
    </Routes>
  );
}

export default MainRouter;

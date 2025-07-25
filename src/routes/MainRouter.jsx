import React from "react";
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx";
import Notice from "../notice/Notice.jsx";

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/notice" element={<Notice />} />
    </Routes>
  );
}

export default MainRouter;

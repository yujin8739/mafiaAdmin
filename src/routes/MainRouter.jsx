import React from 'react';
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx"; 

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
    </Routes>   
  );
}

export default MainRouter;

import React from 'react';
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx"; 
import Member from '../member/Member.jsx';

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/member" element={<Member />} />
    </Routes>   
  );
}

export default MainRouter;

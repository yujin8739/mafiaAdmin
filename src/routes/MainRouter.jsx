import React from 'react';
import { Routes, Route } from "react-router-dom";
import AxiosLogin from "../login/Login.jsx"; 
import Member from '../member/Member.jsx';
import Board from "../board/Board.jsx"; 

function MainRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AxiosLogin />} />	  
      <Route path="/member" element={<Member />} />
	  <Route path="/board" element={<Board />} />
    </Routes>   
  );
}

export default MainRouter;

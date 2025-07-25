import React from "react";
import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import AxiosLogin from "../login/Login.jsx";
import Notice from "../notice/Notice.jsx";
=======
import AxiosLogin from "../login/Login.jsx"; 
import Member from '../member/Member.jsx';
>>>>>>> branch 'main' of https://github.com/yujin8739/mafiaAdmin.git
import Board from "../board/Board.jsx"; 

function MainRouter() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/login" element={<AxiosLogin />} />
      <Route path="/board" element={<Board />} />
      <Route path="/notice" element={<Notice />} />
    </Routes>
=======
      <Route path="/login" element={<AxiosLogin />} />	  
      <Route path="/member" element={<Member />} />
	  <Route path="/board" element={<Board />} />
    </Routes>   
>>>>>>> branch 'main' of https://github.com/yujin8739/mafiaAdmin.git
  );
}

export default MainRouter;

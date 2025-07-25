import React, { useState } from 'react';
import axios from 'axios';
import '../css/login/AxiosLogin.css';

const AxiosLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => { 
    event.preventDefault(); // 폼 제출 시 새로고침 막기

    try {    
      const response = await axios.post('/api/login', {
        userName: userName,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log('Login successful:', response.data);
      // 로그인 성공 후 처리 로직 (예: 토큰 저장, 리디렉션 등)
      localStorage.setItem('token', response.data.token);
      // 예: 메인 페이지로 리디렉션
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="UserName"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  ); 
};

export default AxiosLogin;
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './notMember/login/Login';
import Signin from './notMember/signin/Signin';
import Findpw from './notMember/findpw/Findpw';
import Gnewpw from './notMember/findpw/Gnewpw';
import MemberIndex from './member/MemberIndex';
import axios from 'axios';
import { useEffect } from 'react';


function App() {
  
  //최상위 컴포넌트
  // 나중에는 /member 없애고 path /*에 로그인 여부에 따라서 "로그인됨 ? <Member /> : <Login />" 식으로 변경 필요
  

  
  return (
    <div className="container">

      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Login />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/findpw' element={<Findpw />} />
          <Route path='/gnewpw/*' element={<Gnewpw />} />
          <Route path='/member/*' element={<MemberIndex />} />          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

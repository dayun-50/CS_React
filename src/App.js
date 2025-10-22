import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './notMember/login/Login';
import Signin from './notMember/signin/Signin';
import Findpw from './notMember/findpw/Findpw/Findpw';
import Gnewpw from './notMember/findpw/Gnewpw/Gnewpw';
import MemberIndex from './member/MemberIndex';
import useAuthStore from './store/useAuthStore';
import axios from 'axios';
import { useEffect } from 'react';


function App() {
  
  //최상위 컴포넌트
  

  const {login, isLogin} = useAuthStore(state=>state);

  
  useEffect(()=>{ // 토큰 유지
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    if(token){
      login(token,id);
    }
  },[]);

  return (
    <div className="container">

      <BrowserRouter>
        <Routes>
          <Route path='/*' element={isLogin ? <MemberIndex /> : <Login /> } />{/* 로그인 되어잇으면 ? 멤버인덱스 :아니면 로그인페이지 */}
          <Route path='/signin' element={<Signin />} />
          <Route path='/findpw' element={<Findpw />} />
          <Route path='/gnewpw/*' element={<Gnewpw />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

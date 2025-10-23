import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MemberIndex from './member/MemberIndex';
import useAuthStore from './store/useAuthStore';
import { useEffect } from 'react';


function App() {

  //최상위 컴포넌트


  const { login, isLogin } = useAuthStore(state => state);


  useEffect(() => { // 토큰 유지
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    if (token) {
      login(token, id);
    }
  }, []);

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path='/signin' element={<Signin />} />
          <Route path='/findpw' element={<Findpw />} />
          <Route path='/gnewpw/*' element={<Gnewpw />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}
export default App;

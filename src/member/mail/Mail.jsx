// Mail.jsx
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SubSideBar from "../navis/subsidebar/SubSideBar";
import MailList from "./Components/mailList/MailList";
import MailWrite from "./Components/mailWrite/MailWrite";
import MailDetail from "./Components/mailDetail/MailDetail";
import MailSuccess from "./Components/mailSuccess/MailSuccess";
import styles from "./Mail.module.css";
import { useEffect, useState } from "react";

const Mail = () => {
  const navigate = useNavigate();


//---------------------------------여기서 부터 서브사이드 바 넘기는 데이타
//1. 버튼 기본설정    
const btnsType= [ 
      { key:"", name: "전체", path: "/mail" },
      { key:"send", name: "보낸 메일", path: "/mail/send" },
      { key:"received", name: "받은 메일", path: "/mail/received" },
    ]

//2. 경로로 타겟을 꺼내옴 mail/send면 "send" 없으면 ""
  const location = useLocation();
  const target = location.pathname.split("/")[2] ?? "" 

//3. 타겟이 바뀔때마다 유즈이펙펙트로 감지해주면 된다
  useEffect(() => {
    const currentType = btnsType.find((t) => t.key === target);
    if (currentType) {
      setSubSidebarData((prev) => ({ ...prev, selectedBtn: currentType.name }));
    } else {
      setSubSidebarData((prev) => ({ ...prev, selectedBtn: "전체" }));
    }
  }, [target]);


//4. 서브사이드바 데이터 상태변수 : 그래서 타겟 유즈이펙트로 바뀔때마다 데이터를 넘겨주도록  
   const [subSidebarData, setSubSidebarData] = useState({
    btns: btnsType.map(({ name, path }) => ({ name, path })), // 작성하기 제외 버튼들
    selectedBtn: target,
    text: "메일 작성", // 작성하기 버튼의 문구
    navigateFunc: () => navigate("/mail/write"), //작성하기 버튼 경로 이동용 함수
  });



//-----------------------------------


  // MailList에 넘길 더미 데이터
  const getDataForTab = (tabPath) => {
    switch (tabPath) {
      case "/mail/send":
        return { message: "보낸 메일 데이터", mails: [] };
      case "/mail/received":
        return { message: "받은 메일 데이터", mails: [] };
      default:
        return { message: "전체 메일 데이터", mails: [] };
    }
  };

  return (
    <div className={styles.mailcontainer}>
      {/* 좌측 서브사이드바 */}
      <div className={styles.sidebar}>
        <SubSideBar data={subSidebarData} />
      </div>

      {/* 우측 컨텐츠 */}
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<MailList data={getDataForTab("/mail")} tabName="전체" />} />
          <Route path="/write" element={<MailWrite />} />
          <Route path="/send" element={<MailList data={getDataForTab("/mail/send")} tabName="보낸 메일" />} />
          <Route path="/received" element={<MailList data={getDataForTab("/mail/received")} tabName="받은 메일" />} />
          <Route path="/mailok" element={<MailSuccess />} />
          <Route path="/detail" element={<MailDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default Mail;

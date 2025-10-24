// Mail.jsx
import { Routes, Route, useNavigate } from "react-router-dom";
import SubSideBar from "../navis/subsidebar/SubSideBar";
import MailList from "./Components/mailList/MailList";
import MailWrite from "./Components/mailWrite/MailWrite";
import MailDetail from "./Components/mailDetail/MailDetail";
import MailSuccess from "./Components/mailSuccess/MailSuccess";
import styles from "./Mail.module.css";

const Mail = () => {
  const navigate = useNavigate();

  // SubSideBar용 버튼 데이터
  const sidebarData = {
    text: "메일 쓰기", // 상단 추가 버튼 텍스트
    navigateFunc: () => navigate("/mail/write"), // 추가 버튼 클릭 시 이동
    btns: [
      { name: "전체", path: "/mail" },
      { name: "보낸 메일", path: "/mail/send" },
      { name: "받은 메일", path: "/mail/received" },
    ],
  };

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
        <SubSideBar data={sidebarData} />
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

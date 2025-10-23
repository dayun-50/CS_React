import { useState } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import Subsidebar from "../navis/subsidebar/SubSideBar";
import MailList from "./Components/mailList/MailList";
import styles from "./Mail.module.css";
import MailWrite from "./Components/mailWrite/MailWrite";
import MailDetail from "./Components/mailDetail/MailDetail";
import MailSuccess from "./Components/mailSuccess/MailSuccess";

const Mail = () => {
  const [selectedTab, setSelectedTab] = useState("전체");
  const navigate = useNavigate();

  const handleTabChange = (tabName) => {
    setSelectedTab(tabName);
  };

  // ✅ SubSideBar용 데이터 구성
  const sidebarData = {
    text: "메일 쓰기", // 상단 추가 버튼 텍스트
    navigateFunc: () => navigate("/mail/write"), // 추가 버튼 클릭 시 이동
    selectedBtn: selectedTab, // 현재 선택된 버튼
    btns: [
      { name: "전체", path: "/mail" },
      { name: "보낸 메일", path: "/mail/send" },
      { name: "받은 메일", path: "/mail/received" },
    ],
  };

  const getDataForTab = () => {
    switch (selectedTab) {
      case "보낸 메일":
        return { message: "보낸 메일 데이터", mails: [] };
      case "받은 메일":
        return { message: "받은 메일 데이터", mails: [] };
      default:
        return { message: "전체 메일 데이터", mails: [] };
    }
  };

  return (
    <div className={styles.mailcontainer}>
      <div className={styles.sidebar}>
        {/* ✅ 이제 SubSideBar가 필요한 모든 데이터를 받습니다 */}
        <Subsidebar data={sidebarData} onTabChange={handleTabChange} />
      </div>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<MailList data={getDataForTab()} tabName={selectedTab} />} />
          <Route path="/write" element={<MailWrite />} />
          <Route path="/send" element={<MailList data={getDataForTab()} tabName={selectedTab} />} />
          <Route path="/list" element={<MailList data={getDataForTab()} tabName={selectedTab} />} />
          <Route path="/received" element={<MailList data={getDataForTab()} tabName={selectedTab} />} />
          <Route path="/mailok" element={<MailSuccess />} />
          <Route path="/detail" element={<MailDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default Mail;

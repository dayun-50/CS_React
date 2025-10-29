import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./ChannelIndex.module.css";
import message from "./icon/Messages.svg";
import calendar from "./icon/Calendar.svg";
import messageActive from "./icon/Messages-active.svg";
import calendarActive from "./icon/Calendar-active.svg";
import MessagesIndex from "./channelType/messages/MessagesIndex";

const Channellndex = ({ selectedSeq, setSelectedSeq }) => {
  const [activeTab, setActiveTab] = useState("messages");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSeq) {
      setActiveTab("schedule"); // selectedSeq가 있으면 schedule 탭으로 전환
      navigate("/channel/schedule"); // schedule 페이지로 이동
    }
  }, []);

  const handleTabClick = (tab) => {
    console.log("채널 클릭, selectedSeq:", selectedSeq);

    if (!selectedSeq) {
      alert("먼슬리를 보기 전에 채널을 먼저 선택하세요!");
      return;
    }
    setActiveTab(tab);

    if (tab === "schedule") {

      navigate("/channel/schedule");
    } else {
      navigate("/channel");
    }
  };


  return (
    <div className={styles.channelIndex}>
      {/* 상단 탭바 */}
      <div className={styles.tabBarContainer}>
        <div className={styles.tabWrapper}>
          <div
            className={`${styles.tabButton} ${activeTab === "messages" ? styles.activeTab : ""
              }`}
            onClick={() => handleTabClick("messages")}
          >
            <img
              className={styles.messagesIcon}
              src={activeTab === "messages" ? messageActive : message}
              alt="메신저"
            />
            <span className={styles.tabLabel}>메신저</span>
          </div>

          <div
            className={`${styles.tabButton} ${activeTab === "schedule" ? styles.activeTab : ""
              }`}
            onClick={() => handleTabClick("schedule")}
          >
            <img
              className={styles.calendarIcon}
              src={activeTab === "schedule" ? calendarActive : calendar}
              alt="먼슬리"
            />
            <span className={styles.tabLabel}>먼슬리</span>
          </div>
        </div>
      </div>

      <div className={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
};

export default Channellndex;

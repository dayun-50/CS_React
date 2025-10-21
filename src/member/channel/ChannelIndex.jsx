import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // 추가
import styles from "./ChannelIndex.module.css";
import message from "./icon/Messages.svg";
import calendar from "./icon/Calendar.svg";
import messageActive from "./icon/Messages-active.svg"; // 이런 식으로 active 이미지도 import
import calendarActive from "./icon/Calendar-active.svg";

const Channellndex = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab === "messages" ? "" : "schedule");
  };

  return (
    <div className={styles.channelIndex}>
      {/* 상단바 */}
      <div className={styles.tabBarContainer}>
        <div className={styles.tabWrapper}>
          <div className={styles.tabButtonWrapper}>
            <div
              className={`${styles.tabButton} ${
                activeTab === "messages" ? styles.activeTab : ""
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
          </div>

          <div className={styles.tabButtonWrapper}>
            <div
              className={`${styles.tabButton} ${
                activeTab === "schedule" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabClick("schedule")}
            >
              <img
                className={styles.calendarIcon}
                src={activeTab === "calendar" ? calendarActive : calendar}
                alt="먼슬리"
              />
              <span className={styles.tabLabel}>먼슬리</span>
            </div>
          </div>
        </div>
      </div>

      {/* 중첩 라우트 렌더링 위치 */}
      <div className={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
};

export default Channellndex;

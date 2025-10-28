import { useState } from "react";
import styles from "./MessagesIndex.module.css";
import Attendance from "./Components/attendance/Attendance";
import ChannelName from "./Components/channelName/ChannelName";
import ChatBox from "./Components/chatBox/ChatBox";
import CompletedChannel from "./Components/completedChannel/CompletedChannel";
import FileBox from "./Components/fileBox/FileBox";
import OutBox from "./Components/outBox/OutBox";
import addIcon from "./icon/Add.svg";
import addIconActive from "./icon/Add-active.svg";

const MessagesIndex = () => {
  const [isActive, setIsActive] = useState(false);
  // 채널 seq값 반환받을 준비
  const [selectedSeq, setSelectedSeq] = useState(null);

  const handleChannelClick = (seq) => {
    setSelectedSeq(seq); // 클릭된 채널 seq 저장
  };

  const handleClick = () => {
    setIsActive(true);
    alert("채널 추가 클릭");
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.leftContentWrapper}>
          <Attendance onChannelClick={handleChannelClick}/>
          <ChannelName onChannelClick={handleChannelClick}/>
          <CompletedChannel onChannelClick={handleChannelClick}/>
        </div>

        {/* 아래 고정된 추가 버튼 */}
        <div className={styles.buttonWrapper}>
          <button
            type="button"
            className={styles.addParent}
            onClick={handleClick}
          >
            <img
              className={`${styles.addIcon} ${styles.defaultIcon}`}
              src={addIcon}
              alt="추가 아이콘 기본"
            />
            <img
              className={`${styles.addIcon} ${styles.hoverIcon}`}
              src={addIconActive}
              alt="추가 아이콘 호버"
            />
            <span className={styles.chatRoom}>채널 추가</span>
          </button>{" "}
        </div>
      </div>

      <div className={styles.centerColumn}>
       {/* 채팅방을 클릭해서 seq 반환시에만 랜더링 */}
        <ChatBox seq={selectedSeq}/>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.fileBox}>
          <FileBox />
        </div>
        <div className={styles.outBox}>
          <OutBox />
        </div>
      </div>
    </div>
  );
};

export default MessagesIndex;

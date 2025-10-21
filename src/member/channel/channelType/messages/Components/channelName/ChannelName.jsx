import { useState } from "react";
import styles from "./ChannelName.module.css";
import collapse from "./icon/Collapse Arrow.svg";

const rooms = [
  "여름 프로젝트",
  "신제품 개발",
  "가을 이벤트 기획",
  "000 / 팀장(다른팀 팀장)"
];

const ChannelName = () => {
  const [selected, setSelected] = useState("여름 프로젝트");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>채널 방</div>
        <img src={collapse} className={styles.icon} alt="화살표" />
      </div>
      <div className={styles.rooms}>
        {rooms.map((room) => (
          <button
            key={room}
            className={`${styles.room} ${
              selected === room ? styles.selected : ""
            }`}
            onClick={() => setSelected(room)}
          >
            <span className={styles.hash}>#</span> {room}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelName;

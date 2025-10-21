import { useState } from "react";
import styles from "./ChannelName.module.css";
import collapse from "./icon/Collapse Arrow.svg";
import useChannelName from "./useChannelName";



const ChannelName = () => {
  const {
    rooms, chatSeq,
    setChatSeq
  } = useChannelName();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>채널 방</div>
        <img src={collapse} className={styles.icon} alt="화살표" />
      </div>
      <div className={styles.rooms}>
        {rooms.map((room) => (
          <button
            key={room.chat_seq}
            className={`${styles.room} ${chatSeq === room.chat_seq ? styles.selected : ""
              }`}
            onClick={() => setChatSeq(room.chat_seq)}
          >
            <span className={styles.hash}>#</span> {room.chat_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelName;

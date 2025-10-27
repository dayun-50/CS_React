import { useState } from "react";
import styles from "./ChannelName.module.css";
import collapse from "./icon/Collapse Arrow.svg";
import useChannelName from "./useChannelName";



const ChannelName = ({ onChannelClick }) => {
  const {
    rooms, chatSeq,
    handleClickChat
  } = useChannelName(onChannelClick);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>채널 방</div>
        <img src={collapse} className={styles.icon} alt="화살표" />
      </div>
      <div className={styles.rooms}>
        {rooms.map((room, i) => (
          <button
            key={i}
            className={`${styles.room} ${chatSeq === room.chat_seq ? styles.selected : ""
              }`}
            onClick={() => handleClickChat(room.chat_seq)}
          >
            <span className={styles.hash}>#</span> {room.chat_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelName;

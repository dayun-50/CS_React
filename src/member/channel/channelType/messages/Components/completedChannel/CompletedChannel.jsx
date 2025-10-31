import { useState } from "react";
import styles from "./CompletedChannel.module.css";
import useCompletedChannel from "./useCompletedChannel";

const CompletedChannel = ({ onChannelClick, selectedSeq, isOn }) => {

  const {
    completedList, chatSeq, 
    handleClickChat
  } = useCompletedChannel(onChannelClick, isOn);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>완료된 채널</span>
      </div>

      <ul className={styles.list}>
        {completedList.map((item) => (
          <li
            key={item.chat_seq}
            className={`${styles.item} ${selectedSeq === item.chat_seq ? styles.selected : ""
              }`}
            onClick={() => handleClickChat(item.chat_seq)}
          >
            {item.chat_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedChannel;

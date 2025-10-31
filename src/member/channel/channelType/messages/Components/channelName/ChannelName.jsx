import { useEffect, useState } from "react";
import styles from "./ChannelName.module.css";
import collapse from "./icon/Collapse Arrow.svg";
import useChannelName from "./useChannelName";



const ChannelName = ({ onChannelClick, alertRooms , setAlertRooms, selectedSeq, newRooms, isOn, setDeptSeq }) => {

  const {
    rooms, chatSeq,
    handleClickChat
  } = useChannelName(onChannelClick, alertRooms , setAlertRooms, newRooms, isOn, setDeptSeq);

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
            className={`${styles.room}
                        ${selectedSeq == room.chat_seq ? styles.selected : ""}
                        ${alertRooms.find(ar => ar.chat_seq === room.chat_seq) ? styles.alert : ""}
                        ${room.alert == "y"? styles.alert : ""}`}
            onClick={() => handleClickChat(room.chat_seq)}>
                <span className={styles.hash}>#</span>{room.chat_name}
          </button>
        ))} 
      </div>
    </div>
  );
};

export default ChannelName;

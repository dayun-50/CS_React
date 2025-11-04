import { useState } from "react";
import styles from "./Attendance.module.css";
import collapse from "./icon/Collapse Arrow.svg";
import useAttendance from "./useAttendance";

const Attendance = ({ onChannelClick, alertRooms , setAlertRooms, selectedSeq}) => {
  const {
    members, chatSeq,
    handleClickChat
  } = useAttendance(onChannelClick, alertRooms, setAlertRooms);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>부서 개인 채널</div>
        <img src={collapse} className={styles.icon} alt="화살표" />
      </div>

      <div className={styles.members}>
        {members.map((member, i) => (
          <button
            key={i}
            className={`${styles.member} ${selectedSeq == member.chat_seq ? styles.selected : ""
              } ${alertRooms.find(ar => ar.chat_seq === member.chat_seq)? styles.alert : ""}
              ${member.alert == "y"? styles.alert : ""}`}
            onClick={()=>handleClickChat(member.chat_seq)}
          >
            {member.name} ({member.level_code})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Attendance;

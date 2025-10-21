import { useState } from "react";
import styles from "./Attendance.module.css";
import collapse from "./icon/Collapse Arrow.svg";
import useAttendance from "./useAttendance";

const Attendance = () => {

  const {
    members, chatSeq,
    setChatSeq
  } = useAttendance();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>채널 참여 원</div>
        <img src={collapse} className={styles.icon} alt="화살표" />
      </div>

      <div className={styles.members}>
        {members.map((member) => (
          <button
            key={member.chat_seq}
            className={`${styles.member} ${chatSeq === member.chat_seq ? styles.selected : ""
              }`}
            onClick={() => setChatSeq(member.chat_seq)}
          >
            {member.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Attendance;

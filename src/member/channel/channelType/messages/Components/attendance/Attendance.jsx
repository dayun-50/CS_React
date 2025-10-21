import { useState } from "react";
import styles from "./Attendance.module.css";
import collapse from "./icon/Collapse Arrow.svg";

const Attendance = () => {
  const [selectedId, setSelectedId] = useState(null);

  const members = [
    { id: 1, name: "ㅇㅇㅇ / 팀장" },
    { id: 2, name: "ㅇㅇㅇ / 사원" },
    { id: 3, name: "ㅇㅇㅇ / 대리" },
    { id: 4, name: "ㅇㅇㅇ / 과장" },
    { id: 5, name: "ㅇㅇㅇ / 사원" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>채널 참여 원</div>
        <img src={collapse} className={styles.icon} alt="화살표" />
      </div>

      <div className={styles.members}>
        {members.map((member) => (
          <button
            key={member.id}
            className={`${styles.member} ${
              selectedId === member.id ? styles.selected : ""
            }`}
            onClick={() => setSelectedId(member.id)}
          >
            {member.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Attendance;

import { useState } from "react";
import styles from "./CompletedChannel.module.css";

const CompletedChannel = () => {
  const completedList = [
    "여름 프로젝트",
    "신제품 개발",
    "가을 이벤트 기획",
    "추가 채널 1",
    "추가 채널 2",
    "추가 채널 3",
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>완료된 채널</span>
      </div>

      <ul className={styles.list}>
        {completedList.map((item, index) => (
          <li
            key={index}
            className={`${styles.item} ${
              selected === item ? styles.selected : ""
            }`}
            onClick={() => setSelected(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedChannel;

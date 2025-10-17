import { IoIosArrowForward } from "react-icons/io";
import styles from "./MySchedule.module.css";

function MySchedule() {
  return (
    <div className={styles.container}>
      {/* 오른쪽 박스 */}
      <div className={styles.rightBox}>
        {/* 상단 타이틀 */}
        <div className={styles.header}>
          <h1 className={styles.title}>다가오는 일정</h1>
        </div>

        {/* 일정 리스트 */}
        <div className={styles.scheduleList}>
          {/* 1번째 일정 */}
          <div className={styles.scheduleItem}>
            <div className={styles.info}>
              <div className={styles.child} />
              <div className={styles.text}>
                <div className={styles.eventTitle}>ㅇㅇㅇ님 휴가</div>
                <div className={styles.eventDate}>10월 14 - 27</div>
              </div>
            </div>
            <div className={styles.extra}>
              <button className={styles.daysLeft}>2일 뒤</button>
              <IoIosArrowForward
                style={{ width: "30px", height: "30px", color: "gray" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MySchedule;

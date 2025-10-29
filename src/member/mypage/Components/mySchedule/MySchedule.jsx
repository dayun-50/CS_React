import { IoIosArrowForward } from "react-icons/io";
import styles from "./MySchedule.module.css";
import useMySchedule from "./useMySchedule";

function MySchedule({selectedSeq, setSelectedSeq}) {
  const {
    scheduleData, schedulePage
  } = useMySchedule(selectedSeq, setSelectedSeq);


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
          {scheduleData.map((sch, idx) => (
            <div className={styles.scheduleItem} key={idx}>
              <div className={styles.info}>
                <div className={styles.child} style={{ backgroundColor: sch.color }}/>
                <div className={styles.text}>
                  <div className={styles.eventTitle}>{sch.title}</div>
                  <div className={styles.eventDate}>{sch.start_at} - {sch.end_at}</div>
                </div>
              </div>
              <div className={styles.extra}>
                <button className={styles.daysLeft} style={{ backgroundColor: sch.color }}>{sch.diffDays}일 남음</button>
                <IoIosArrowForward
                  style={{ width: "30px", height: "30px", color: "gray" }}
                  onClick={()=>schedulePage(sch.chat_seq)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MySchedule;

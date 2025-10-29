import { useEffect, useState } from "react";
import styles from "./Hour.module.css";
import arrow from "./icon/arrow.svg";
import { caxios } from "../../../../config/config";

function Hour({ setReloadWeekly, setReloadIssue }){
  // 1. 출근 퇴근 버튼클릭가능 상태변수
  const [disabled, setDisabled] = useState([false, true]); // [출근, 퇴근]
  const [startTime, setStartTime] = useState(' -- : -- ');
  const [endTime, setEndTime] = useState(' -- : -- ');
  const [startTimeRaw, setStartTimeRaw] = useState(null); // ISO 원본 저장

  // 2. 시간 원하는 형태로 포맷하기 (한국시간 ISO 타임으로)
    const timeFormatKST = (isoString) => {
      const date = new Date(isoString); // 이미 KST 기준이면 보정 불필요
      const hour = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${hour}:${min}`;
    };

  // 3.DB에서 오늘 근태 상태 조회하기
  const handleStatus = () => {
    //const today = getTodayISO();
    console.log("캐시오스 실행")
    caxios.get(`/workhour`).then((resp) => {
      const data = resp.data;
      console.log(data);
      if (data.work_at) {
        setStartTime(timeFormatKST(new Date(data.work_at)))
        setStartTimeRaw(data.work_at);
        }//디비에 시작시간 잇다면 ui에도 뿌릴수있게 설정
      if (data.leave_at) setEndTime(timeFormatKST(new Date(data.leave_at))); //디비에 끝나는 시간 있다면 ui에도 뿌릴수 있게 설정

      if (data.work_at && !data.leave_at) { ///둘다 없다면
        setDisabled([true, false]); // 출근만 됨 → 퇴근 버튼만 활성화
      } else if (data.work_at && data.leave_at) {
        setDisabled([true, true]); // 둘 다 완료 → 둘 다 비활성화
      } else {
        setDisabled([false, true]); // 아직 출근 안 함 → 출근 버튼만 활성화
      }
    });
  };

  //4. 페이지 마운팅 시 세팅
  useEffect(() => {
    handleStatus();
  }, []);

    // 5. 출근 버튼 클릭 시
  const handleStartTime = () => {
    const now = new Date(); 
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);// 한국 시간으로 보정 보정
    const timestamp = kst.toISOString(); // 한국 시간으로 보정 보정한 문자열
    caxios.post("/workhour/start", { work_at: timestamp }).then(() => {
      alert("출근이 완료되었습니다!");
      setReloadIssue((prev) => !prev); // Monthly Issue 갱신
      handleStatus(); // 출근 후 상태 갱신
    });
  };

  // 6. 퇴근 버튼 클릭 시
  const handleEndTime = () => {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);// 한국 시간으로 보정 보정
    const timestamp = kst.toISOString(); // 한국 시간으로 보정 보정한 문자열
    caxios.post("/workhour/end", { work_at: startTimeRaw, leave_at: timestamp }).then(() => {
      alert("퇴근이 완료되었습니다!");
      handleStatus(); // 퇴근 후 상태 갱신
      setReloadIssue((prev) => !prev); // Monthly Issue 갱신
      setReloadWeekly((prev) => !prev); // WeeklyTotal 갱신
    });
  };

    return (
    <div className={styles.container}>
      <h2 className={styles.title}>근태</h2>

      <div className={styles.timeSection}>
        <div className={styles.timeItem}>
          <div className={styles.label}>출근시간</div>
          <div className={styles.timeText}>{startTime}</div>
        </div>

        <img src={arrow} className={styles.separator} alt="출퇴근 화살표" />

        <div className={styles.timeItem}>
          <div className={styles.label}>퇴근시간</div>
          <div className={styles.timeText}>{endTime}</div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${disabled[0] ? styles.disabled : styles.active}`} onClick={handleStartTime} disabled={disabled[0]} >
            출근</button>
          <button className={`${styles.button} ${disabled[1] ? styles.disabled : styles.active}`} onClick={handleEndTime} disabled={disabled[1]}>
            퇴근
          </button>
      </div>
    </div>
);
}

export default Hour;
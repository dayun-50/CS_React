import { useEffect, useState } from "react";
import styles from "./WeeklyWork.module.css"
import { caxios } from "../../../../config/config";

function WeeklyWork ({reloadWeekly }){


  //1. 주간 토탈, 초과근무 저장 상태변수
    const [weeklyTotal, setWeekLyTotal] = useState("");
    const [overTime, setOverTime] = useState("");
  
  //2. 오늘날자로 주간 근무시간 받아오기  
      useEffect(() => {
        caxios.get(`/workhour/weekly`).then((resp) => {
            //백엔드로 오늘 날짜 계산후 주간 근무 시간 "분으로" 받아오기
            console.log("토탈 주간 누적 시간 가져오기",resp.data)
            if (resp.data > 2400) {// 초과 근무 시간 있다면
                const overHour = Math.floor((resp.data - 2400) / 60);
                const overMin = (resp.data - 2400) % 60;
                setOverTime(`${overHour}시간 ${overMin}분`);
                setWeekLyTotal("40시간 00분");
                return;
            }

            const hour = Math.floor(resp.data / 60);
            const min = resp.data % 60;
            setWeekLyTotal(`${hour}시간 ${min}분`);
        })
    }, [reloadWeekly]);



return (
    <div className={styles.container}>
      <div className={styles.header}>
        <b className={styles.title}>주간누적</b>
        <div className={styles.time}>{weeklyTotal}</div>
      </div>
      <div className={styles.overtimeSection}>
        <div className={styles.overtimeLabelWrapper}>
          <div className={styles.overtimeIndicator} />
          <div className={styles.overtimeLabel}>초과근무</div>
        </div>
        <div className={styles.overtimeTime}>{overTime}</div>
      </div>
    </div>
);

}

export default WeeklyWork;
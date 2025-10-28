import styles from "./Schedule.module.css";
import ScheduleBox from "./Components/scheduleBox/ScheduleBox";
import ToggleBox from "./Components/toggleBox/ToggleBox";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const Schedule = ({ selectedSeq }) => {
  // 각 멤버 클릭 상태(on/off)를 배열로 관리
  const [selectedEmails, setSelectedEmails] = useState([]);
  if (!selectedSeq) return null;

  return (
    <div className={styles.schedulebox}>
      <div className={styles.calender}>
        {selectedSeq && <ScheduleBox seq={selectedSeq} selectedEmails={selectedEmails} setSelectedEmails={setSelectedEmails}/>}
      </div>

      <div className={styles.teammember}>
        {selectedSeq && <ToggleBox seq={selectedSeq} selectedEmails={selectedEmails} setSelectedEmails={setSelectedEmails}/>}
      </div>

    </div>
  );
};

export default Schedule;
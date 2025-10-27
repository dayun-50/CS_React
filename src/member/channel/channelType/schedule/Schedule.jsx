import styles from "./Schedule.module.css";
import ScheduleBox from "./Components/scheduleBox/ScheduleBox";
import ToggleBox from "./Components/toggleBox/ToggleBox";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const Schedule = ({ selectedSeq }) => {
  const [selectMemberEvent, setSelectMemberEvent] = useState([]);
  if (!selectedSeq) return null; 

  return (
    <div className={styles.schedulebox}>
      <div className={styles.calender}>
        {selectedSeq && <ScheduleBox seq={selectedSeq}/>}
      </div>

      <div className={styles.teammember}>
        {selectedSeq && <ToggleBox seq={selectedSeq} selectMemberEvent={selectMemberEvent} setSelectMemberEvent={setSelectMemberEvent}/>}
      </div>

    </div>
  );
};

export default Schedule;
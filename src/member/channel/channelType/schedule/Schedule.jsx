import styles from "./Schedule.module.css";
import ScheduleBox from "./Components/scheduleBox/ScheduleBox";
import ToggleBox from "./Components/toggleBox/ToggleBox";

const Schedule = () => {
  return (
    <div className={styles.schedulebox}>
      
      <div className={styles.calender}>
          <ScheduleBox />
      </div>

      <div className={styles.teammember}>
          <ToggleBox />
      </div>

    </div>
  );
};

export default Schedule;
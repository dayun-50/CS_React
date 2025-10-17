import styles from "./Mypage.module.css";
import MyInform from "./Components/myInform/MyInform";
import MySchedule from "./Components/mySchedule/MySchedule";

function Mypage() {
  return (
    <div className={styles.fullbox}>
      <div className={styles.myInform}>
      <MyInform />
      </div>
      <div className={styles.mySchedule}>
      <MySchedule />
      </div>
    </div>
  );
}

export default Mypage;
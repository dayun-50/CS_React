import PageNaviBar from "../navis/pagenavibar/PageNaviBar";
import Hour from "./Components/hour/Hour";
import Issue from "./Components/issue/Issue";
import WeeklyWork from "./Components/weeklyWork/WeeklyWork";
import VacationLeft from "./Components/vacationLeft/VacationLeft";
import styles from "./WorkHourIndex.module.css";
import VacationList from "./Components/vacationList/VacationList";
import { useState } from "react";



function WorkHourIndex(){
    // 주간 업무 누적시간 재로딩용 (true, false값은 의미 없은, 단순 상태 변화 감지용)
    const [reloadWeekly, setReloadWeekly] = useState(false);

    // 월간 이슈 재로딩용 (true, false값은 의미 없은, 단순 상태 변화 감지용)
    const [reloadIssue, setReloadIssue] = useState(false);


    return (
    <div className={styles.frameParent}>
      <div className={styles.attendance}>
        <Hour setReloadWeekly={setReloadWeekly} setReloadIssue={setReloadIssue}/>
        <WeeklyWork reloadWeekly={reloadWeekly}/>
        <Issue reloadIssue={reloadIssue}/>
      </div>
      <div className={styles.annual}>
        <VacationLeft />
        <VacationList />
      </div>
    </div>

);
}

export default WorkHourIndex;
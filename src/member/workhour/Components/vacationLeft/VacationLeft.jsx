import { useEffect, useState } from "react";
import styles from "./VacationLeft.module.css";
import { caxios } from "../../../../config/config";

function VacationLeft() {
  const [issue, setIssue] = useState([
    { label: "잔여 연차", count: 0, carriedOver: 0 },
    { label: "사용 연차", count: 0 },
    { label: "총 연차", count: 0 },
  ]);

  useEffect(() => {
    caxios.get(`/pto`).then((resp) => {
    const dto = resp.data.dto;
    console.log("남은휴가", dto);
    const totalPto = resp.data.totalPto ?? 0;
    const remainingPto = dto.remaining_pto ?? 0;

    const carriedOver = remainingPto > totalPto ? remainingPto - totalPto : 0;
    const effectiveTotal = Math.max(totalPto, remainingPto);
    const usedPto = Math.max(effectiveTotal - remainingPto, 0);

      setIssue([
        { label: "잔여 연차", count: remainingPto, carriedOver },
        { label: "사용 연차", count: usedPto },
        { label: "총 연차", count: totalPto }
      ]);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>연차 현황</h2>

      <div className={styles.statusBox}>
        {issue.map((item, idx) => (
          <div key={idx} className={styles.statusItem}>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.value}>
              {item.label === "잔여 연차" && item.carriedOver > 0 ? (
                  <>
                    {item.count}일 <span className={styles.smallText}>(이월 {item.carriedOver}일)</span>
                  </>
                ) : (
                  `${item.count}일`
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VacationLeft;

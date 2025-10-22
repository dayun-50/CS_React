import { useEffect, useState } from 'react';
import styles from './Issue.module.css';
import { caxios } from '../../../../config/config';

function Issue({reloadIssue}) {
  const [items, setItems] = useState([
    { label: "지각", count: 0 },
    { label: "조퇴", count: 0 },
    { label: "결근", count: 0 },
  ]);

  useEffect(() => {
    caxios.get(`/workhour/issue`).then((resp) => {
      console.log(resp.data);
      const data = resp.data; // 예: { lateness: 3, leave_early: 5, absence: 1 }

      setItems([
        { label: "지각", count: data.LATENESS || 0 },
        { label: "조퇴", count: data.LEAVE_EARLY || 0 },
        { label: "결근", count: data.ABSENCE || 0 },
      ]);
    });
  }, [reloadIssue]);

  return (
    <div className={styles.container}>
      {items.map(({ label, count }) => (
        <div key={label} className={styles.item}>
          <div className={styles.title}>{label}</div>
          <div className={styles.countBox}>
            <div className={styles.count}>{count}</div>
            <div className={styles.unit}>회</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Issue;

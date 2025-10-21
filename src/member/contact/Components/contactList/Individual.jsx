import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { caxios } from "../../../../config/config";

const Individual = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    caxios
      .get("/contact/list") // 전체 주소록 받아오고
      .then((res) => {
        // 개인용만 필터링
        const individualContacts = res.data.filter(
          (item) => item.contact_group === "개인"
        );
        setContacts(individualContacts);
      })
      .catch((err) => {
        console.error("개인용 주소록 로딩 실패:", err);
      });
  }, []);

  return (
    <div className={styles.contactList}>
      <h2>개인용 주소록 리스트</h2>

      {contacts.length === 0 && <p>개인용 주소록이 없습니다.</p>}

      {contacts.map((item, index) => (
        <div key={item.contact_seq} className={styles.tableRow}>
          <div className={`${styles.cell} ${styles.number}`}>{index + 1}</div>
          <div className={`${styles.cell} ${styles.name}`}>{item.name}</div>
          <div className={`${styles.cell} ${styles.company}`}>
            {item.company_name || "N/A"}
          </div>
          <div className={`${styles.cell} ${styles.email}`}>{item.email}</div>
          <div className={`${styles.cell} ${styles.phone}`}>{item.phone}</div>
        </div>
      ))}
    </div>
  );
};

export default Individual;

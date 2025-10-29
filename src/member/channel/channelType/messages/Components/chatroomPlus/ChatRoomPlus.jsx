import { useState } from "react";
import styles from "./ChatRoomPlus.module.css";

const ChatRoomPlus = ({ onClose, onSelect }) => {
  const recipients = [
    "김철수 (개발팀)",
    "이영희 (디자인팀)",
    "박민수 (기획팀)",
  ];

  const [selected, setSelected] = useState([]);

  const handleAdd = () => {
    if (selected.length === 0) {
      alert("선택된 사람이 없습니다.");
      return;
    }
    onSelect(selected);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h1>채널 추가</h1>

        <div className={styles.peoplemail}>
          <label className={styles.labelpeople}>대화상대 선택</label>
          <input type="text" placeholder="이름 또는 이메일을 입력하세요" />
        </div>

        <label className={styles.addlist}>주소록 리스트</label>

        <div className={styles.list}>
          {recipients.map((r, idx) => (
            <label key={idx} className={styles.checkItem}>
              <input
                type="checkbox"
                value={r}
                checked={selected.includes(r)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (e.target.checked) {
                    setSelected([...selected, value]);
                  } else {
                    setSelected(selected.filter((item) => item !== value));
                  }
                }}
              />
              <span className={styles.customCheck}></span>
              <span className={styles.text}>{r}</span>
            </label>
          ))}
        </div>

        <div className={styles.modalButtons}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleAdd}>추가</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPlus;

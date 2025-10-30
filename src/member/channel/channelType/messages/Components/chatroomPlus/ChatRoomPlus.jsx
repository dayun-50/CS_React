import { useState } from "react";
import styles from "./ChatRoomPlus.module.css";
import useChatRoomPlus from "./useChatRoomPlus";
import { caxios } from "../../../../../../config/config";

const ChatRoomPlus = ({ onClose, onSelect }) => {
  const [selected, setSelected] = useState([]);
  const { recipients, list } = useChatRoomPlus(selected);

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
          <input type="text" value={list} placeholder="추가된 친구" disabled />
        </div>

        <label className={styles.addlist}>주소록 리스트</label>

        <div className={styles.list}>
          {recipients.map((r, idx) => (
            <label key={idx} className={styles.checkItem}>
              <input
                type="checkbox"
                value={r.contact_seq}
                checked={selected.includes(r.contact_seq)}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (e.target.checked) {
                    setSelected([...selected, value]);
                  } else {
                    setSelected(selected.filter((item) => item != value));
                  }
                }}
              />
              <span className={styles.customCheck}></span>
              <span className={styles.text}>{r.name} ({r.contact_group})</span>
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

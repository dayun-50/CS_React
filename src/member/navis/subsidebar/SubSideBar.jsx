import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SubSideBar.module.css";
import addicon from "./icon/Add.svg";

function SubSideBar({ data = {}, onTabChange }) {
  const { btns, navigateFunc, text, selectedBtn } = data;
  const navigate = useNavigate();

  const handleToPath = (path, name) => {
    navigate(path);
    if (onTabChange) onTabChange(name);
  };

  return (
    <div className={styles.submenuWrapper}>
      <div className={styles.addParent} onClick={navigateFunc}>
        <img src={addicon} className={styles.addIcon} alt="작성 추가아이콘" />
        <div className={styles.div}>{text}</div>
      </div>

      <div className={styles.tabWrapper}>
        {btns.map((btn) => (
          <div
            key={btn.name}
            className={`${styles.tab} ${selectedBtn === btn.name ? styles.active : ""}`}
            onClick={() => handleToPath(btn.path, btn.name)}
          >
            {btn.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubSideBar;

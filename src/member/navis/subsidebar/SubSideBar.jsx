import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SubSideBar.module.css";
import addicon from "./icon/Add.svg";

function SubSideBar({ data = {} }) {
  const { btns, navigateFunc, text } = data;
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  // URL 기반으로 선택된 버튼 결정
  const selectedBtn =
    btns.find((btn) => btn.path === currentPath)?.name ||
    // 최상위 경로 예외 처리: "/mail"이면 "전체" 선택
    btns.find((btn) => btn.path === currentPath.split("/").slice(0, 2).join("/"))?.name ||
    btns[0]?.name;

  return (
    <div className={styles.submenuWrapper}>
      {/* 작성하기 버튼 */}
      <div className={styles.addParent} onClick={navigateFunc}>
        <img src={addicon} className={styles.addIcon} alt="작성 추가아이콘" />
        <div className={styles.div}>{text}</div>
      </div>

      {/* 버튼 탭 */}
      <div className={styles.tabWrapper}>
        {btns.map((btn) => (
          <div
            key={btn.name}
            className={`${styles.tab} ${selectedBtn === btn.name ? styles.active : ""}`}
            onClick={() => navigate(btn.path)}
          >
            {btn.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubSideBar;

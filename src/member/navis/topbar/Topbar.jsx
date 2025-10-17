import styles from "./Topbar.module.css";
import logo from "./icon/log 3.svg";
import userIcon from "./icon/User.svg";
import notificationIcon from "./icon/Notification.svg";
import meun from "./icon/Menu.svg";

const Topbar = ({ onMenuClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        {/* 로고 아이콘 */}
        <div className={styles.log}>
          <img src={logo} alt="logo" className={styles.logIcon} />
          <div className={styles.cs}>cs</div>
        </div>

        <div className={styles.iconGroup}>
          {/* 알림 아이콘 */}
          <img src={userIcon} alt="User" className={styles.user} />
          {/* 사람 아이콘 */}
          <img
            src={notificationIcon}
            alt="Notification"
            className={styles.notification}
          />
          {/* 햄버거 아이콘 - 모바일 전용 */}
          <button
            className={styles.hamburger}
            onClick={() => {
              console.log("햄버거 클릭됨"); // 작동하는지 확인용
              onMenuClick();
            }}
          >
            <img src={meun} alt="menu" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

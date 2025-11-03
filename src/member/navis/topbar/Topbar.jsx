import styles from "./Topbar.module.css";
import logo from "./icon/log 3.svg";
import userIcon from "./icon/User.svg";
import notificationIcon from "./icon/Notification.svg";
import meun from "./icon/Menu.svg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동용
import useAuthStore from "../../../store/useAuthStore"; // ✅ 로그아웃용 (Sidebar와 동일)

const Topbar = ({ onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuthStore((state) => state);

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.id !== "userIcon"
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ 드롭다운 항목 클릭 시 처리
  const handleDropdownClick = (action) => {
    if (action === "mypage") {
      navigate("/mypage"); // 마이페이지 이동
    } else if (action === "logout") {
      logout();
      navigate("/"); // 로그아웃 후 로그인 페이지로 이동
    }
    setIsDropdownOpen(false); // 닫기
  };

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
          <img
            src={notificationIcon}
            alt="Notification"
            className={styles.notification}
          />

          {/* 유저 아이콘 + 드롭다운 */}
          <div className={styles.userWrapper} ref={dropdownRef}>
            <img
              src={userIcon}
              alt="User"
              id="userIcon"
              className={styles.user}
              onClick={toggleDropdown}
            />

            {isDropdownOpen && (
              <div className={styles.userDropdown}>
                <div onClick={() => handleDropdownClick("mypage")}>마이페이지</div>
                <div onClick={() => handleDropdownClick("logout")}>로그아웃</div>
              </div>
            )}
          </div>

          {/* 햄버거 아이콘 (모바일용!!) */}
          <button
            className={styles.hamburger}
            onClick={() => {
              console.log("햄버거 클릭됨");
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

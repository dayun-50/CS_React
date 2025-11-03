import clock from "./icon/Clock.svg";
import clockActive from "./icon/Clock-active.svg"; // 근태관리

import message from "./icon/Messages.svg";
import messageActive from "./icon/Messages-active.svg"; // 메신저

import board from "./icon/Popup.svg";
import boardActive from "./icon/Popup-active.svg"; // 게시판

import pay from "./icon/Sign Document.svg";
import payActive from "./icon/Sign Document-active.svg"; // 전자결재

import mail from "./icon/Envelope.svg";
import mailActive from "./icon/Envelope-active.svg"; // 메일

import contact from "./icon/Contacts.svg";
import contactActive from "./icon/Contacts-active.svg"; // 주소록

import user from "./icon/User.svg";
import userActive from "./icon/User-active.svg"; // 회원 정보

import logout from "./icon/Logout.svg";
import logoutActive from "./icon/Logout-active.svg"; // 로그아웃
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

// 메뉴 정의
const menus = [
  { name: "근태관리", icon: clock, activeIcon: clockActive, path: "/" },
  { name: "채널", icon: message, activeIcon: messageActive, path: "/channel" },
  { name: "게시판", icon: board, activeIcon: boardActive, path: "/board" },
  { name: "전자결재", icon: pay, activeIcon: payActive, path: "/approval" },
  { name: "메일", icon: mail, activeIcon: mailActive, path: "/mail" },
  { name: "주소록", icon: contact, activeIcon: contactActive, path: "/contact" },
];

const bottomMenus = [
  { name: "회원 정보", icon: user, activeIcon: userActive, path: "/mypage" },
  { name: "로그아웃", icon: logout, activeIcon: logoutActive, path: "/logout" },
];

const getMenuNameByPath = (path) => {
  // 메뉴들을 path 길이 내림차순으로 정렬
  const allMenus = [...menus, ...bottomMenus].sort((a, b) => b.path.length - a.path.length);
  const menu = allMenus.find((m) => path.startsWith(m.path));
  return menu ? menu.name : "";
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore((state) => state);

  const [activeMenu, setActiveMenu] = useState(getMenuNameByPath(location.pathname));
  const [hoveredMenu, setHoveredMenu] = useState(null);

  // 경로가 바뀌면 activeMenu 자동 변경
  useEffect(() => {
    setActiveMenu(getMenuNameByPath(location.pathname));
  }, [location.pathname]);

  const handleClick = (menu) => {
    if (menu.name === "로그아웃") {
      logout();
      navigate("/");
      return;
    }
    navigate(menu.path);
  };

  const renderIcon = (menu) => {
    if (hoveredMenu === menu.name) return menu.activeIcon;
    if (activeMenu === menu.name) return menu.activeIcon;
    return menu.icon;
  };

  return (
    <div className={styles.leftbar}>
      <div className={styles.topMenu}>
        {menus.map((menu) => (
          <div
            key={menu.name}
            className={`${styles.menuItem} ${
              activeMenu === menu.name ? styles.active : ""
            }`}
            onClick={() => handleClick(menu)}
            onMouseEnter={() => setHoveredMenu(menu.name)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <img src={renderIcon(menu)} alt={menu.name} className={styles.icon} />
            <span className={styles.label}>{menu.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.bottomMenu}>
        {bottomMenus.map((menu) => (
          <div
            key={menu.name}
            className={`${styles.menuItem} ${
              activeMenu === menu.name ? styles.active : ""
            }`}
            onClick={() => handleClick(menu)}
            onMouseEnter={() => setHoveredMenu(menu.name)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <img src={renderIcon(menu)} alt={menu.name} className={styles.icon} />
            <span className={styles.label}>{menu.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

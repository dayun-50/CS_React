// 기본 아이콘 + 클릭 시 변경될 흰색 아이콘
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
import { useState } from "react";
import styles from "./Sidebar.module.css"
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";









// 로그인되면 path="/"인 상태로 고정됨, 즉 근태관리가 첫페이지면 path가 "/"이상태일것
const menus = [
  { name: "근태관리", icon: clock, activeIcon: clockActive, path: "/" },
  { name: "채널", icon: message, activeIcon: messageActive, path: "/channel" },
  { name: "게시판", icon: board, activeIcon: boardActive, path: "/board" },
  { name: "전자결재", icon: pay, activeIcon: payActive, path: "/approval" },
  { name: "메일", icon: mail, activeIcon: mailActive, path: "/mail" },
  { name: "주소록", icon: contact, activeIcon: contactActive, path: "/contacts" },
];

const bottomMenus = [
  { name: "회원 정보", icon: user, activeIcon: userActive, path: "/mypage" },
  { name: "로그아웃", icon: logout, activeIcon: logoutActive, path: "/logout" }, // logout은 경로이동이 아님 아래에서 분기점 따로 빼두겟음
];


const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("근태관리");
  const [hoveredMenu, setHoveredMenu] = useState(null); // hover일때도 아이콘 변경 효과용
  // const navigate = useNavigate(); // 페이지 이동용

  // const handleClick = (menu) => {
  //   setActiveMenu(menu.name);
  //   if(menu.path=="/logout"){로그아웃은 어스스토어에서 로그아웃 메소드 꺼내서 logout(); 후 로그인 페이지로 나가도록 navigate("/") return;}
  //   navigate(menu.path); // 다른 애들은 해당 경로로 이동
  // };

  const navigate = useNavigate();
  const { logout } = useAuthStore(state => state);

  // 로그아웃 기능 구현
  const handleClick = (menu) => {
    console.log("클릭된 메뉴:", menu.name);
    if (menu.name === "로그아웃") {
      logout();
      navigate("/");
    }else if(menu.name === "회원 정보"){
      navigate(menu.path);
    }
  }


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
            className={`${styles.menuItem} ${activeMenu === menu.name ? styles.active : ""
              }`}
            onClick={() => setActiveMenu(menu.name)} // onClick={() => handleClick(menu) : 로 변경해서 이동 경로 넣어주기
            onMouseEnter={() => setHoveredMenu(menu.name)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <img
              src={renderIcon(menu)}
              alt={menu.name}
              className={styles.icon}
            />
            <span className={styles.label}>{menu.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.bottomMenu}>
        {bottomMenus.map((menu) => (
          <div
            key={menu.name}
            className={`${styles.menuItem} ${activeMenu === menu.name ? styles.active : ""
              }`}
            onClick={() => handleClick(menu)}
            onMouseEnter={() => setHoveredMenu(menu.name)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <img
              src={renderIcon(menu)}
              alt={menu.name}
              className={styles.icon}
            />
            <span className={styles.label}>{menu.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

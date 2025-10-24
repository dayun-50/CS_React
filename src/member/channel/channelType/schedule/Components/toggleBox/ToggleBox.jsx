import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import styles from "./ToggleBox.module.css";

const ToggleBox = () => {
  const members = [
    { name: "OOO", role: "팀장" },
    { name: "OOO", role: "부장" },
    { name: "OOO", role: "대리" },
    { name: "OOO", role: "사원" },
  ];

  // 각 멤버 클릭 상태(on/off)를 배열로 관리
  const [selected, setSelected] = useState(Array(members.length).fill(false));

  const handleClick = (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index]; // 클릭하면 토글
    setSelected(newSelected);
  };

  return (
    <div className={styles.calenderright}>
      <div className={styles.tgtitle}>
        <div className={styles.toggletitle}>
          부서원 <IoIosArrowDown size={24} />
        </div>
      </div>

      <div className={styles.tgmember}>
        {members.map((member, index) => (
          <div
            className={styles.tgmb}
            key={index}
            onClick={() => handleClick(index)}
          >
            <div
              className={selected[index] ? styles.circle2 : styles.circle1}
            ></div>
            {member.name}/{member.role}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToggleBox;

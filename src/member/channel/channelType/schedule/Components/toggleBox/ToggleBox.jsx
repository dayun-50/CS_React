import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import styles from "./ToggleBox.module.css";
import useToggleBox from "./useToggleBox";

const ToggleBox = ({ seq, selectedEmails, setSelectedEmails }) => {
  // 각 멤버 클릭 상태(on/off)를 배열로 관리
  const [selected, setSelected] = useState([]);

  const {
    members
  } = useToggleBox(seq, selected, setSelected);

  const handleClick = (index, member) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index]; // 클릭하면 토글
    setSelected(newSelected);

    const emails = members
      .filter((_, i) => newSelected[i])
      .map((m) => m.email);
    setSelectedEmails(emails)
    console.log(emails);
  };

  return (
    <div className={styles.calenderright}>
      <div className={styles.tgtitle}>
        <div className={styles.toggletitle}>
          채팅 멤버 <IoIosArrowDown size={24} />
        </div>
      </div>

      <div className={styles.tgmember}>
        {members.map((member, index) => (
          <div
            className={styles.tgmb}
            key={index}
            onClick={() => handleClick(index, member)}
          >
            <div
              className={selected[index] ? styles.circle1 : styles.circle2}
            ></div>
            {member.name} / {member.level_code}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToggleBox;

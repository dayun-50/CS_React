import { useState } from "react";
import styles from "./OutBox.module.css";
import arrow from "./icon/Collapse Arrow.svg";
import useOutBox from "./useOutBox";
import { caxios } from "../../../../../../config/config";

const OutBox = ({ seq, setSelectedSeq, isOn, setIsOn, memberCount }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    id, manager
  } = useOutBox(seq, isOn, setIsOn);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState); // 일단 UI 먼저 변경

    // 서버 요청
    const project_progress = newState ? "y" : "n";

    caxios.post(
      "/chatRoom/projectOnOff",
      { chat_seq: seq, project_progress },
      { withCredentials: true }
    )
      .then((resp) => {
        if (resp.data !== 1) {
          // 실패했으면 UI 롤백
          setIsOn(!newState);
        }
      })
      .catch((err) => {
        setIsOn(!newState); // 실패 시 롤백
      });
  };

  const handleExitClick = () => {
    setShowConfirm(true); // 확인창 띄우기
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    caxios.post("/chatRoom/outChat",{chat_seq: seq, member_email: id},{ withCredentials: true })
    .then(resp=>{
      setSelectedSeq("");
    }).catch(err=>console.log(err))
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className={styles.container}>
      {/* 프로젝트 완료시 작동 버튼 */}
      <div className={`${id === manager ? styles.projectCompleteRow : styles.hiden
        } ${(memberCount > 2)? "" : styles.hiden}`}>
        <div className={styles.projectCompleteText}>프로젝트 완료</div>
        <div
          className={`${styles.toggleSwitch} ${isOn ? styles.on : styles.off}`}
          onClick={toggleSwitch}
        >
          <span
            className={`${styles.statusText} ${isOn ? styles.left : styles.right
              }`}
          >
            {isOn ? "ON" : "OFF"}
          </span>
          <div className={styles.toggleKnob} />
        </div>
      </div>

      {/* 나가기 버튼 */}
      <div className={styles.exitRow}>
        <button className={styles.exitRow} onClick={handleExitClick}>
          <div className={styles.exitText}>나가기</div>
          <img src={arrow} className={styles.arrowIcon} alt="화살표" />
        </button>
      </div>

      {/* 확인 모달 */}
      {showConfirm && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <p>정말 나가시겠습니까?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleConfirm} className={styles.confirmButton}>
                확인
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutBox;

import { useState, useEffect } from "react";
import styles from "./OutBox.module.css";
import arrow from "./icon/Collapse Arrow.svg";
import useOutBox from "./useOutBox";
import { caxios } from "../../../../../../config/config";

const OutBox = ({ seq, setSelectedSeq, isOn, setIsOn, memberCount, deptSeq }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const { id, manager } = useOutBox(seq, setIsOn, setLoading); // 로딩과 함께 사용

  const toggleSwitch = () => {
    const newProjectProgress = !isOn ? "y" : "n";

    // 서버 요청 후 성공하면 상태 변경
    caxios.post("/chatRoom/projectOnOff", { chat_seq: seq, project_progress: newProjectProgress }, { withCredentials: true })
      .then(resp => {
        if (resp.data === 1) {
          setIsOn(!isOn);
        }
      })
      .catch(err => console.log(err));
  };

  const handleExitClick = () => setShowConfirm(true);

  const handleConfirm = () => {
    setShowConfirm(false);
    caxios.post("/chatRoom/outChat", { chat_seq: seq }, { withCredentials: true })
      .then(resp => setSelectedSeq(""))
      .catch(err => console.log(err));
  };

  const handleCancel = () => setShowConfirm(false);

  return (
    <div className={styles.container}>
      {/* 프로젝트 완료 버튼 */}
      {!loading && id === manager && memberCount > 2 && deptSeq !== seq && (
        <div className={styles.projectCompleteRow}>
          <div className={styles.projectCompleteText}>프로젝트 완료</div>
          <div
            className={`${styles.toggleSwitch} ${isOn ? styles.on : styles.off}`}
            onClick={toggleSwitch}
          >
            <span className={`${styles.statusText} ${isOn ? styles.left : styles.right}`}>
              {isOn ? "ON" : "OFF"}
            </span>
            <div className={styles.toggleKnob} />
          </div>
        </div>
      )}

      {/* 나가기 버튼 */}
      <div className={styles.exitRow}>
        <button onClick={handleExitClick} className={styles.exitRow}>
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
              <button onClick={handleConfirm} className={styles.confirmButton}>확인</button>
              <button onClick={handleCancel} className={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutBox;

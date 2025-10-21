import { useState } from "react";
import styles from "./OutBox.module.css";
import arrow from "./icon/Collapse Arrow.svg";

const OutBox = () => {
  const [isOn, setIsOn] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSwitch = () => {
    setIsOn((prev) => !prev);
  };

  const handleExitClick = () => {
    setShowConfirm(true); // 확인창 띄우기
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    // 여기서 실제 '나가기' 동작 수행
    // 예: window.location.href = '/logout' 또는 router 이동 등
    alert("나가졌습니다!"); // 예시로 alert
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className={styles.container}>
      {/* 프로젝트 완료시 작동 버튼 */}
      <div className={styles.projectCompleteRow}>
        <div className={styles.projectCompleteText}>프로젝트 완료</div>
        <div
          className={`${styles.toggleSwitch} ${isOn ? styles.on : styles.off}`}
          onClick={toggleSwitch}
        >
          <span
            className={`${styles.statusText} ${
              isOn ? styles.left : styles.right
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

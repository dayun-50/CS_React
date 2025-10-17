import { useState } from "react";
import styles from "./MyInform.module.css";
import useMyinform from "./useMyinform";

function MyInform() {

  const {
    memberData, isEditing, name, phone,
    setName, setPhone,
    handleSaveClick, handleEditClick, handleCancelClick
  } = useMyinform();

  console.log("전달받은값",memberData);
  return (
    <div className={styles.container}>
      {/* 왼쪽 박스 */}
      <div className={styles.leftBox}>
        <header className={styles.header}>회원 정보</header>

        {/* 이메일 */}
        <div className={`${styles.infoBox} ${styles.emailBox}`}>
          <label className={styles.label}>이메일</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} /> {/* 평상시 border 없음 */}
            <input type="text" className={styles.input} value={memberData.email} disabled />
          </div>
        </div>

        {/* 이름 (수정 가능) */}
        <div className={`${styles.infoBox} ${styles.nameBox}`}>
          <label className={styles.label}>이름</label>
          <div className={styles.rectangleParent}>
            <div
              className={`${styles.groupChild} ${isEditing ? styles.editable : ""
                }`}
            />
            <input
              type="text"
              className={styles.input}
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* 부서 */}
        <div className={`${styles.infoBox} ${styles.deptBox}`}>
          <label className={styles.label}>부서</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} disabled />
          </div>
        </div>

        {/* 직급 */}
        <div className={`${styles.infoBox} ${styles.rankBox}`}>
          <label className={styles.label}>직급</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} disabled />
          </div>
        </div>

        {/* 연락처 (수정 가능) */}
        <div className={`${styles.infoBox} ${styles.phoneBox}`}>
          <label className={styles.label}>연락처</label>
          <div className={styles.rectangleParent}>
            <div
              className={`${styles.groupChild} ${isEditing ? styles.editable : ""
                }`}
            />
            <input
              type="text"
              className={styles.input}
              disabled={!isEditing}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className={styles.buttonContainer}>
        {!isEditing ? (
          <button className={styles.button} onClick={handleEditClick}>
            수정
          </button>
        ) : (
          <>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleCancelClick}
            >
              취소
            </button>
            <button className={styles.button} onClick={handleSaveClick}>
              수정 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MyInform;

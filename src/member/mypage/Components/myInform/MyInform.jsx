import { useState } from "react";
import styles from "./MyInform.module.css";
import useMyinform from "./useMyinform";

function MyInform() {
  // 혜빈 언니꺼 나중에 최종적인거 받으면 
  const {
    id, memberData, isEditing, name, phone, phone1, phone2,
    setName, setPhone1, setPhone2,
    handleSaveClick, handleEditClick, handleCancelClick
  } = useMyinform();

  return (
    <div className={styles.container}>
      {/* 왼쪽 박스 */}
      <div className={styles.leftBox}>
        <header className={styles.header}>회원 정보</header>

        {/* 이메일 */}
        <div className={`${styles.infoBox} ${styles.emailBox}`}>
          <label className={styles.label}>이메일</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} value={id} disabled />
          </div>
        </div>

        {/* 이름 */}
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
            <input
              type="text"
              className={styles.input}
              value={memberData.dept_code}
              disabled
            />
          </div>
        </div>

        {/* 직급 */}
        <div className={`${styles.infoBox} ${styles.rankBox}`}>
          <label className={styles.label}>직급</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input
              type="text"
              className={styles.input}
              value={memberData.level_code}
              disabled
            />
          </div>
        </div>

        {/* 연락처 */}
        <div className={`${styles.infoBox} ${styles.phoneBox}`}>
          <label className={styles.label}>연락처</label>
          <div className={styles.rectangleParent}>
            {/* 수정 모드일 때: 분할 입력창 */}
            <div className={!isEditing ? styles.hidden : styles.phoneWrapper}>
              <span className={styles.dash}>010</span>
              <span className={styles.dash}>-</span>
              <input
                id="phone1"
                type="text"
                value={phone1}
                onChange={(e)=>setPhone1(e.target.value)}
                disabled={!isEditing}
              />
              <span className={styles.dash}>-</span>
              <input
                id="phone2"
                type="text"
                value={phone2}
                onChange={(e)=>setPhone2(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className={!isEditing ? styles.groupChild : styles.hidden}>
            <input
              type="text"
              className={styles.input}
              disabled
              value={phone}
            />
            </div>
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
              className={`${styles.dbutton} ${styles.cancelButton}`}
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

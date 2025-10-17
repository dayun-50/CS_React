import styles from "./MyInform.module.css";

function MyInform() {
  return (
    <div className={styles.container}>
      {/* 왼쪽 박스 */}
      <div className={styles.leftBox}>
        {/* 회원 정보 */}
        <header className={styles.header}>회원 정보</header>

        {/* 이메일 */}
        <div className={`${styles.infoBox} ${styles.emailBox}`}>
          <label className={styles.label}>이메일</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} />
          </div>
        </div>

        {/* 이름 */}
        <div className={`${styles.infoBox} ${styles.nameBox}`}>
          <label className={styles.label}>이름</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} />
          </div>
        </div>

        {/* 부서 */}
        <div className={`${styles.infoBox} ${styles.deptBox}`}>
          <label className={styles.label}>부서</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} />
          </div>
        </div>

        {/* 직급 */}
        <div className={`${styles.infoBox} ${styles.rankBox}`}>
          <label className={styles.label}>직급</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} />
          </div>
        </div>

        {/* 연락처 */}
        <div className={`${styles.infoBox} ${styles.phoneBox}`}>
          <label className={styles.label}>연락처</label>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <input type="text" className={styles.input} />
          </div>
        </div>
      </div>

      {/* 수정 버튼 */}
      <div className={styles.buttonContainer}>
        <button className={styles.button}>수정</button>
      </div>
    </div>
  );
}

export default MyInform;

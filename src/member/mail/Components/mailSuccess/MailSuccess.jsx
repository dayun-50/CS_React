import styles from "./MailSuccess.module.css";
import Frame from "./img/Frame.svg"; // 메일 성공 아이콘

const MailSuccess = () => {
  return (
    <div className={styles.MailSuccesscontainer}>
      {/* 흰색 박스 영역 */}
      <div className={styles.centermailsuccess}>
        {/* 아이콘 이미지 */}
        <img src={Frame} className={styles.frameicon} alt="메일 성공 아이콘" />
        {/* 안내 문구 */}
        <p className={styles.successText}>메일을 성공적으로 보냈습니다.</p>
      </div>
    </div>
  );
};

export default MailSuccess;

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router를 사용하는 경우
import styles from "./MailDetail.module.css";
import file from "./icon/file.svg";

const MailDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate(); // 뒤로가기 기능용

  // 삭제 버튼 클릭 시
  const handleDelete = () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      // 실제 삭제 로직 실행 (예: 서버 요청)
      // 여기서는 간단히 뒤로 가기로 처리
      alert("삭제 완료!");
      navigate(-1);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // 뒤로가기만 수행
  };

  return (
    <div className={styles.maillistbox}>
      <div className={styles.maillistin}>
        <div className={styles.maillisttitle}>
          <span className={styles.titleText}>여기에 제목 넣어 버리고</span>
        </div>

        <div className={styles.mailitem}>
          <div className={styles.mailleft}>
            <span className={styles.mailtextone}>test@gmail.com</span>
            <span className={styles.mailtexttwo}>2025-10-25</span>
          </div>
        </div>

        <div className={styles.maillistdown}>
          <img src={file} className={styles.fileicon} />
          <input
            type="text"
            placeholder="자금사용 정의서.hwp"
            className={styles.mailInput}
          />
        </div>

        <div className={styles.maildetail}>
          <span className={styles.detailtitle}>▶ 공지사항 테스트 안내</span>
          <span>본 공지사항은 시스템 점검 및 게시 기능 확인을 위한 테스트용입니다.</span>

          <div className={styles.detaildetail}>
            <p>참고하실 내용은 없으므로, 확인 후 뒤로가기를 눌러주시기 바랍니다.</p>
            <p>이용에 불편을 드려 죄송합니다.</p>
            <p>감사합니다.</p>
          </div>

          <div className={styles.detailbutton}>
            <button className={styles.bbt} onClick={handleBackClick}>
              뒤로가기
            </button>
            {!isEditing && (
              <button className={styles.adjustment} onClick={handleDelete}>
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailDetail;

import { useState } from "react";
import styles from "./ContactDetail.module.css";
import { IoClose } from "react-icons/io5";
import { caxios } from "../../../../config/config"; // axios 인스턴스 임포트

const ContactDetail = ({ contact, onClose, onDeleted }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // 값 상태
  const [name, setName] = useState(contact.name);
  const [company, setCompany] = useState(contact.contact_group || "");
  const [phone, setPhone] = useState(contact.phone);
  const [email, setEmail] = useState(contact.email);
  const [memo, setMemo] = useState(contact.memo);

  const handleSave = () => {
    // TODO: 서버에 PATCH 요청 보내기 (수정 기능)
    console.log("저장할 값:", { name, company, phone, email, memo });
    setIsEditMode(false);
  };

  // 삭제 요청 함수
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      caxios
        .delete(`/contact/delete/${contact.contact_seq}`)
        .then((res) => {
          console.log("삭제 성공:", res.data);
          alert("삭제되었습니다.");
          onDeleted(); // 삭제 후 부모에게 알려서 목록 갱신 등 처리
          onClose(); // 상세 화면 닫기
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
          alert("삭제에 실패했습니다.");
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ position: "relative" }}>
        <div className={styles.title}>주소록 상세</div>

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "8px",
          }}
          aria-label="닫기"
        >
          <IoClose size={24} color="#888" />
        </button>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>분류</div>
        <div className={styles.value}>
          {contact.share === "y" ? "팀용" : "개인용"}
        </div>
      </div>

      {/* 회사 이름 */}
      <div className={styles.field}>
        <div className={styles.label}>회사 이름</div>
        {isEditMode ? (
          <input
            className={styles.input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        ) : (
          <div className={styles.value}>{company}</div>
        )}
      </div>

      {/* 이름 */}
      <div className={styles.field}>
        <div className={styles.label}>이름</div>
        {isEditMode ? (
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className={styles.value}>{name}</div>
        )}
      </div>

      {/* 연락처 */}
      <div className={styles.field}>
        <div className={styles.label}>연락처</div>
        {isEditMode ? (
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        ) : (
          <div className={styles.value}>{phone}</div>
        )}
      </div>

      {/* 이메일 */}
      <div className={styles.field}>
        <div className={styles.label}>이메일</div>
        {isEditMode ? (
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <div className={styles.value}>{email}</div>
        )}
      </div>

      <div className={styles.field}>
        <div className={styles.label}>메모</div>
        {isEditMode ? (
          <textarea
            className={styles.textarea}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        ) : (
          <div className={styles.memo}>{memo}</div>
        )}
      </div>

      {/* 수정 & 삭제 버튼  */}
      <div className={styles.buttonRow}>
        {isEditMode ? (
          <>
            <button
              className={styles.cancelBtn}
              onClick={() => setIsEditMode(false)}
            >
              뒤로가기
            </button>
            <button className={styles.saveBtn} onClick={handleSave}>
              수정
            </button>
          </>
        ) : (
          <>
            <button className={styles.editBtn} onClick={handleDelete}>
              삭제
            </button>
            <button
              className={styles.editBtn}
              onClick={() => setIsEditMode(true)}
            >
              수정
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;

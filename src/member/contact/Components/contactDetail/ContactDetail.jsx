import { useEffect, useState } from "react";
import styles from "./ContactDetail.module.css";
import { IoClose } from "react-icons/io5";
import { caxios } from "../../../../config/config"; // axios 인스턴스

const ContactDetail = ({ contact, onClose, onDeleted, onUpdated }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [category, setCategory] = useState(
    contact.share === "y" ? "팀용" : "개인용"
  );
  const [company, setCompany] = useState(contact.contact_group || "");
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [email, setEmail] = useState(contact.email);
  const [memo, setMemo] = useState(contact.memo);

  useEffect(() => {
    setCategory(contact.share === "y" ? "팀용" : "개인용");
    setCompany(contact.contact_group || "");
    setName(contact.name || "");
    setPhone(contact.phone || "");
    setEmail(contact.email || "");
    setMemo(contact.memo || "");
  }, [contact]);

  const handleSave = async () => {
    try {
      const shareValue = category === "팀용" ? "y" : "n";
      const payload = {
        contact_seq: contact.contact_seq,
        share: shareValue,
        contact_group: company,
        name,
        phone,
        email,
        memo,
      };

      await caxios.put(`/contact/update`, payload);
      alert("수정이 완료되었습니다.");
      setIsEditMode(false);

      // 서버에서 받은 수정된 데이터를 부모 컴포넌트로 전달
      onUpdated({ ...contact, ...payload });
    } catch (error) {
      console.error("수정 실패", error);
      alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      caxios
        .delete(`/contact/delete/${contact.contact_seq}`)
        .then(() => {
          alert("삭제되었습니다.");
          onDeleted(contact.contact_seq);
        })
        .catch((err) => {
          console.error("삭제 실패", err);
          alert("삭제에 실패했습니다.");
        });
    }
  };

  return (
    <div className={styles.modalWrapper}>
      {/* 오버레이 */}
      <div className={styles.overlay} />

      {/* 내용 */}
      <div className={styles.modalContainer}>
        {/* 제목과 닫기 버튼이 한 줄에 */}
        <div className={styles.titleRow}>
          <div className={styles.title}>주소록</div>
          <button
            className={styles.closeBtn}
            onClick={() => {
              console.log("onClose 호출");
              onClose();
            }}
            aria-label="닫기"
          >
            <IoClose size={30} color="#888" />
          </button>
        </div>

        {/* 분류 */}
        <div className={styles.field}>
          <label>분류</label>
          {isEditMode ? (
            <div className={styles.categoryToggleGroup}>
              <button
                className={`${styles.toggleBtn} ${
                  category === "개인용" ? styles.active : ""
                }`}
                onClick={() => setCategory("개인용")}
                type="button"
              >
                개인용
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  category === "팀용" ? styles.active : ""
                }`}
                onClick={() => setCategory("팀용")}
                type="button"
              >
                팀용
              </button>
            </div>
          ) : (
            <div className={styles.value}>{category}</div>
          )}
        </div>

        {/* 회사 이름 */}
        <div className={styles.field}>
          <label>회사 이름</label>
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
          <label>이름</label>
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
          <label>연락처</label>
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
          <label>이메일</label>
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

        {/* 메모 */}
        <div className={styles.field}>
          <label>메모</label>
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

        {/* 하단 버튼: 삭제, 수정/저장, 취소 */}
        <div className={styles.buttonRow}>
          {isEditMode ? (
            <>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsEditMode(false)}
              >
                취소
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                저장
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={isEditMode}
              >
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
    </div>
  );
};

export default ContactDetail;

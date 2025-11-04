import { useState } from "react";
import styles from "./ContactForm.module.css";
import { useNavigate } from "react-router-dom";
import { caxios } from "../../../../config/config";
import useAuthStore from "../../../../store/useAuthStore";

const ContactForm = () => {
  const [group, setGroup] = useState(""); // 개인용 or 팀용
  const [name, setName] = useState("");
  const [contact_group, setcontact_group] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");

  const navigate = useNavigate();
  const { id: ownerEmail, isLogin } = useAuthStore();

  const handleBack = () => navigate("/contact");

  const handleAdd = async () => {
    if (!isLogin) return alert("로그인이 필요합니다.");
    if (!ownerEmail) return alert("로그인 정보가 올바르지 않습니다.");
    if (!name || !phone1 || !phone2 || !email || !group)
      return alert("모든 필수 항목을 입력해주세요.");
    if (!/^\d{4}$/.test(phone1) || !/^\d{4}$/.test(phone2))
      return alert("숫자 4자리씩 입력해주세요.");

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: `010-${phone1}-${phone2}`,
      share: group === "개인용" ? "n" : "y",
      contact_group: contact_group, // input에서 가져온 회사 이름
      memo: memo ? memo.trim() : null,
      owner_email: ownerEmail,
    };

    try {
      const res = await caxios.post("/contact/insert", payload);
      if (res.status === 200 && res.data === 1) {
        alert("주소록이 성공적으로 등록되었습니다.");
        navigate("/contact");
      } else {
        alert("등록에 실패했습니다. 서버 응답을 확인하세요.");
      }
    } catch (err) {
      console.error("주소록 등록 실패:", err.response || err);
      if (err.response?.status === 400) {
        alert("요청이 잘못되었습니다. 필수 항목을 확인해주세요.");
      } else {
        alert("등록 중 서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <div className={styles.headerTitle}>주소록 추가</div>
        </div>

        <div className={styles.groupSelector}>
          <div className={styles.groupLabel}>분류</div>
          <div className={styles.groupButtonGroup}>
            <button
              className={`${styles.groupButton} ${
                group === "개인용" ? styles.active : styles.inactive
              }`}
              onClick={() => setGroup("개인용")}
            >
              개인용
            </button>
            <button
              className={`${styles.groupButton} ${
                group === "팀용" ? styles.active : styles.inactive
              }`}
              onClick={() => setGroup("팀용")}
            >
              팀용
            </button>
          </div>
        </div>

        <div className={styles.formContent}>
          <div className={styles.inputField}>
            <div className={styles.inputLabel}>이름</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className={styles.textInput}
            />
          </div>

          <div className={styles.inputField}>
            <div className={styles.inputLabel}>회사 이름</div>
            <input
              type="text"
              value={contact_group}
              onChange={(e) => setcontact_group(e.target.value)}
              placeholder="회사 이름을 입력하세요"
              className={styles.textInput}
            />
          </div>

          <div className={styles.inputField}>
            <div className={styles.inputLabel}>연락처</div>
            <div className={styles.phoneWrapper}>
              <span className={styles.dash}>010</span>
              <span className={styles.dash}>-</span>
              <input
                type="text"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                placeholder="숫자 4개"
                className={styles.phoneInput}
                maxLength={4}
              />
              <span className={styles.dash}>-</span>
              <input
                type="text"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                placeholder="숫자 4개"
                className={styles.phoneInput}
                maxLength={4}
              />
            </div>
          </div>

          <div className={styles.inputField}>
            <div className={styles.inputLabel}>이메일</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className={styles.textInput}
            />
          </div>

          <div className={styles.memoField}>
            <div className={styles.inputLabel}>메모</div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모 내용을 입력하세요"
              className={styles.memoInput}
              rows="5"
            ></textarea>
          </div>
        </div>

        <div className={styles.formFooter}>
          <button className={styles.backButton} onClick={handleBack}>
            뒤로가기
          </button>
          <button className={styles.submitButton} onClick={handleAdd}>
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

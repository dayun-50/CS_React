import { useContext, useState } from "react";
import styles from "./ContactForm.module.css";
import { useNavigate } from "react-router-dom";
import { caxios } from "../../../../config/config";

const ContactForm = () => {
  const [group, setGroup] = useState(""); // 개인용 or 팀용
  const [name, setName] = useState(""); // 이름
  const [company, setCompany] = useState(""); // 회사 이름
  const [phone1, setPhone1] = useState(""); // 연락처 1
  const [phone2, setPhone2] = useState(""); // 연락처 2
  const [email, setEmail] = useState(""); // 이메일
  const [memo, setMemo] = useState(""); // 메모 내용
  //  owner_email은 보통 로그인된 사용자 정보를 Context/Redux에서 가져옵니다.

  const { user } = useContext(); // user.email 등 접근 가능

  const navigate = useNavigate();

  // 뒤로 가기 버튼 클릭 시
  const handleBack = () => {
    navigate("/contact");
  };

  // 추가 버튼 클릭 시
  const handleAdd = async () => {
    const phone = `010-${phone1}-${phone2}`;
    const share = group === "개인용" ? "n" : "y";

    if (!name || !phone1 || !phone2 || !email || !group) {
      alert("모든 필수 항목(이름, 연락처, 이메일, 분류)을 입력해주세요.");
      return;
    }

    // 수정
    if (!user || !user.email) {
      alert("로그인이 필요합니다.");
      return;
    }
    const ownerEmail = user.email;
    const payload = {
      name,
      email,
      phone,
      share,
      contact_group: company, // 회사 명
      memo,
      owner_email: ownerEmail, // 로그인한 사용자
    };

    console.log("보내는 payload:", payload); // 콘솔 확인

    try {
      const res = await caxios.post(`/contact/insert`, payload);
      console.log("주소록 등록 성공:", res.data);
      navigate("/contacts");
    } catch (err) {
      console.error("주소록 등록 실패:", err);
      console.log("서버 응답 내용:", err.response?.data); // 서버 에러 확인
      alert("등록에 실패했습니다. 콘솔에서 에러 내용을 확인하세요.");
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
              onClick={() => {
                setGroup("개인용");
                console.log("group:", "개인용");
              }}
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

        {/* 이름 */}
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
          {/* 회사 이름 */}
          <div className={styles.inputField}>
            <div className={styles.inputLabel}>회사 이름</div>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="회사 이름을 입력하세요"
              className={styles.textInput}
            />
          </div>
          {/* 연락처 */}
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
          {/* 이메일 */}
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
          {/* 메모장 */}
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
        {/* 추가 버튼 */}
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

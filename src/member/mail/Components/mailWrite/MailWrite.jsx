import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./MailWrite.module.css";
import plus from "./icon/plus.svg";
import grayplus from "./icon/grayplus.svg";
import { caxios, mailRequest } from "../../../../config/config";

// 받는 사람 선택 모달 컴포넌트
const RecipientModal = ({ onClose, onSelect }) => {
  const recipients = [
    "김OO <email1@gmail.com>",
    "이OO <email2@gmail.com>",
    "박OO <email3@gmail.com>",
  ];

  const [selected, setSelected] = useState([]); // 여러개 저장

  const handleAdd = () => {
    if (!selected) {
      alert("선택된 사람이 없습니다.");
      return;
    }
    onSelect(selected);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h1>주소록</h1>

        <div className={styles.peoplemail}>
          <label className={styles.labelpeople}>받는 사람</label>
          <input type="text" placeholder="받는 사람"></input>
        </div>

        <label className={styles.addlist}>주소록 리스트</label>

        <div className={styles.list}>
          {recipients.map((r, idx) => (
            <label key={idx} className={styles.checkItem}>
              <input
                type="checkbox"
                value={r}
                checked={selected.includes(r)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (e.target.checked) {
                    setSelected([...selected, value]);
                  } else {
                    setSelected(selected.filter((item) => item !== value));
                  }
                }}
              />
              <span className={styles.customCheck}></span>
              <span className={styles.text}>{r}</span>
            </label>
          ))}
        </div>
        <div className={styles.modalButtons}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleAdd}>추가</button>
        </div>
      </div>
    </div>
  );
};

const MailWrite = () => {
  const navigate = useNavigate();
  const [fileNames, setFileNames] = useState([]);
  const [recipient, setRecipient] = useState(""); // 선택한 받는 사람
  const [showModal, setShowModal] = useState(false); // 모달 열림 상태

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const [isSending, setIsSending] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // FileList → Array
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

  // const handleSend = () => {
  //   // 나중에 API 호출 등 추가 가능
  //   navigate("/mail/mailok");
  // };

  const handleSend = async () => {
    // james 전용 토큰 가져오기
    const generalToken = sessionStorage.getItem("token"); // Token A
    const jamesAccessToken = sessionStorage.getItem("jamesAccessToken"); // Token B
    if (
      !generalToken ||
      !jamesAccessToken ||
      !recipient ||
      !subject ||
      !content
    ) {
      alert("모든 필드를 입력하고 다시 로그인해 주세요");
      return;
    }

    setIsSending(true);

    const combinedToken = `${generalToken}` + "|||" + `${jamesAccessToken}`;

    const sendData = {
      receiverEmails: recipient, // 쉼표로 구분된 String으로 전송
      subject: subject,
      content: content,
      // 첨부파일 처리는 복잡하므로 현재는 생략합니다.
    };

    try {
      const response = await mailRequest("post", "/emails/send", sendData, {
        headers: {
          // 이 헤더가 caxios의 기본 Authorization 헤더(Token A)를 덮어씁니다.
          Authorization: `Bearer ${combinedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("메일 발송에 성공했습니다!");
        navigate("/mail/mailok"); // 성공 페이지로 이동
      }
    } catch (error) {
      console.error("메일 발송 실패:", error);
      alert(`메일 발송 실패: ${error.response?.data?.error || "서버 오류"}`);
    } finally {
      setIsSending(false);
    }
  };

  const handlePlusClick = () => {
    setShowModal(true); // 모달 열기
  };

  return (
    <div className={styles.maillistbox}>
      <div className={styles.maillistin}>
        <div className={styles.maillisttitle}>
          <span className={styles.titleText}>메일 쓰기</span>
        </div>

        <div className={styles.Recipient}>
          <span className={styles.people}>받는 사람</span>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)} // ← 직접 타이핑 가능
          />
          <img
            src={plus}
            onClick={handlePlusClick}
            className={styles.plusicon}
          />
        </div>

        {/* 모달 렌더링 */}
        {showModal && (
          <RecipientModal
            onClose={() => setShowModal(false)}
            onSelect={(selected) =>
              setRecipient((prev) =>
                prev ? `${prev}, ${selected.join(", ")}` : selected.join(", ")
              )
            }
          />
        )}

        <div className={styles.writetitle}>
          <span className={styles.wrtt}>제목</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="제목을 입력해주세요"
          />
        </div>

        <div className={styles.writ}>
          <label className={styles.fileLabel}>
            <img src={grayplus} className={styles.grayplusicon} />
            <input
              type="file"
              className={styles.fileInput}
              onChange={handleFileChange}
              multiple // ← 여러 파일 선택 가능
            />
            <span>
              {fileNames.length > 0
                ? fileNames.join(", ") // 선택한 파일 이름 표시
                : "눌러 파일을 첨부해주세요"}
            </span>
          </label>
        </div>

        <div className={styles.pen}>
          <textarea
            className={styles.pent}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="보낼 내용을 입력해 주세요."
          ></textarea>
        </div>

        <div className={styles.penbutton}>
          <button className={styles.sendb} onClick={handleSend}>
            보내기
          </button>
        </div>
      </div>

      {/* 모달 렌더링 */}
      {showModal && (
        <RecipientModal
          onClose={() => setShowModal(false)}
          onSelect={(value) => setRecipient(value)}
        />
      )}
    </div>
  );
};

export default MailWrite;

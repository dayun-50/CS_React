import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./MailWrite.module.css";
import plus from "./icon/plus.svg";
import grayplus from "./icon/grayplus.svg";
import { caxios } from "../../../../config/config";

const MailWrite = () => {
  const navigate = useNavigate();
  const [fileNames, setFileNames] = useState([]);

  const [recipient, setRecipient] = useState("");
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
    const jamesToken = sessionStorage.getItem("jamesAccessToken");
    if (!jamesToken || !recipient || !subject || !content) {
      alert("모든 필드를 입력하고 다시 로그인해 주세요");
      return;
    }

    setIsSending(true);

    const sendData = {
      receiverEmails: recipient, // 쉼표로 구분된 String으로 전송
      subject: subject,
      content: content,
      // 첨부파일 처리는 복잡하므로 현재는 생략합니다.
    };

    try {
      const response = await caxios.post("/emails/send", sendData, {
        headers: {
          // 이 부분이 caxios의 기본 Authorization 헤더를 덮어씁니다.
          Authorization: `Bearer ${jamesToken}`,
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
            onChange={(e) => setRecipient(e.target.value)}
          />
          <img src={plus} className={styles.plusicon} />
        </div>

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
    </div>
  );
};

export default MailWrite;

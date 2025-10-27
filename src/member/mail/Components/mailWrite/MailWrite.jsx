import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./MailWrite.module.css";
import plus from "./icon/plus.svg";
import grayplus from "./icon/grayplus.svg";

const MailWrite = () => {
  const navigate = useNavigate();
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // FileList → Array
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

  const handleSend = () => {
    // 나중에 API 호출 등 추가 가능
    navigate("/mail/mailok");
  };

  return (
    <div className={styles.maillistbox}>
      <div className={styles.maillistin}>
        <div className={styles.maillisttitle}>
          <span className={styles.titleText}>메일 쓰기</span>
        </div>

        <div className={styles.Recipient}>
          <span className={styles.people}>받는 사람</span>
          <input type="text" />
          <img src={plus} className={styles.plusicon} />
        </div>

        <div className={styles.writetitle}>
          <span className={styles.wrtt}>제목</span>
          <input type="text" placeholder="제목을 입력해주세요" />
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
          <textarea className={styles.pent} placeholder="보낼 내용을 입력해 주세요."></textarea>
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

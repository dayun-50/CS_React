import styles from "./fileBox.module.css";
import arrow from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";

const files = [
  { name: "여름 프로젝트 기획 PPT.ppt", date: "2025-10-03" },
  { name: "공공디자인 최종본.png", date: "2025-10-03" },
];

const FileBox = () => {
  return (
    <div className={styles.fileBox}>
      <div className={styles.header}>
        <div className={styles.title}>파일 목록</div>
        <img src={arrow} className={styles.arrowIcon} alt="화살표" />
      </div>

      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className={styles.searchInputField}
          />
          <img src={search} className={styles.searchIcon} alt="돋보기" />
        </div>
      </div>

      <div className={styles.fileList}>
        {files.map((file, index) => (
          <div key={index} className={styles.fileItem}>
            <div className={styles.fileName}>{file.name}</div>
            <div className={styles.fileDate}>{file.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileBox;

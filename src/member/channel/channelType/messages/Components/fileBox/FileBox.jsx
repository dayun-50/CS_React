<<<<<<< HEAD
=======
import { useEffect, useState } from "react";
import useChannelName from "../channelName/useChannelName";
>>>>>>> 8edc7aaabde430143e2a5dbbdaac16a76ce80e0c
import styles from "./fileBox.module.css";
import arrow from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import { caxios } from "../../../../../../config/config";
import dayjs from "dayjs";


const FileBox = ({ seq, trigger }) => {
  console.log(seq, "시퀀스팡리박스")


  const [files, setFiles] = useState([]);


  //채팅방 시퀀스에 맞는 파일리스트 가져오기
  useEffect(() => {
    if (!seq) return;
    caxios.get(`/chat/${seq}`)
      .then(resp => {
        setFiles(resp.data);
        console.log(resp.data);
      })
  }, [seq, trigger])

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
            <div className={styles.fileName}>
              <a
                href={`http://127.0.0.1/file/download?sysname=${encodeURIComponent(file.sysname)}&file_type=${encodeURIComponent(file.file_type)}`}
                download
              >
                {file.oriname}
              </a>
            </div>
            <div className={styles.fileDate}>
              {file.upload_at ? dayjs(file.upload_at).format("YYYY-MM-DD") : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileBox;

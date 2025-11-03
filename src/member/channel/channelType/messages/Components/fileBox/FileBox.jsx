import { useEffect, useState } from "react";
import useChannelName from "../channelName/useChannelName";
import styles from "./FileBox.module.css";
import arrow from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import { caxios } from "../../../../../../config/config";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";


const FileBox = ({ seq, trigger }) => {
  console.log(seq, "시퀀스팡리박스")
  const [files, setFiles] = useState([]);

  const [serchValue, setSerchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  //채팅방 시퀀스에 맞는 파일리스트 가져오기
  useEffect(() => {
    if (!seq) return;
    if (isSearching) return;
    caxios.get(`/chatMessage/${seq}`)
      .then(resp => {
        setFiles(resp.data);
        console.log(resp.data);
      })
  }, [seq, trigger, isSearching])

  // 검색 버튼 클릭 함수
  const serchBut = () => {
    if (!serchValue) return;
    caxios.post("/chatMessage/serchByFileText", { chat_seq: seq, oriname: serchValue }, { withCredentials: true })
      .then(resp => {
        setIsSearching(prev => !prev);
        console.log("제껍니다",resp.data);
        setFiles(resp.data);
      })
      .catch(err=>console.log(err));
  };

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
            value={serchValue}
            onChange={(e) => setSerchValue(e.target.value)}
          />
          <span
            onClick={() => {
              if (isSearching) {
                // X 아이콘 클릭
                setSerchValue("");
                setIsSearching(false);
              } else {
                // 검색 아이콘 클릭
                serchBut();
              }
            }}
            style={{ cursor: "pointer" }}
          >
            {isSearching ? <IoClose size={20} /> : <img src={search} alt="검색 아이콘" />}
          </span>
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

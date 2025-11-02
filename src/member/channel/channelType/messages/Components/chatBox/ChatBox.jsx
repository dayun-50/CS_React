import styles from "./ChatBox.module.css";
import attach from "./icon/Attach.svg";
import message from "./icon/message.svg";
import collapse from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import useChatBox from "./useChatBox";
import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";


const ChatBox = ({ seq, setAlertRooms, onFileUploaded, setMemberCount, isOn }) => {
  const [collapseButtonText, setCollapseButtonText] = useState("메시지");
  const [serchValue, setSerchValue] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("검색할 내용");
  const [messages, setMessages] = useState([]);
  // const [messages, setMessages] = useState(originalMessages);

  const [fileList, setFileList] = useState([]);
  const [showCollapseDropdown, setShowCollapseDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const buttonRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const {
    id, room, messages: originalMessages, input,
    setInput, sendMessage, handleKeyDown, serchBut,
    messageListRef
  } = useChatBox(
    seq, setAlertRooms, setMemberCount, onFileUploaded, collapseButtonText, serchValue, isSearching, setIsSearching, setSerchValue
  );

  useEffect(() => setMessages(originalMessages), [originalMessages]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };

  const handleRemoveFile = (index) => {
    const newFileList = fileList.filter((_, i) => i !== index);
    setFileList(newFileList);

    const fileInput = document.getElementById("fileUpload");
    if (fileInput?.files) {
      const dt = new DataTransfer();
      newFileList.forEach((f) => dt.items.add(f));
      fileInput.files = dt.files;
    }
  };

  const handleCollapseClick = () => {
    if (buttonRef.current) setDropdownWidth(buttonRef.current.offsetWidth);
    setShowCollapseDropdown((prev) => !prev);
  };

  const handleCollapseOptionClick = (option) => {
    setCollapseButtonText(option);
    setShowCollapseDropdown(false);

    if (option === "날짜") {
      setSearchPlaceholder("YYMMDD");
    } else {
      setSearchPlaceholder("검색할 내용");
    }
  };

  const formatTimestamp = (ts) => {
    const date = ts ? new Date(ts) : new Date();
    if (isNaN(date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };


  //---------------------------------------------------------메세지 전송
  const handleSendMessage = async () => {
    // 1. 텍스트가 공백이고 파일 없음 -> 전송 중단
    if (!input.message.trim() && fileList.length === 0) return;

    //2. 파일전송법
    if (fileList.length > 0) {
      for (const blob of fileList) {
        await sendMessage(blob); // 각 파일 전송 완료 후 다음 파일로 넘어감
      }
      // 파일 올릴때 빈칸생기는거 싫어서 추가한로직, 아래 메세지용 로직실행하지 않고 값다 정리하고 리턴시킴
      setInput({ message: "" });
      setFileList([]);
      const fileInput = document.getElementById("fileUpload");
      if (fileInput) fileInput.value = "";
      return;
    }

    //2.메세지 전송법
    sendMessage(input.message);

    const newMsg = {
      chat_seq: Date.now(),
      message_seq: messages.length,
      member_email: id,
      message: input.message,
      message_at: new Date().toISOString(),
      name: "나",
      level_code: "",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput({ message: "" });


    const fileInput = document.getElementById("fileUpload");
    if (fileInput) fileInput.value = "";
  };




  //-------------------------------------------------****자동 스크롤 내리기 함수 옮김
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div className={styles.chatBox}>
      <div className={styles.chatBox__container}>
        <div className={styles.chatBox__headerWrapper}>
          <b className={styles.chatBox__header}>
            {room.title} / {room.memberCount} 명
          </b>

          <div className={styles.chatBox__topControls}>
            <div className={styles.chatBox__searchBar}>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className={styles.chatBox__searchInput}
                value={serchValue}
                onChange={e => setSerchValue(e.target.value)}
              />
              <span
                onClick={() => {
                  if (isSearching) {
                    // X 아이콘 클릭
                    setSerchValue("");        // 검색어 초기화
                    setIsSearching(false);    // 검색 모드 종료
                  } else {
                    // 검색 아이콘 클릭
                    serchBut();               // 실제 검색 함수 호출
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {isSearching ? <IoClose size={20} /> : <img src={search} alt="검색 아이콘" />}
              </span>

            </div>

            <div style={{ position: "relative" }}>
              <button
                ref={buttonRef}
                className={styles.chatBox__collapseBtn}
                onClick={handleCollapseClick}
                style={{ color: "#000" }}
              >
                {collapseButtonText}
                <img src={collapse} alt="접기 아이콘" className={styles.chatBox__collapseIcon} />
              </button>
              {showCollapseDropdown && (
                <div className={styles.chatBox__sortDropdown} style={{ width: dropdownWidth }}>
                  {["메시지", "날짜"].map((option) => (
                    <div
                      key={option}
                      className={styles.chatBox__sortOption}
                      onClick={() => handleCollapseOptionClick(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.chatBox__messageList} ref={messageListRef}>
          {messages.map((msg) => (
            <div
              key={`${msg.chat_seq}-${msg.message_seq}`}
              id={`msg-${msg.chat_seq}-${msg.message_seq}`}
              className={`${styles.chatBox__messageWrapper} ${msg.member_email === id

                ? styles["chatBox__messageWrapper--right"]
                : styles["chatBox__messageWrapper--left"]
                }`}
            >
              {msg.member_email !== id && (
                <div className={styles.chatBox__sender}>{`${msg.name}`}</div>
              )}
              <div className={styles.chatBox__messageInner}>
                <div className={styles.chatBox__message}>
                  {/* 파일 여부에 따라 조건부 렌더링 */}
                  {!msg.sysname ? (
                    msg.message && <div>{msg.message}</div> // 파일이 없으면 일반 메시지 표시
                  ) : (
                    // 파일이 있으면 a태그로 다운로드 링크 표시
                    <div>
                      <a href={`http://192.168.45.127/file/download?sysname=${encodeURIComponent(msg.sysname)}&file_type=${encodeURIComponent(msg.file_type)}`}
                        target="_blank" rel="noopener noreferrer" download>
                        {msg.oriname || msg.message}
                      </a>
                    </div>
                  )}
                </div>
                <div className={styles.chatBox__timestamp}>{formatTimestamp(msg.message_at)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 입력영역: 파일첨부 + 텍스트 입력 + 전송 */}
        <div className={styles.chatBox__inputArea}>
          <div className={styles.chatBox__attachButton}>
            <label
              htmlFor="fileUpload"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <img src={attach} className={styles.chatBox__inputIcon} alt="파일 첨부" />
            </label>
            <input
              type="file"
              id="fileUpload"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div style={{ flexGrow: 1, position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              className={`${styles.chatBox__inputText} ${isOn ? '' : styles.prohibition}`}
              value={input.message}
              placeholder={isOn ? "메시지를 입력하세요" : "종료된 프로젝트방 입니다."}
              onChange={(e) => setInput((prev) => ({ ...prev, message: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                } else {
                  handleKeyDown(e);
                }
              }}
              style={{ flexGrow: 1, paddingRight: "8px" }}
              disabled={!isOn}
            />

            {fileList.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: "1px",
                  right: "36px",
                  display: "flex",
                  gap: "6px",
                  overflowX: "auto",
                  height: "28px",
                  alignItems: "center",
                }}
              >
                {fileList.map((file, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f0f0f0",
                      borderRadius: "20px",
                      fontSize: "12px",
                      color: "#333",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      flexShrink: 0,
                      maxWidth: "120px",
                    }}
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#ff4d4f",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "18px",
                        lineHeight: "1",
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className={styles.chatBox__sendButton} onClick={handleSendMessage}>
            <img src={message} className={styles.chatBox__sendIcon} alt="전송" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

import styles from "./ChatBox.module.css";
import attach from "./icon/Attach.svg";
import message from "./icon/message.svg";
import collapse from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import useChatBox from "./useChatBox";
import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

const ChatBox = ({ seq, setAlertRooms, setMemberCount, isOn }) => {
  const [collapseButtonText, setCollapseButtonText] = useState("메시지");
  const [serchValue, setSerchValue] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("검색할 내용");
  const [messages, setMessages] = useState([]);
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
    seq, setAlertRooms, setMemberCount, collapseButtonText, serchValue,
    setIsSearching
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
      setSearchPlaceholder("YY-MM-DD");
    } else {
      setSearchPlaceholder("검색할 내용");
    }
  };

  const formatTimestamp = (ts) => {
    const date = ts ? new Date(ts) : new Date();
    if (isNaN(date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (!input.message.trim() && fileList.length === 0) return;

    const formData = new FormData();
    formData.append("message", input.message);
    fileList.forEach((f) => formData.append("files", f));

    sendMessage(formData);

    const newMsg = {
      chat_seq: Date.now(),
      message_seq: messages.length,
      member_email: id,
      message: input.message,
      files: fileList.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      })),
      message_at: new Date().toISOString(),
      name: "나",
      level_code: "",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput({ message: "" });
    setFileList([]);

    const fileInput = document.getElementById("fileUpload");
    if (fileInput) fileInput.value = "";
  };

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
              <span onClick={serchBut} style={{ cursor: "pointer" }}>
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
                  {msg.message && <div>{msg.message}</div>}
                  {msg.files && msg.files.length > 0 && (
                    <div className={styles.chatBox__fileList}>
                      {msg.files.map((file, idx) => (
                        <div
                          key={idx}
                          className={styles.chatBox__fileLink}
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = file.url;
                            link.download = file.name;
                            link.click();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          📎 {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.chatBox__timestamp}>{formatTimestamp(msg.message_at)}</div>
              </div>
            </div>
          ))}
        </div>

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

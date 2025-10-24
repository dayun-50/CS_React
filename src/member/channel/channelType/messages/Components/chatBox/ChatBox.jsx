import styles from "./ChatBox.module.css";
import attach from "./icon/Attach.svg";
import message from "./icon/message.svg";
import collapse from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import useChatBox from "./useChatBox";
import { useState, useRef, useEffect } from "react";

const ChatBox = ({ seq }) => {
  const {
    id, room, messages: originalMessages, input,
    setInput, sendMessage, handleKeyDown,
    messageListRef
  } = useChatBox(seq);

  const [messages, setMessages] = useState(originalMessages);
  const [fileNames, setFileNames] = useState([]);
  const [showCollapseDropdown, setShowCollapseDropdown] = useState(false);
  const [collapseButtonText, setCollapseButtonText] = useState("메시지");

  const buttonRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  // originalMessages가 바뀌면 상태도 갱신
  useEffect(() => {
    setMessages(originalMessages);
  }, [originalMessages]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

  const handleCollapseClick = () => {
    if (buttonRef.current) {
      setDropdownWidth(buttonRef.current.offsetWidth);
    }
    setShowCollapseDropdown(prev => !prev);
  };

  const handleCollapseOptionClick = (option) => {
    setShowCollapseDropdown(false);
    setCollapseButtonText(option);

    // 메시지 정렬
    const sortedMessages = [...messages];
    if (option === "날짜") {
      sortedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (option === "메시지") {
      sortedMessages.sort((a, b) => a.message.localeCompare(b.message, "ko"));
    }
    setMessages(sortedMessages);
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.chatBox__container}>
        {/* 상단 헤더 */}
        <div className={styles.chatBox__headerWrapper}>
          <b className={styles.chatBox__header}>
            {room.title} / {room.memberCount} 명
          </b>

          <div className={styles.chatBox__topControls}>
            <div className={styles.chatBox__searchBar}>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                className={styles.chatBox__searchInput}
              />
              <img
                src={search}
                className={styles.chatBox__searchIcon}
                alt="검색 아이콘"
              />
            </div>

            <div className={styles.chatBox__collapseWrapper} style={{ position: "relative" }}>
              <button
                ref={buttonRef}
                className={styles.chatBox__collapseBtn}
                onClick={handleCollapseClick}
              >
                {collapseButtonText}
                <img src={collapse} alt="접기 아이콘" className={styles.chatBox__collapseIcon} />
              </button>

              {showCollapseDropdown && (
                <div
                  className={styles.chatBox__sortDropdown}
                  style={{ width: dropdownWidth }}
                >
                  {["메시지", "날짜"].map(option => (
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

        {/* 메시지 리스트 */}
        <div className={styles.chatBox__messageList} ref={messageListRef}>
          {messages.map((msg) => (
            <div
              key={msg.message_seq}
              className={`${styles.chatBox__message} ${msg.member_email === id
                ? styles["chatBox__message--right"]
                : styles["chatBox__message--left"]
                }`}
            >
              <div className={styles.chatBox__messageInner}>{msg.message}</div>
            </div>
          ))}
        </div>

        {/* 메시지 입력창 */}
        <div className={styles.chatBox__inputArea}>
          {/* 파일 첨부 */}
          <div className={styles.chatBox__attachButton}>
            <label
              htmlFor="fileUpload"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%"
              }}
            >
              <img
                src={attach}
                className={styles.chatBox__inputIcon}
                alt="파일 첨부"
              />
            </label>
            <input
              type="file"
              id="fileUpload"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* 메시지 입력 */}
          <input
            type="text"
            className={styles.chatBox__inputText}
            value={input.message}
            placeholder={
              fileNames.length > 0
                ? `${fileNames.length}개의 파일 첨부됨`
                : "메시지를 입력하세요"
            }
            onChange={(e) =>
              setInput((prev) => ({ ...prev, message: e.target.value }))
            }
            onKeyDown={handleKeyDown}
          />

          {/* 전송 버튼 */}
          <button className={styles.chatBox__sendButton} onClick={sendMessage}>
            <img
              src={message}
              className={styles.chatBox__sendIcon}
              alt="전송"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

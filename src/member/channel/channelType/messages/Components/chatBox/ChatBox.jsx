import styles from "./ChatBox.module.css"; // CSS 모듈
import attach from "./icon/Attach.svg"; // 파일 첨부 아이콘
import message from "./icon/message.svg"; // 메시지 전송 아이콘
import collapse from "./icon/Collapse Arrow.svg"; // 정렬/접기 아이콘
import search from "./icon/Search.svg"; // 검색 아이콘
import useChatBox from "./useChatBox"; // 커스텀 훅 (채팅 로직)
import { useState, useRef, useEffect } from "react"; // React 훅

const ChatBox = ({ seq }) => {
  // 커스텀 훅에서 채팅 관련 상태와 함수 가져오기
  const {
    id, // 현재 사용자 이메일
    room, // 방 정보
    messages: originalMessages, // 서버에서 받아온 메시지 배열
    input, // 현재 입력값
    setInput, // 입력값 상태 변경
    sendMessage, // 메시지 전송 함수
    handleKeyDown, // 입력창 키다운 처리
    messageListRef, // 메시지 리스트 스크롤 참조
  } = useChatBox(seq);

  const [messages, setMessages] = useState(originalMessages); // 표시용 메시지 상태
  const [fileList, setFileList] = useState([]); // 첨부 파일 목록
  const [showCollapseDropdown, setShowCollapseDropdown] = useState(false); // 정렬 옵션 드롭다운
  const [collapseButtonText, setCollapseButtonText] = useState("메시지"); // 정렬 기준 텍스트
  const buttonRef = useRef(null); // 드롭다운 너비 계산용 버튼 참조
  const [dropdownWidth, setDropdownWidth] = useState(0); // 드롭다운 너비 상태

  const [searchText, setSearchText] = useState(""); // 검색어 상태

  // 서버 메시지가 바뀌면 표시용 메시지도 업데이트
  useEffect(() => setMessages(originalMessages), [originalMessages]);

  // ─── 파일 선택 처리
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };

  // ─── 파일 삭제 처리
  const handleRemoveFile = (index) => {
    const newFileList = fileList.filter((_, i) => i !== index);
    setFileList(newFileList);

    // 실제 input[type=file]의 파일 목록도 갱신
    const fileInput = document.getElementById("fileUpload");
    if (fileInput?.files) {
      const dt = new DataTransfer();
      newFileList.forEach((f) => dt.items.add(f));
      fileInput.files = dt.files;
    }
  };

  // ─── 드롭다운 버튼 클릭
  const handleCollapseClick = () => {
    if (buttonRef.current) setDropdownWidth(buttonRef.current.offsetWidth);
    setShowCollapseDropdown((prev) => !prev);
  };

  // ─── 드롭다운 옵션 선택 (메시지 / 날짜 정렬)
  const handleCollapseOptionClick = (option) => {
    setShowCollapseDropdown(false);
    setCollapseButtonText(option);

    const sortedMessages = [...messages];
    if (option === "날짜") {
      // 날짜 기준 오름차순 정렬
      sortedMessages.sort(
        (a, b) =>
          new Date(a.message_at || Date.now()) - new Date(b.message_at || Date.now())
      );
    } else if (option === "메시지") {
      // 메시지 내용 기준 정렬 (한글 포함)
      sortedMessages.sort((a, b) => a.message.localeCompare(b.message, "ko"));
    }
    setMessages(sortedMessages);
  };

  // ─── 타임스탬프 포맷
  const formatTimestamp = (ts) => {
    const date = ts ? new Date(ts) : new Date();
    if (isNaN(date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ─── 메시지 전송
  const handleSendMessage = () => {
    if (!input.message.trim() && fileList.length === 0) return;

    const formData = new FormData();
    formData.append("message", input.message);
    fileList.forEach((f) => formData.append("files", f));
    sendMessage(formData); // 서버 전송

    // 로컬 상태에 추가
    const newMsg = {
      chat_seq: Date.now(),
      message_seq: messages.length,
      member_email: id,
      message: input.message,
      files: fileList.map((f) => f.name),
      message_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    // 입력창 초기화
    setInput({ message: "" });
    setFileList([]);
    const fileInput = document.getElementById("fileUpload");
    if (fileInput) fileInput.value = "";
  };

  // ─── 검색 후 엔터 처리 (스크롤 이동)
  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!searchText.trim()) return;

      const listEl = messageListRef.current;
      if (!listEl) return;

      let targetMsg;
      if (collapseButtonText === "메시지") {
        targetMsg = messages.find((m) => m.message.includes(searchText));
      } else if (collapseButtonText === "날짜") {
        // 날짜 검색 (YYYY-MM-DD, MM-DD)
        const searchDate = new Date(searchText);
        targetMsg = messages.find((m) => {
          const msgDate = new Date(m.message_at);
          return (
            msgDate.getFullYear() === searchDate.getFullYear() &&
            msgDate.getMonth() === searchDate.getMonth() &&
            msgDate.getDate() === searchDate.getDate()
          );
        });
      }

      if (targetMsg) {
        // 검색 대상 메시지로 스크롤 이동
        const targetEl = document.getElementById(
          `msg-${targetMsg.chat_seq}-${targetMsg.message_seq}`
        );
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.chatBox__container}>
        {/* ─── 헤더 */}
        <div className={styles.chatBox__headerWrapper}>
          <b className={styles.chatBox__header}>
            {room.title} / {room.memberCount} 명
          </b>

          {/* 검색 & 정렬 영역 */}
          <div className={styles.chatBox__topControls}>
            {/* 검색창 */}
            <div className={styles.chatBox__searchBar}>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                className={styles.chatBox__searchInput}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleSearchEnter} // 엔터 시 검색
              />
              <img
                src={search}
                className={styles.chatBox__searchIcon}
                alt="검색 아이콘"
              />
            </div>

            {/* 정렬 드롭다운 */}
            <div
              className={styles.chatBox__collapseWrapper}
              style={{ position: "relative" }}
            >
              <button
                ref={buttonRef}
                className={styles.chatBox__collapseBtn}
                onClick={handleCollapseClick}
                style={{ color: "#000" }}
              >
                {collapseButtonText}
                <img
                  src={collapse}
                  alt="접기 아이콘"
                  className={styles.chatBox__collapseIcon}
                />
              </button>

              {showCollapseDropdown && (
                <div
                  className={styles.chatBox__sortDropdown}
                  style={{ width: dropdownWidth }}
                >
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

        {/* ─── 메시지 리스트 */}
        <div className={styles.chatBox__messageList} ref={messageListRef}>
          {messages.map((msg) => (
            <div
              key={`${msg.chat_seq}-${msg.message_seq}`}
              id={`msg-${msg.chat_seq}-${msg.message_seq}`}
              className={`${styles.chatBox__messageWrapper} ${
                msg.member_email === id
                  ? styles["chatBox__messageWrapper--right"]
                  : styles["chatBox__messageWrapper--left"]
              }`}
            >
              <div className={styles.chatBox__message}>
                {msg.message}
                {/* 첨부파일 표시 */}
                {msg.files && msg.files.length > 0 && (
                  <ul style={{ marginTop: "4px", paddingLeft: "16px" }}>
                    {msg.files.map((f, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "#555" }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* 타임스탬프 */}
              <div className={styles.chatBox__timestamp}>
                {formatTimestamp(msg.message_at)}
              </div>
            </div>
          ))}
        </div>

        {/* ─── 입력창 */}
        <div className={styles.chatBox__inputArea}>
          {/* 첨부 버튼 */}
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

          {/* 메시지 입력 + 파일 미리보기 */}
          <div
            style={{
              flexGrow: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              className={styles.chatBox__inputText}
              value={input.message}
              placeholder="메시지를 입력하세요"
              onChange={(e) =>
                setInput((prev) => ({ ...prev, message: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(); // 엔터 -> 메시지 전송
                } else {
                  handleKeyDown(e); // Shift+Enter 등 처리
                }
              }}
              style={{ flexGrow: 1, paddingRight: "8px" }}
            />

            {/* 파일 미리보기 */}
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

          {/* 전송 버튼 */}
          <button
            className={styles.chatBox__sendButton}
            onClick={handleSendMessage}
          >
            <img src={message} className={styles.chatBox__sendIcon} alt="전송" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

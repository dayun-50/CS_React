import styles from "./ChatBox.module.css"; // CSS 모듈 임포트
import attach from "./icon/Attach.svg"; // 첨부파일 아이콘
import message from "./icon/message.svg"; // 메시지 전송 아이콘
import collapse from "./icon/Collapse Arrow.svg"; // 접기/정렬 아이콘
import search from "./icon/Search.svg"; // 검색 아이콘
import useChatBox from "./useChatBox"; // 커스텀 훅: 채팅 로직 처리
import { useState, useRef, useEffect } from "react"; // React 훅

const ChatBox = ({ seq }) => {
  // 커스텀 훅 사용
  const {
    id, // 현재 로그인한 유저 id
    room, // 채팅방 정보
    messages: originalMessages, // 서버에서 받아온 메시지
    input, // 입력창 상태 { message: "" }
    setInput, // 입력창 상태 업데이트 함수
    sendMessage, // 서버로 메시지 전송 함수
    handleKeyDown, // 입력창에서 키 이벤트 처리
    messageListRef, // 메시지 리스트 scroll 참조
  } = useChatBox(seq);

  // 로컬 상태
  const [messages, setMessages] = useState(originalMessages); // 정렬/추가용 메시지 상태
  const [fileNames, setFileNames] = useState([]); // 첨부 파일명 배열
  const [showCollapseDropdown, setShowCollapseDropdown] = useState(false); // 정렬 드롭다운 표시 여부
  const [collapseButtonText, setCollapseButtonText] = useState("메시지"); // 드롭다운 선택 텍스트

  const buttonRef = useRef(null); // 드롭다운 버튼 ref
  const [dropdownWidth, setDropdownWidth] = useState(0); // 드롭다운 너비

  // originalMessages가 바뀌면 로컬 messages 상태도 업데이트
  useEffect(() => {
    setMessages(originalMessages);
  }, [originalMessages]);

  // 파일 선택 이벤트 처리
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // FileList → 배열
    const names = files.map((file) => file.name); // 파일명 추출
    setFileNames(names);
  };

  // 접기/정렬 버튼 클릭
  const handleCollapseClick = () => {
    if (buttonRef.current) setDropdownWidth(buttonRef.current.offsetWidth); // 드롭다운 너비 계산
    setShowCollapseDropdown((prev) => !prev); // 드롭다운 토글
  };

  // 드롭다운 옵션 클릭 (메시지/날짜 정렬)
  const handleCollapseOptionClick = (option) => {
    setShowCollapseDropdown(false); // 드롭다운 닫기
    setCollapseButtonText(option); // 버튼 텍스트 변경

    // 메시지 정렬
    const sortedMessages = [...messages];
    if (option === "날짜") {
      sortedMessages.sort(
        (a, b) => new Date(a.message_at || Date.now()) - new Date(b.message_at || Date.now())
      ); // timestamp 기준 오름차순 정렬
    } else if (option === "메시지") {
      sortedMessages.sort((a, b) =>
        a.message.localeCompare(b.message, "ko")
      ); // 메시지 내용 기준 가나다순 정렬
    }
    setMessages(sortedMessages);
  };

  // timestamp 포맷팅 (시:분)
  const formatTimestamp = (ts) => {
    const date = ts ? new Date(ts) : new Date();
    if (isNaN(date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 메시지 전송 시 로컬 상태에 바로 추가
  const handleSendMessage = () => {
    if (!input.message.trim()) return; // 공백 메시지 전송 방지

    const newMsg = {
      chat_seq: Date.now(), // 임시 고유값
      message_seq: messages.length, // 순서
      member_email: id, // 작성자
      message: input.message, // 내용
      message_at: new Date().toISOString(), // 전송 시간
    };

    sendMessage(); // 서버로 전송
    setMessages((prev) => [...prev, newMsg]); // 로컬 상태에 추가

    setInput((prev) => ({ ...prev, message: "" })); // 입력창 초기화
    setFileNames([]); // 첨부 파일 초기화
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.chatBox__container}>
        {/* ================== 헤더 ================== */}
        <div className={styles.chatBox__headerWrapper}>
          <b className={styles.chatBox__header}>
            {room.title} / {room.memberCount} 명
          </b>

          {/* 상단 컨트롤 (검색 + 정렬 버튼) */}
          <div className={styles.chatBox__topControls}>
            {/* 검색 바 */}
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

            {/* 정렬/접기 버튼 */}
            <div
              className={styles.chatBox__collapseWrapper}
              style={{ position: "relative" }} // 드롭다운 위치 기준
            >
              <button
                ref={buttonRef}
                className={styles.chatBox__collapseBtn}
                onClick={handleCollapseClick}
              >
                {collapseButtonText}
                <img
                  src={collapse}
                  alt="접기 아이콘"
                  className={styles.chatBox__collapseIcon}
                />
              </button>

              {/* 드롭다운 메뉴 */}
              {showCollapseDropdown && (
                <div
                  className={styles.chatBox__sortDropdown}
                  style={{ width: dropdownWidth }} // 버튼 너비와 동일
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

        {/* ================== 메시지 리스트 ================== */}
        <div className={styles.chatBox__messageList} ref={messageListRef}>
          {messages.map((msg, i) => (
            <div
              key={`${msg.chat_seq}-${msg.message_seq}`} // 고유 키
              className={`${styles.chatBox__messageWrapper} ${
                msg.member_email === id
                  ? styles["chatBox__messageWrapper--right"] // 본인 메시지 오른쪽
                  : styles["chatBox__messageWrapper--left"] // 타인 메시지 왼쪽
              }`}

            >
              <div className={styles.chatBox__message}>{msg.message}</div>
              <div className={styles.chatBox__timestamp}>
                {formatTimestamp(msg.message_at)}
              </div>
            </div>
          ))}
        </div>

        {/* ================== 입력창 ================== */}
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
              style={{ display: "none" }} // 숨김 input
            />
          </div>

          {/* 텍스트 입력창 */}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(); // 엔터 → 메시지 전송
              } else {
                handleKeyDown(e); // Shift+Enter 등 처리
              }
            }}
          />

          {/* 전송 버튼 */}
          <button className={styles.chatBox__sendButton} onClick={handleSendMessage}>
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

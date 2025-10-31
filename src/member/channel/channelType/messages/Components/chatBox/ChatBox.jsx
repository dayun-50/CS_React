import styles from "./ChatBox.module.css";
import attach from "./icon/Attach.svg";
import message from "./icon/message.svg";
import collapse from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import useChatBox from "./useChatBox";
import { useState, useRef, useEffect } from "react";


const ChatBox = ({ seq, setAlertRooms, onFileUploaded }) => {
  const {
    id, room, messages: originalMessages, input,
    setInput, sendMessage, handleKeyDown,
    messageListRef
  } = useChatBox(seq, setAlertRooms, onFileUploaded);

  // 화면에 표시할 메시지 목록 (로컬 복사본)
  // originalMessages가 바뀌면 아래 useEffect에서 동기화함.
  const [messages, setMessages] = useState(originalMessages);

  // 정렬 드롭다운, 검색창 등 UI 상태
  const [showCollapseDropdown, setShowCollapseDropdown] = useState(false);
  const [collapseButtonText, setCollapseButtonText] = useState("메시지");
  const buttonRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [searchText, setSearchText] = useState("");

  // 직급 코드 → 레이블 매핑
  const levelMap = {
    LEVEL01: "사원",
    LEVEL02: "대리",
    LEVEL03: "과장",
    LEVEL04: "차장",
    LEVEL05: "부장",
  };

  // 외부(originalMessages) 변경을 로컬(messages)로 반영
  useEffect(() => setMessages(originalMessages), [originalMessages]);


  //---------------------------------------------------------파일
  // 현재 입력폼에서 첨부된 파일들 (File 객체 배열)
  // 사용자가 <input type="file">로 파일을 선택하면 handleFileChange에서 설정.
  const [fileList, setFileList] = useState([]);
  //파일 선택하면 상태변수배열로 저장
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };
  //상태변수 배열 없애기
  const handleRemoveFile = (index) => {
    const newFileList = fileList.filter((_, i) => i !== index);
    setFileList(newFileList);
    // 파일 input 내부 값도 직접 변경해주기
    const fileInput = document.getElementById("fileUpload");
    if (fileInput?.files) {
      const dt = new DataTransfer();
      newFileList.forEach((f) => dt.items.add(f));
      fileInput.files = dt.files;
    }
  };




  //드롭다운
  const handleCollapseClick = () => {
    if (buttonRef.current) setDropdownWidth(buttonRef.current.offsetWidth);
    setShowCollapseDropdown((prev) => !prev);
  };
  /**
   * 정렬 옵션 선택 시 메시지 정렬
   * - "날짜": message_at 기준으로 정렬
   * - "메시지": 텍스트 내용 기준으로 정렬 (localeCompare)
   *
   * 로컬 messages 배열을 정렬해서 setMessages 호출
   */
  const handleCollapseOptionClick = (option) => {
    setShowCollapseDropdown(false);
    setCollapseButtonText(option);

    const sortedMessages = [...messages];
    if (option === "날짜") {
      sortedMessages.sort(
        (a, b) =>
          new Date(a.message_at || Date.now()) - new Date(b.message_at || Date.now())
      );
    } else if (option === "메시지") {
      sortedMessages.sort((a, b) => a.message.localeCompare(b.message, "ko"));
    }
    setMessages(sortedMessages);
  };
  //시간 포맷용 --ui
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

    // 3) UI 즉시 반영을 위한 임시 메시지 객체 생성
    //    - chat_seq, message_seq는 임시로 Date.now()나 messages.length로 만듦
    //    - files에는 로컬 미리보기 URL을 넣음(URL.createObjectURL)
    const newMsg = {
      chat_seq: Date.now(),
      message_seq: messages.length,
      member_email: id,
      message: input.message,
      message_at: new Date().toISOString(),
      name: "나",
      level_code: "",
    };

    // 로컬 messages에 즉시 추가 -> 사용자에게 즉시 반영됨
    setMessages((prev) => [...prev, newMsg]);

    // 4) 입력 및 파일 상태 초기화
    setInput({ message: "" });
    setFileList([]);

    // 파일 input 엘리먼트의 값도 리셋(브라우저가 같은 파일 재선택을 허용하도록)
    const fileInput = document.getElementById("fileUpload");
    if (fileInput) fileInput.value = "";
  };

  /**
   * 검색창 엔터 핸들러 (메시지 또는 날짜 검색)
   * - collapseButtonText가 "메시지"인지 "날짜"인지에 따라 검색 방식 분기
   * - 찾으면 해당 메시지 DOM으로 스크롤
   */
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
        const targetEl = document.getElementById(
          `msg-${targetMsg.chat_seq}-${targetMsg.message_seq}`
        );
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
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
        {/* 헤더: 방 제목 / 인원수 */}
        <div className={styles.chatBox__headerWrapper}>
          <b className={styles.chatBox__header}>
            {room.title} / {room.memberCount} 명
          </b>

          {/* 우측 상단: 검색창 + 정렬 버튼 */}
          <div className={styles.chatBox__topControls}>
            <div className={styles.chatBox__searchBar}>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                className={styles.chatBox__searchInput}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleSearchEnter}
              />
              <img src={search} className={styles.chatBox__searchIcon} alt="검색 아이콘" />
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

        {/* 메시지 리스트 (스크롤 가능한 영역) */}
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
              {/* 상대방 메시지면 이름/직급 표시 (예: 홍길동 / 과장) */}
              {msg.member_email !== id && (
                <div className={styles.chatBox__sender}>
                  {`${msg.name || msg.member_email} / ${levelMap[msg.level_code] || ""}`}
                </div>
              )}

              {/* 말풍선(메시지 본문 + 파일 리스트) 및 타임스탬프 */}
              <div className={styles.chatBox__messageInner}>
                {/* 말풍선 내부: 텍스트 + 파일 목록을 함께 보여줌 */}
                <div className={styles.chatBox__message}>


                  {/* 파일 여부에 따라 조건부 렌더링 */}
                  {!msg.sysname ? (
                    msg.message && <div>{msg.message}</div> // 파일이 없으면 일반 메시지 표시
                  ) : (
                    // 파일이 있으면 a태그로 다운로드 링크 표시
                    <div>
                      <a href={`http://10.10.55.103/file/download?sysname=${encodeURIComponent(msg.sysname)}&file_type=${encodeURIComponent(msg.file_type)}`}
                        target="_blank" rel="noopener noreferrer" download>
                        {msg.oriname || msg.message}
                      </a>
                    </div>
                  )}

                </div>

                {/* 말풍선 오른쪽(또는 왼쪽)에 표시되는 시간 */}
                <div className={styles.chatBox__timestamp}>
                  {formatTimestamp(msg.message_at)}
                </div>
              </div>
            </div>
          ))}
        </div>




        {/* 입력영역: 파일첨부 + 텍스트 입력 + 전송 */}
        <div className={styles.chatBox__inputArea}>
          {/* 파일 첨부 버튼: 실제 파일 input은 숨겨져 있고 label 클릭으로 열림 */}
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
            {/* 실제 파일 입력: 여러 파일 선택 가능 */}
            <input
              type="file"
              id="fileUpload"
              multiple
              onChange={handleFileChange} // 파일 선택 시 handleFileChange 호출 -> fileList 상태 업데이트
              style={{ display: "none" }}
            />
          </div>

          {/* 텍스트 입력 영역 (파일 미리보기 오버레이 포함) */}
          <div style={{ flexGrow: 1, position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              className={styles.chatBox__inputText}
              value={input.message} // useChatBox 훅에서 제공하는 입력 상태
              placeholder="메시지를 입력하세요"
              onChange={(e) => setInput((prev) => ({ ...prev, message: e.target.value }))}
              onKeyDown={(e) => {
                // 엔터(Shift+Enter 제외) 누르면 전송
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(); // 핵심 전송 함수 호출
                } else {
                  handleKeyDown(e); // 기타 키 처리(예: 글자수 체크 등)
                }
              }}
              style={{ flexGrow: 1, paddingRight: "8px" }}
            />

            {/* 파일 첨부 후 전송 전 미리보기 (작게 표시) */}
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
                      onClick={() => handleRemoveFile(i)} // 미리보기에서 파일 제거
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

          {/* 전송 버튼 (클릭 시 handleSendMessage 호출) */}
          <button className={styles.chatBox__sendButton} onClick={handleSendMessage}>
            <img src={message} className={styles.chatBox__sendIcon} alt="전송" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

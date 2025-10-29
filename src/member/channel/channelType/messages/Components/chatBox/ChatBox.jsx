import styles from "./ChatBox.module.css";
import attach from "./icon/Attach.svg";
import message from "./icon/message.svg";
import collapse from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import useChatBox from "./useChatBox";
import { useState, useRef, useEffect } from "react";

/**
 * ChatBox 컴포넌트 — 상세 동작 주석 포함
 *
 * 이 파일에는 "파일/메시지 전송"이 실제로 어떻게 흐르는지 (사용자 입력 -> FormData 구성 -> sendMessage 호출 ->
 * 로컬 UI 반영 -> 입력 초기화) 단계별로 매우 상세한 주석을 달아두었습니다.
 *
 * **중요 포인트 요약**
 * 1. 파일 선택: <input type="file">에서 change 이벤트로 파일을 읽어 fileList 상태에 저장.
 * 2. 전송(엔터/버튼): handleSendMessage 호출.
 * 3. handleSendMessage 내부:
 *    - input.message와 fileList 상태를 검사해 전송 가능 여부 판단.
 *    - FormData에 message와 files를 append해서 sendMessage(formData) 호출 (서버 전송).
 *    - UI 즉시 반영을 위해 임시 메시지 객체(newMsg)를 만들어 messages 상태에 추가.
 *    - 파일은 URL.createObjectURL로 임시 미리보기 링크(url)를 생성해서 newMsg.files에 넣음.
 *    - 입력창과 fileList, file input 요소를 초기화.
 *
 * 4. 서버 응답(여기서는 useChatBox 훅에서 처리)으로 실제 메시지 목록이 바뀌면 originalMessages가 바뀌고,
 *    useEffect가 이를 받아 화면(messages 상태)을 갱신함.
 */

const ChatBox = ({ seq }) => {
  // useChatBox 훅에서 받아오는 값들 설명:
  // - id: 현재 로그인한 사용자의 고유 식별(이 예제에선 이메일)
  // - room: 현재 채팅방 메타데이터 (title, memberCount 등)
  // - originalMessages: 서버/소켓으로부터 받은 원본 메시지 배열 (외부 소스)
  // - input: 입력 폼 상태 (현재 입력 중인 텍스트 등)
  // - setInput: 입력 상태를 업데이트하는 함수
  // - sendMessage: 서버로 FormData 전송을 담당하는 함수 (useChatBox 내부에서 구현)
  // - handleKeyDown: (옵션) 입력 박스에서 키 입력을 처리하는 보조 함수
  // - messageListRef: 메시지 리스트 DOM에 대한 ref (스크롤 이동 등에서 사용)
  const {
    id,
    room,
    messages: originalMessages,
    input,
    setInput,
    sendMessage,
    handleKeyDown,
    messageListRef,
  } = useChatBox(seq);

  // 화면에 표시할 메시지 목록 (로컬 복사본)
  // originalMessages가 바뀌면 아래 useEffect에서 동기화함.
  const [messages, setMessages] = useState(originalMessages);

  // 현재 입력폼에서 첨부된 파일들 (File 객체 배열)
  // 사용자가 <input type="file">로 파일을 선택하면 handleFileChange에서 설정.
  const [fileList, setFileList] = useState([]);

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

  /**
   * 파일 선택 이벤트 핸들러
   *
   * e.target.files는 FileList(유사 배열) 입니다. Array.from으로 일반 배열로 변환해서
   * fileList 상태에 저장합니다. 이 상태는 나중에 handleSendMessage에서 FormData에 append됩니다.
   *
   * - fileList 항목은 실제 File 객체들을 포함합니다 (name, size, type, 등 접근 가능).
   * - 파일을 화면에 보여줄 때는 URL.createObjectURL 또는 서버에서 받은 URL을 사용합니다.
   */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };

  /**
   * 첨부한 파일 제거
   *
   * - fileList 배열에서 특정 인덱스 제거
   * - input[type=file]의 내부 파일 목록도 DataTransfer를 이용해 동기화 (브라우저에서 파일 input을 프로그래밍으로
   *   바꾸려면 DataTransfer를 사용해야 함)
   */
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

  /**
   * 정렬 버튼 클릭 — 드롭다운 보이기/숨기기
   * 버튼 너비를 재어 드롭다운 너비로 사용
   */
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

  /**
   * 타임스탬프 포맷터 (HH:mm)
   */
  const formatTimestamp = (ts) => {
    const date = ts ? new Date(ts) : new Date();
    if (isNaN(date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /**
   * 메시지/파일 전송 핵심 함수 (handleSendMessage)
   *
   * 흐름(세부 단계):
   * 1) 유효성 검사: 텍스트가 모두 공백이고 파일도 없으면 아무 동작 안 함.
   * 2) FormData 구성:
   *    - formData.append("message", input.message)
   *    - fileList.forEach(f => formData.append("files", f))
   *    => 이 FormData 객체를 sendMessage(formData)로 보냄. (sendMessage는 useChatBox에서 서버 전송 로직을 담당)
   * 3) 로컬 UI 즉시 반영:
   *    - 서버 응답을 기다리지 않고 즉시 화면에 보여주기 위해 newMsg 객체 생성
   *    - newMsg.files에 URL.createObjectURL(f)를 사용해 임시 브라우저 URL을 넣음(브라우저 로컬 미리보기)
   *      -> 주의: createObjectURL로 생성된 URL은 나중에 URL.revokeObjectURL로 해제해주는 것이 메모리 누수 방지에 좋음.
   *    - setMessages(prev => [...prev, newMsg])로 화면에 추가
   * 4) 입력 초기화:
   *    - setInput({ message: "" })
   *    - setFileList([])
   *    - file input 요소의 value를 ""로 리셋
   *
   * NOTE: 서버에서 실제로 메시지와 파일 URL을 반환하면 useChatBox 훅이 originalMessages를 업데이트하고
   *       useEffect가 messages를 동기화함. 그러면 로컬의 임시 메시지는 서버에서 온 정식 메시지로
   *       대체(또는 추가)될 수 있음.
   */
  const handleSendMessage = () => {
    // 1) 텍스트가 공백이고 파일 없음 -> 전송 중단
    if (!input.message.trim() && fileList.length === 0) return;

    // 2) FormData 준비 (서버 전송을 위한 포맷)
    //const formData = new FormData();
    // 텍스트 메시지 포함
    //formData.append("message", input.message);
    // 파일들을 files 필드에 append (백엔드에서 동일한 필드명으로 받도록 구현되어 있어야 함)
    //for (const file of fileList) {
    //  form.append("fileList", file)
    //}

    // 실제 네트워크 전송은 useChatBox 훅의 sendMessage가 담당.
    // sendMessage(formData)는 보통 fetch/axios 또는 WebSocket을 통해 서버로 보냄.
    // (sendMessage 내부에서 성공/실패 콜백, 에러 처리 등이 있을 수 있음)

    // 파일 먼저 전송 (바이너리)
    for (const blob of fileList) {
      sendMessage(blob);
    }



    // 3) UI 즉시 반영을 위한 임시 메시지 객체 생성
    //    - chat_seq, message_seq는 임시로 Date.now()나 messages.length로 만듦
    //    - files에는 로컬 미리보기 URL을 넣음(URL.createObjectURL)
    const newMsg = {
      chat_seq: Date.now(),
      message_seq: messages.length,
      member_email: id,
      message: input.message,
      files: fileList.map((f) => ({
        name: f.name,
        // URL.createObjectURL은 브라우저에서 File 객체에 접근해 임시 URL을 만들어줌.
        // 클릭하면 브라우저가 미리보기를 보여주거나 다운로드가 가능.
        // (참고: 이 URL은 임시이므로 사용 후 URL.revokeObjectURL로 해제해주는 것이 권장됨)
        url: URL.createObjectURL(f),
      })),
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
                  {/* 텍스트 메시지가 비어있지 않으면 표시 */}
                  {msg.message && <div>{msg.message}</div>}

                  {/* 파일이 있으면 말풍선 내부에 링크로 표시
                      - 현재 코드는 `download` 속성을 사용해서 클릭하면 다운로드를 시도함.
                      - 만약 새 탭 미리보기를 원하면 `download` 제거.
                   */}
                  {msg.files && msg.files.length > 0 && (
                    <div className={styles.chatBox__fileList}>
                      {msg.files.map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          download
                          className={styles.chatBox__fileLink}
                        >
                          📎 {file.name}
                        </a>
                      ))}
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

import styles from "./ChatBox.module.css";
import attach from "./icon/Attach.svg";
import message from "./icon/message.svg";
import collapse from "./icon/Collapse Arrow.svg";
import search from "./icon/Search.svg";
import { useLocation } from "react-router-dom";
import useChatBox from "./useChatBox";

const ChatBox = ({ seq }) => {

  const {
    id, room, messages, input,
    setInput, sendMessage, handleKeyDown,
    messageListRef
  } = useChatBox(seq);

  return (
    <div className={styles.chatBox}>
      <div className={styles.chatBox__container}>
        <div className={styles.chatBox__headerWrapper}>
          {/* 상단 고정 헤더에 제목이랑 인원수 나와야함 */}
          <b className={styles.chatBox__header}>{room.title} / {room.memberCount} 명</b>

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

            <button className={styles.chatBox__collapseBtn}>
              <span>메시지</span>
              <img
                src={collapse}
                alt="접기 아이콘"
                className={styles.chatBox__collapseIcon}
              />
            </button>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className={styles.chatBox__messageList} ref={messageListRef}>
          {messages.map((msg) => (
            <div
              key={msg.message_seq}
              className={`${styles.chatBox__message} ${msg.member_email == id
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
          <div className={styles.chatBox__attachButton}>
            <button>
              <img
                src={attach}
                className={styles.chatBox__inputIcon}
                alt="파일 첨부"
              />
            </button>
          </div>

          <input
            type="text"
            className={styles.chatBox__inputText}
            placeholder="메시지를 입력하세요"
            value={input.message}
            onChange={(e) => setInput(prev => ({ ...prev, message: e.target.value }))}
            onKeyDown={handleKeyDown}
          />

          <button
            className={styles.chatBox__sendButton}
            onClick={sendMessage}
          >
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

import { useEffect, useState } from "react";
import styles from "./MessagesIndex.module.css";
import Attendance from "./Components/attendance/Attendance";
import ChannelName from "./Components/channelName/ChannelName";
import ChatBox from "./Components/chatBox/ChatBox";
import CompletedChannel from "./Components/completedChannel/CompletedChannel";
import FileBox from "./Components/fileBox/FileBox";
import OutBox from "./Components/outBox/OutBox";
import ChatRoomPlus from "./Components/chatroomPlus/ChatRoomPlus";
import addIcon from "./icon/Add.svg";
import addIconActive from "./icon/Add-active.svg";
import { useOutletContext } from "react-router-dom";
import { caxios } from "../../../../config/config";

const MessagesIndex = ({ selectedSeq, setSelectedSeq }) => {
  const [isActive, setIsActive] = useState(false);
  // 알람 상태변수
  const [alertRooms, setAlertRooms] = useState([]);
  const [rooms, setRooms] = useState(false);
  const id = sessionStorage.getItem("id");

  const handleChannelClick = (seq) => {
    console.log("메세지인덱스", selectedSeq);
    setSelectedSeq(seq); // 클릭된 채널 seq 저장
  };

  // 채널 추가 버튼
  const handleClick = () => {
    setIsActive(true);
    // alert("채널 추가 클릭");
  };

  // ---------------- 모달 관련 함수 ----------------
  const handleClose = () => {
    setIsActive(false);
  };

  const handleSelect = (selectedPeople) => {
    console.log("선택된 참여자:", selectedPeople);
    // 여기서 채널 생성 API 호출하거나 상태 업데이트 로직 작성 가능
    caxios.post("/chat/newCaht", { owner_email: id, contact_seq: selectedPeople }, { withCredentials: true })
      .then(resp => {
        setRooms(prev => !prev);
      })
      .catch(err => console.log(err))
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.leftContentWrapper}>
          <Attendance selectedSeq={selectedSeq} onChannelClick={handleChannelClick} alertRooms={alertRooms} setAlertRooms={setAlertRooms} />
          <ChannelName newRooms={rooms} selectedSeq={selectedSeq} onChannelClick={handleChannelClick} alertRooms={alertRooms} setAlertRooms={setAlertRooms} />
          <CompletedChannel selectedSeq={selectedSeq} onChannelClick={handleChannelClick} alertRooms={alertRooms} />

        </div>

        {/* 아래 고정된 추가 버튼 */}
        <div className={styles.buttonWrapper}>
          <button
            type="button"
            className={styles.addParent}
            onClick={handleClick}
          >
            <img
              className={`${styles.addIcon} ${styles.defaultIcon}`}
              src={addIcon}
              alt="추가 아이콘 기본"
            />
            <img
              className={`${styles.addIcon} ${styles.hoverIcon}`}
              src={addIconActive}
              alt="추가 아이콘 호버"
            />
            <span className={styles.chatRoom}>채널 추가</span>
          </button>{" "}
        </div>
      </div>

      <div className={styles.centerColumn}>
        {/* 채팅방을 클릭해서 seq 반환시에만 랜더링 */}
        {selectedSeq && <ChatBox seq={selectedSeq} setAlertRooms={setAlertRooms} />}

      </div>
      <div className={styles.rightColumn}>
        <div className={styles.fileBox}>
          <FileBox />
        </div>
        <div className={styles.outBox}>
          <OutBox />
        </div>
      </div>

      {/* ---------------- 채널 추가 모달 ---------------- */}
      {isActive && (
        <ChatRoomPlus
          onClose={handleClose}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

export default MessagesIndex;

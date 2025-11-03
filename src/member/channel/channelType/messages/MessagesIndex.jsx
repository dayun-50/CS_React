import { useCallback, useEffect, useState } from "react";
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
  // 컴플리트
  const [isOn, setIsOn] = useState(true);
  // 인원 카운트 
  const [memberCount, setMemberCount] = useState("");
  // 채팅방 추가시 제목...
  const [title, setTitle] = useState("");
  // 부서 단체 체팅방 seq
  const [deptSeq, setDeptSeq] = useState("");

  const handleChannelClick = (seq) => {
    setSelectedSeq(seq); // 클릭된 채널 seq 저장
  };

  // 채널 추가 버튼
  const handleClick = () => {
    setIsActive(true);
  };

  // ---------------- 모달 관련 함수 ----------------
  const handleClose = () => {
    setIsActive(false);
  };

  const handleSelect = (selectedPeople) => {
    console.log("선택된 참여자:", selectedPeople);
    // 여기서 채널 생성 API 호출하거나 상태 업데이트 로직 작성 가능
    caxios.post("/chat/newCaht", { owner_email: id, title: title, contact_seq: selectedPeople },
      { withCredentials: true })
      .then(resp => {
        setRooms(prev => !prev);
        setSelectedSeq(resp.data);
        setTitle("");
      })
      .catch(err => console.log(err))
  };


  //--------------------------------------------파일 동기화
  const [fileTrigger, setFileTrigger] = useState(false);
  const handleFileUploaded = useCallback(() => {
    setFileTrigger(prev => !prev); // true ↔ false 반복
  }, []);




  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.leftContentWrapper}>
          <Attendance selectedSeq={selectedSeq} onChannelClick={handleChannelClick} alertRooms={alertRooms} setAlertRooms={setAlertRooms} />
          <ChannelName setDeptSeq={setDeptSeq} isOn={isOn} newRooms={rooms} selectedSeq={selectedSeq} onChannelClick={handleChannelClick} alertRooms={alertRooms} setAlertRooms={setAlertRooms} />
          <CompletedChannel isOn={isOn} selectedSeq={selectedSeq} onChannelClick={handleChannelClick} alertRooms={alertRooms} />

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
        {selectedSeq ? (
    <ChatBox
      seq={selectedSeq}
      isOn={isOn}
      setAlertRooms={setAlertRooms}
      setMemberCount={setMemberCount}
      onFileUploaded={handleFileUploaded}
    />
  ) : (
    <div className={styles.noChatSelected}>
      채팅방을 선택해주세요.
    </div>
  )}
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.fileBox}>
          <FileBox key={selectedSeq} seq={selectedSeq} trigger={fileTrigger} />
        </div>
        <div className={styles.outBox}>
          <OutBox deptSeq={deptSeq} setSelectedSeq={setSelectedSeq} seq={selectedSeq} isOn={isOn} setIsOn={setIsOn} memberCount={memberCount} />
        </div>
      </div>

      {/* ---------------- 채널 추가 모달 ---------------- */}
      {isActive && (
        <ChatRoomPlus
          onClose={handleClose}
          onSelect={handleSelect}
          title={title}
          setTitle={setTitle}
        />
      )}
    </div>
  );
};

export default MessagesIndex;

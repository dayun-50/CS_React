import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./ScheduleBox.module.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

moment.locale("ko");
const localizer = momentLocalizer(moment);

// 커스텀 툴바
const CustomToolbar = ({ label, onNavigate }) => {
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      {/* 오늘 버튼 */}
      <button
        style={{
          width: "150px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          color: "white",
          backgroundColor: "#0090FF",
          fontSize: "18px",
          border: "1px solid #ccc",
          fontWeight: "bold",
          cursor: "pointer"
        }}
        onClick={() => onNavigate("TODAY")}
      >
        오늘
      </button>

      {/* 이전, 현재, 다음 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* 이전 버튼 */}
        <button
          className="backnext"
          onClick={() => onNavigate("PREV")}
          onMouseEnter={() => setPrevHover(true)}
          onMouseLeave={() => setPrevHover(false)}
          style={{
            width: "150px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            border: "1px solid #ccc",
            backgroundColor: prevHover ? "#0090FF" : "#D9D9D9",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            marginRight: "20px"
          }}
        >
          <IoIosArrowBack /> 이전
        </button>

        {/* 현재 월/연도 */}
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>{label}</span>

        {/* 다음 버튼 */}
        <button
          className="backnext"
          onClick={() => onNavigate("NEXT")}
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
          style={{
            width: "150px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            border: "1px solid #ccc",
            backgroundColor: nextHover ? "#0090FF" : "#D9D9D9",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            marginLeft: "20px"
          }}
        >
          다음 <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

const ScheduleBox = () => {
  const [events, setEvents] = useState([]);

  // 이벤트 추가
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("이벤트 제목을 입력하세요:");
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start,
          end,
        },
      ]);
    }
  };

  // 이벤트 삭제
  const handleSelectEvent = (event) => {
    if (window.confirm(`"${event.title}" 이벤트를 삭제하시겠습니까?`)) {
      setEvents(events.filter((e) => e !== event));
    }
  };

  // 이벤트 스타일 지정
  const eventStyleGetter = (event) => {
    let backgroundColor = "#00C7BE"; // 기본 민트
    if (event.title.includes("휴가")) backgroundColor = "#007AFF"; // 파랑
    else if (event.title.includes("회의")) backgroundColor = "#FF9500"; // 오렌지
    else if (event.title.includes("긴급")) backgroundColor = "#FF3B30"; // 빨강
    else if (event.title.includes("서류")) backgroundColor = "#AF52DE"; // 보라

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        color: "white",
        border: "none",
        padding: "2px",
      },
    };
  };

  return (
    <div className={styles.calender}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        style={{ width: "100%", height: "100%" }}
        eventPropGetter={eventStyleGetter}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        culture="ko"
        messages={{
          today: "오늘",
          month: "월",
          week: "주",
          day: "일",
          agenda: "일정",
          date: "날짜",
          time: "시간",
          event: "이벤트",
          allDay: "종일",
          noEventsInRange: "선택한 기간에 이벤트가 없습니다.",
        }}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
};

export default ScheduleBox;

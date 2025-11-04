import { useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./ScheduleBox.module.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useScheduleBox from "./useScheduleBox";
import { useParams } from "react-router-dom";

moment.locale("ko");
const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate }) => {
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  return (
    <div className={styles.toolbar}>
      <button className={`${styles.toolbarBtn} ${styles.todayBtn}`} onClick={() => onNavigate("TODAY")}>
        오늘
      </button>
      <div className={styles.navButtons}>
        <button
          className={styles.backnext}
          onClick={() => onNavigate("PREV")}
          onMouseEnter={() => setPrevHover(true)}
          onMouseLeave={() => setPrevHover(false)}
          style={{ backgroundColor: prevHover ? "#0090FF" : "#D9D9D9" }}
        >
          <IoIosArrowBack /> 이전
        </button>
        <span className={styles.currentLabel}>{label}</span>
        <button
          className={styles.backnext}
          onClick={() => onNavigate("NEXT")}
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
          style={{ backgroundColor: nextHover ? "#0090FF" : "#D9D9D9" }}
        >
          다음 <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

const CustomEvent = ({ event }) => (
  <div className={styles.eventCard} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div className={styles.eventTitle}>{event.title}</div>
    <div className={styles.eventTime} style={{ marginLeft: "8px", fontSize: "14px", color: "white", fontWeight: "bold" }}>
      {moment(event.start).format("MM/DD")} - {moment(event.end).subtract(1, "days").format("MM/DD")}
    </div>
  </div>
);

const ScheduleBox = ({ seq, selectedEmails, setSelectedEmails }) => {
  const [events, setEvents] = useState([]);
  const { sevaEvent, handleSelectEvent } = useScheduleBox(events, setEvents, seq, selectedEmails);

  // 캘린더 루트를 참조
  const calendarRef = useRef(null);
  const lastManualClickRef = useRef(0);

  const eventStyleGetter = (event) => {
    let backgroundColor = "#00C7BE";
    if (event.title.includes("휴가")) backgroundColor = "#007AFF";
    else if (event.title.includes("회의")) backgroundColor = "#FF9500";
    else if (event.title.includes("긴급")) backgroundColor = "#FF3B30";
    else if (event.title.includes("서류")) backgroundColor = "#AF52DE";

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        color: "white",
        border: "none",
        padding: "3px 6px",
        fontWeight: "500",
      },
    };
  };

  const handleAddEvent = (start, end) => {
    const startMoment = moment(start).startOf("day");
    const endMoment = moment(end).startOf("day");
    const title = prompt(`${startMoment.format("MM/DD")} 일정 제목을 입력하세요:`);
    if (!title) return;
    let color = "#00C7BE";
    if (title.includes("휴가")) color = "#007AFF";
    else if (title.includes("회의")) color = "#FF9500";
    else if (title.includes("긴급")) color = "#FF3B30";
    else if (title.includes("서류")) color = "#AF52DE";

    const newEvent = {
      title,
      color,
      start: startMoment.toISOString(),
      end: endMoment.isSameOrBefore(startMoment) ? startMoment.clone().add(1, "day").toISOString() : endMoment.toISOString(),
    };

    setEvents((prev) => [...prev, newEvent]);
    if (typeof sevaEvent === "function") sevaEvent(newEvent);
  };

  // 루트에 캡처링(click) 이벤트 하나만 붙이는 방식 (더 튼튼)
  useEffect(() => {
    const root = document.querySelector(".rbc-calendar") || document.querySelector(".rbc-month-view") || calendarRef.current;
    if (!root) {
      console.log("[ScheduleBox] calendar root not found yet");
      return;
    }

    const clickHandler = (e) => {
      // 디버그: 클릭된 요소
      // console.log("Calendar clicked target:", e.target);

      // 1) 먼저 rbc-button-link (날짜 버튼) 탐색
      const btn = e.target.closest(".rbc-button-link");
      if (btn && btn.hasAttribute("data-date")) {
        const dateAttr = btn.getAttribute("data-date");
        console.log("[ScheduleBox] clicked button dateAttr:", dateAttr);
        const date = new Date(dateAttr);
        lastManualClickRef.current = Date.now();
        handleAddEvent(date, moment(date).add(1, "day").toDate());
        e.stopPropagation();
        return;
      }

      // 2) 또는 rbc-date-cell 데이터-속성 탐색
      const cell = e.target.closest(".rbc-date-cell");
      if (cell) {
        // try data-date on either the cell or a child
        const dateAttr = cell.getAttribute("data-date") || (cell.querySelector("[data-date]") && cell.querySelector("[data-date]").getAttribute("data-date"));
        if (dateAttr) {
          console.log("[ScheduleBox] clicked cell dateAttr:", dateAttr);
          const date = new Date(dateAttr);
          lastManualClickRef.current = Date.now();
          handleAddEvent(date, moment(date).add(1, "day").toDate());
          e.stopPropagation();
          return;
        }
      }

      // else: not a date click
    };

    // 캡처 단계로 붙이면 내부 버튼이 stopPropagation 해도 잡을 수 있음
    root.addEventListener("click", clickHandler, true);

    console.log("[ScheduleBox] attached calendar click handler");

    return () => {
      root.removeEventListener("click", clickHandler, true);
      console.log("[ScheduleBox] removed calendar click handler");
    };
    // events 제외: 루트는 한 번만 붙이면 됨. 필요하면 events 변경 시에도 다시 붙일 수 있음.
  }, []); // 빈 deps: mount 시 한 번

  // Calendar의 onSelectSlot 처리 (드래그로 여러일 선택)
  const lastManualGuardRef = lastManualClickRef; // alias
  const handleSelectSlot = (slotInfo) => {
    const { start, end, action } = slotInfo || {};
    const now = Date.now();
    if (now - lastManualGuardRef.current < 500) {
      lastManualGuardRef.current = 0;
      console.log("[ScheduleBox] ignored duplicate onSelectSlot due to manual click");
      return;
    }

    // 드래그 범위 처리
    if (action === "select" || (end && moment(end).diff(moment(start), "days") >= 1)) {
      handleAddEvent(start, end);
      return;
    }

    if (action === "click") {
      handleAddEvent(start, moment(start).add(1, "day").toDate());
      return;
    }

    handleAddEvent(start, moment(start).add(1, "day").toDate());
  };

  return (
    <div className={styles.calender} ref={calendarRef}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        popup={true}
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
        titleAccessor={(event) => `${event.title} (${moment(event.start).format("MM/DD")} - ${moment(event.end).format("MM/DD")})`}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
          popup: { event: CustomEvent },
        }}
      />
    </div>
  );
};

export default ScheduleBox;

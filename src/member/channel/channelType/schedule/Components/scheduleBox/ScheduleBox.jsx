import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./ScheduleBox.module.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

moment.locale("ko");
const localizer = momentLocalizer(moment);

// ─── 커스텀 툴바
const CustomToolbar = ({ label, onNavigate }) => {
    const [prevHover, setPrevHover] = useState(false);
    const [nextHover, setNextHover] = useState(false);

    return (
        <div className={styles.toolbar}>
            <button
                className={`${styles.toolbarBtn} ${styles.todayBtn}`}
                onClick={() => onNavigate("TODAY")}
            >
                오늘
            </button>

            <div className={styles.navButtons}>
                <button
                    className={styles.backnext}
                    onClick={() => onNavigate("PREV")}
                    onMouseEnter={() => setPrevHover(true)}
                    onMouseLeave={() => setPrevHover(false)}
                    style={{
                        backgroundColor: prevHover ? "#0090FF" : "#D9D9D9",
                    }}
                >
                    <IoIosArrowBack /> 이전
                </button>

                <span className={styles.currentLabel}>{label}</span>

                <button
                    className={styles.backnext}
                    onClick={() => onNavigate("NEXT")}
                    onMouseEnter={() => setNextHover(true)}
                    onMouseLeave={() => setNextHover(false)}
                    style={{
                        backgroundColor: nextHover ? "#0090FF" : "#D9D9D9",
                    }}
                >
                    다음 <IoIosArrowForward />
                </button>
            </div>
        </div>
    );
};

// ─── 커스텀 이벤트 (팝업 / 달력 공통)
const CustomEvent = ({ event }) => {
    // 종일 이벤트인지 확인
    const isAllDay =
        moment(event.start).format("HH:mm") === "00:00" &&
        moment(event.end).format("HH:mm") === "00:00";

    return (
        <div className={styles.eventCard}>
            <div className={styles.eventTitle}>{event.title}</div>
            {!isAllDay && (
                <div className={styles.eventTime}>
                    {moment(event.start).format("HH:mm")} -{" "}
                    {moment(event.end).format("HH:mm")}
                </div>
            )}
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

    // 이벤트 색상 스타일
    const eventStyleGetter = (event) => {
        let backgroundColor = "#00C7BE"; // 기본 민트
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

    return (
        <div className={styles.calender}>
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
                components={{
                    toolbar: CustomToolbar,
                    event: CustomEvent,
                }}
            />
        </div>
    );
};

export default ScheduleBox;

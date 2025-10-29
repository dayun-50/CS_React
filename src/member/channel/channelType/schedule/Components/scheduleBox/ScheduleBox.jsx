
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./ScheduleBox.module.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useScheduleBox from "./useScheduleBox";
import { event } from "jquery";
import { useParams } from "react-router-dom";


moment.locale("ko"); // moment 로케일을 한국어로 설정
const localizer = momentLocalizer(moment); // react-big-calendar에 moment 로컬라이저 적용

// ─── 커스텀 툴바 컴포넌트
const CustomToolbar = ({ label, onNavigate }) => {
    const [prevHover, setPrevHover] = useState(false); // 이전 버튼 호버 상태
    const [nextHover, setNextHover] = useState(false); // 다음 버튼 호버 상태

    return (
        <div className={styles.toolbar}>
            {/* 오늘 버튼 */}
            <button
                className={`${styles.toolbarBtn} ${styles.todayBtn}`}
                onClick={() => onNavigate("TODAY")}
            >
                오늘
            </button>

            <div className={styles.navButtons}>
                {/* 이전 버튼 */}
                <button
                    className={styles.backnext}
                    onClick={() => onNavigate("PREV")} // 이전 달/주/일 이동
                    onMouseEnter={() => setPrevHover(true)}
                    onMouseLeave={() => setPrevHover(false)}
                    style={{
                        backgroundColor: prevHover ? "#0090FF" : "#D9D9D9", // 호버 시 색상 변경
                    }}
                >
                    <IoIosArrowBack /> 이전
                </button>

                {/* 현재 표시되는 달/연도 */}
                <span className={styles.currentLabel}>{label}</span>

                {/* 다음 버튼 */}
                <button
                    className={styles.backnext}
                    onClick={() => onNavigate("NEXT")} // 다음 달/주/일 이동
                    onMouseEnter={() => setNextHover(true)}
                    onMouseLeave={() => setNextHover(false)}
                    style={{
                        backgroundColor: nextHover ? "#0090FF" : "#D9D9D9", // 호버 시 색상 변경
                    }}
                >
                    다음 <IoIosArrowForward />
                </button>
            </div>
        </div>
    );
};


const ScheduleBox = ({seq, selectedEmails, setSelectedEmails }) => {
    const [events, setEvents] = useState([]);
    const {
        sevaEvent, handleSelectEvent
    } = useScheduleBox(events, setEvents, seq, selectedEmails);

// ─── 커스텀 이벤트 카드 컴포넌트
const CustomEvent = ({ event }) => {
    return (
        <div className={styles.eventCard} style={{ display: "flex", justifyContent: "space-between" , alignItems: "center" }}>
            {/* 이벤트 제목 */}
            <div className={styles.eventTitle}>{event.title}</div>
            {/* 이벤트 기간 */}
            <div className={styles.eventTime} style={{ marginLeft: "8px", fontSize: "14px", color: "white", fontWeight: "bold" }}>
                {moment(event.start).format("MM/DD")} - {moment(event.end).subtract(1, "days").format("MM/DD")}
            </div>
        </div>
    );
};


const ScheduleBox = () => {
    const [events, setEvents] = useState([]); // 이벤트 배열 상태

    // ─── 이벤트 추가
    const handleSelectSlot = ({ start, end }) => {
        const title = prompt("이벤트 제목을 입력하세요:"); // 사용자 입력
        if (title) {
            // 이벤트 컬러 결정
            let color = "#00C7BE"; // 기본 민트
            if (title.includes("휴가")) color = "#007AFF";
            else if (title.includes("회의")) color = "#FF9500";
            else if (title.includes("긴급")) color = "#FF3B30";
            else if (title.includes("서류")) color = "#AF52DE";
            const newEvent =
                {
                    title,
                    color,
                    start: start.toISOString(), 
                    end: end.toISOString()
                };
            setEvents([...events, newEvent]);
            sevaEvent(newEvent);

        }
    };

    // ─── 이벤트 색상 지정
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
                localizer={localizer} // 로컬라이저 적용
                events={events} // 이벤트 배열
                startAccessor="start" // 이벤트 시작 날짜 키
                endAccessor="end" // 이벤트 종료 날짜 키
                defaultView="month" // 기본 달력 보기
                views={["month"]} // 보여줄 뷰 제한
                popup={true} // 이벤트 많을 시 +N 팝업 표시
                style={{ width: "100%", height: "100%" }}
                eventPropGetter={eventStyleGetter} // 이벤트 스타일 함수
                selectable={true} // 날짜 선택 가능
                onSelectSlot={handleSelectSlot} // 빈 칸 클릭 시 이벤트 추가
                onSelectEvent={handleSelectEvent} // 이벤트 클릭 시 삭제
                culture="ko" // 한국어 문화권
                messages={{ // 캘린더 텍스트 커스텀
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
                // ─── 이벤트 툴팁용 title
                titleAccessor={(event) => {
                    return `${event.title} (${moment(event.start).format(
                        "MM/DD"
                    )} - ${moment(event.end).format("MM/DD")})`;
                }}
                components={{ // 커스텀 컴포넌트
                    toolbar: CustomToolbar, // 툴바
                    event: CustomEvent,     // 이벤트 카드
                    popup: {
                        event: CustomEvent, // +N 팝업 이벤트 카드도 커스텀 적용
                    },
                }}
            />
        </div>
    );
};

export default ScheduleBox;

import { useState } from "react"; // React의 상태 관리 훅
import { Calendar, momentLocalizer } from "react-big-calendar"; // React Big Calendar 컴포넌트와 로컬라이저
import moment from "moment"; // 날짜/시간 처리 라이브러리
import "moment/locale/ko"; // 한국어 로케일 설정
import "react-big-calendar/lib/css/react-big-calendar.css"; // 캘린더 기본 스타일
import styles from "./ScheduleBox.module.css"; // CSS 모듈
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"; // 이전/다음 아이콘

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
            setEvents([
                ...events,
                {
                    title, // 이벤트 제목
                    start, // 시작 날짜
                    end,   // 종료 날짜
                },
            ]);
        }
    };

    // ─── 이벤트 삭제
    const handleSelectEvent = (event) => {
        if (window.confirm(`"${event.title}" 이벤트를 삭제하시겠습니까?`)) {
            setEvents(events.filter((e) => e !== event)); // 선택한 이벤트 제외
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

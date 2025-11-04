import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useScheduleBox(events, setEvents, seq, selectedEmails) {
    const id = sessionStorage.getItem("id");
    const [changed, setChanged] = useState(false);// 스케줄입력시 확인용  토글상태변수

    // 이벤트 추가 및 삭제마다 다시 랜더링
    useEffect(() => {
        const params = new URLSearchParams();
        selectedEmails.forEach(email => params.append("selectedEmails", email));
        caxios.post(`/schedule/eventsList?${params.toString()}`, { chat_seq: seq },
            { withCredentials: true })
            .then(resp => {
                setEvents(resp.data.map(e => ({
                    ...e,
                    schedule_seq: e.schedule_seq,
                    member_email: e.member_email,
                    title: e.title,
                    start: e.start,
                    end: e.end,
                    backgroundColor: e.color, // FullCalendar 이벤트 색상
                    allDay: e.allDay
                })));
            })
            .catch(err => {
                console.log(err);
            })
    }, [changed, selectedEmails])



    // 이벤트 서버에 전달
    const sevaEvent = ((events) => {
        caxios.post("/schedule/sevaEvent", {
            title: events.title,
            color: events.color,
            start_at: events.start,
            end_at: events.end,
            chat_seq: seq
        },
            { withCredentials: true })
            .then(resp=>setChanged(prev => !prev))
            .catch(err => {
                console.log(err);
            })
    })

    // 이벤트 삭제
    const handleSelectEvent = (event) => {
        if (event.member_email != id) { return }

        if (window.confirm(`"${event.title}" 이벤트를 삭제하시겠습니까?`)) {
            // 서버로 삭제 요청
            caxios.post("/schedule/deleteEvent", { schedule_seq: event.schedule_seq }, { withCredentials: true })
                .then(resp => {
                    setEvents(events.filter((e) => e.schedule_seq !== event.schedule_seq));
                })
                .catch(err => {
                    console.error("삭제 실패", err);
                });
        }
    }


    return {
        sevaEvent, handleSelectEvent
    }
}
export default useScheduleBox;
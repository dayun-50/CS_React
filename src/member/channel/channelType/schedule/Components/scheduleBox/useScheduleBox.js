import { useEffect } from "react";
import { caxios } from "../../../../../../config/config";

function useScheduleBox(events, setEvents, seq, selectMemberEvent) {
    const id = sessionStorage.getItem("id");

    // 이벤트 추가 및 삭제마다 다시 랜더링
    useEffect(() => {
        console.log(selectMemberEvent);
        caxios.post("/schedule/eventsList", { chat_seq: seq, member_email: id },
            { withCredentials: true })
            .then(resp => {
                setEvents(resp.data.map(e => ({
                    ...e,
                    title : e.title,
                    start: e.start,
                    end: e.end,
                    backgroundColor: e.color, // FullCalendar 이벤트 색상
                    allDay: e.allDay
                })));
            })
            .catch(err => {
                console.log(err);
            })
    }, [selectMemberEvent])

    // 이벤트 서버에 전달
    const sevaEvent = ((events) => {
        caxios.post("/schedule/sevaEvent", {
            title: events.title,
            color: events.color,
            start_at: events.start,
            end_at: events.end,
            member_email: id,
            chat_seq: seq
        },
            { withCredentials: true })
            .catch(err => {
                console.log(err);
            })
    })

    return {
        sevaEvent
    }
}
export default useScheduleBox;
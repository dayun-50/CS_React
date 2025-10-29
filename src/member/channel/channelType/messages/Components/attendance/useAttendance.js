import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useAttendance(onChannelClick, alertRooms, setAlertRooms) {

    // 출력 맴버 받을 준비
    const [members, setMembers] = useState([]);
    const [chatSeq, setChatSeq] = useState("");

    const id = sessionStorage.getItem("id");

    useEffect(() => {
        caxios.post("/chat/private", { email: id },
            { withCredentials: true })
            .then(resp => {
                setMembers(resp.data);
                setChatSeq(resp.data.chat_seq);
            })
            .catch(err => {
                console.log(err.data);
            });
    }, []);

    // 클릭이벤트
    const handleClickChat = (chat_seq) => {
        onChannelClick(chat_seq);
        if (onChannelClick) onChannelClick(chat_seq);
        if (alertRooms.chat_seq === chat_seq) {
            setAlertRooms({ chat_seq: "" });
        }
    }

    return {
        members, chatSeq,
        handleClickChat
    }
}
export default useAttendance;
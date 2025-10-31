import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";
import { PiReadCvLogo } from "react-icons/pi";

function useAttendance(onChannelClick, alertRooms, setAlertRooms) {

    // 출력 맴버 받을 준비
    const [members, setMembers] = useState([]);
    const [chatSeq, setChatSeq] = useState("");

    const id = sessionStorage.getItem("id");

    useEffect(() => {
        caxios.post("/chat/private", { email: id },
            { withCredentials: true })
            .then(resp => {
                console.log(resp.data);
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
        setAlertRooms(prev => prev.filter(member => member.chat_seq !== chat_seq));
        setMembers(prev => prev.map(member =>
            member.chat_seq === chat_seq
                ? { ...member, alert: "" }  // 클릭한 채팅방 멤버만 alert 초기화
                : member                      // 나머지는 그대로
        ));
    }

    return {
        members, chatSeq,
        handleClickChat
    }
}
export default useAttendance;
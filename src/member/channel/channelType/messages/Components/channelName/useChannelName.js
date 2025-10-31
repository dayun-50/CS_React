import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useChannelName(onChannelClick, alertRooms, setAlertRooms, newRooms, isOn, setDeptSeq) {

    // 출력 채팅방 받을 준비
    const [rooms, setRooms] = useState([]);
    const [chatSeq, setChatSeq] = useState("");

    const id = sessionStorage.getItem("id");

    useEffect(() => {
        caxios.post("/chat/chatRoomList", { email: id },
            { withCredentials: true })
            .then(resp => {
                setDeptSeq(resp.data[0].chat_seq);
                console.log("단체",resp.data);
                setRooms(resp.data);
                setChatSeq(resp.data.chat_seq);
            })
            .catch(err => {
                console.log(err);
            });
    }, [newRooms, isOn, id]);

    // 클릭이벤트
    const handleClickChat = (chat_seq)=>{
        onChannelClick(chat_seq);
        if (onChannelClick) onChannelClick(chat_seq);
        setAlertRooms(prev => prev.filter(room => room.chat_seq !== chat_seq));
        setRooms(prev => prev.map(room =>
            room.chat_seq === chat_seq
                ? { ...room, alert: "" }  // 클릭한 채팅방 멤버만 alert 초기화
                : room                      // 나머지는 그대로
        ));
    }

    return{
        rooms, chatSeq,
        handleClickChat
    }
}
export default useChannelName;
import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useChannelName(onChannelClick) {

    // 출력 채팅방 받을 준비
    const [rooms, setRooms] = useState([]);
    const [chatSeq, setChatSeq] = useState("");

    const id = sessionStorage.getItem("id");

    useEffect(() => {
        caxios.post("/chat/chatRoomList", { email: id },
            { withCredentials: true })
            .then(resp => {
                setRooms(resp.data);
                setChatSeq(resp.data.chat_seq);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    // 클릭이벤트
    const handleClickChat = (chat_seq)=>{
        onChannelClick(chat_seq);
        if (onChannelClick) onChannelClick(chat_seq);
    }

    return{
        rooms, chatSeq,
        handleClickChat
    }
}
export default useChannelName;
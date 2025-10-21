import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useChannelName() {

    // 출력 채팅방 받을 준비
    const [rooms, setRooms] = useState([]);
    const [chatSeq, setChatSeq] = useState("");

    const id = sessionStorage.getItem("id");

    useEffect(() => {
        caxios.post("/chat/chatRoom", { email: id },
            { withCredentials: true })
            .then(resp => {
                setRooms(resp.data);
                setChatSeq(resp.data.chat_seq);
                console.log(resp.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return{
        rooms, chatSeq,
        setChatSeq
    }
}
export default useChannelName;
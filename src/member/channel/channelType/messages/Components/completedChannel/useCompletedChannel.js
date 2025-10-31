import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useCompletedChannel(onChannelClick, isOn) {

    const [completedList, setCompletedList] = useState([]);
    const [chatSeq, setChatSeq] = useState("");

    const id = sessionStorage.getItem("id");

    useEffect(() => {
        caxios.post("/chat/completedList", { email: id },
            { withCredentials: true })
            .then(resp => {
                setCompletedList(resp.data);
                setChatSeq(resp.data.chat_seq);
            })
            .catch(err => {
                console.log(err);
            });
    }, [isOn]);

    // 클릭이벤트
    const handleClickChat = (chat_seq)=>{
        onChannelClick(chat_seq);
        if (onChannelClick) onChannelClick(chat_seq);
    }

    return {
        completedList, chatSeq,
        handleClickChat
    }
}
export default useCompletedChannel;
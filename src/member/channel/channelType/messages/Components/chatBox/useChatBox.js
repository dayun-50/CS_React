import { useEffect, useRef, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useChatBox(seq, setAlertRooms) {

    // 채팅방 제목 받을 준비
    const [room, setRoom] = useState({ title: "", memberCount: "" });
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    // 메세지 출력용
    const [messages, setMessages] = useState([]);
    // 서버에 메세지 보내는 용
    const [input, setInput] = useState({ chat_seq: seq, message: "" });
    const ws = useRef(null);
    const messageListRef = useRef(null);

    useEffect(() => {
        console.log(seq);
        caxios.post("/chat/chatRoom", { chat_seq: seq, member_email: id },
            { withCredentials: true })
            .then(resp => {
                setRoom(prev => ({
                    ...prev,
                    title: resp.data.CHAT_NAME,
                    memberCount: resp.data.MEMBER_COUNT
                }))
            })
            .catch(err => {
                console.log(err);
            });
    }, [seq]);

    // 웹소캣 연결
    useEffect(() => {
        setMessages([]);
        if (!room.title) return;
        setInput(prev => ({ ...prev, chat_seq: seq }));
        ws.current = new WebSocket(`ws://10.5.5.9/chatting?token=${token}&chat_seq=${seq}`);


        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "chat") {
                console.log(data);
                setMessages((prev) => [...prev, data.data]);
            } else if (data.type === "history") {
                console.log(data);
                setMessages(data.messages);
            } else if (data.type === "alert") { // 채팅 알람기능
setAlertRooms(prev => {
    // 중복 방지: chat_seq가 이미 있으면 추가하지 않음
    if (!prev.some(room => room.chat_seq === data.chat_seq)) {
        return [...prev, { chat_seq: data.chat_seq, title: data.title }];
    }
    return prev;
});
            }
        };

        return () => ws.current?.close();
    }, [room.title, seq]);

    // 메세지 전송
    const sendMessage = () => {
        if (input.message.trim() === "") return;

        ws.current.send(JSON.stringify(input));
        setInput(prev => ({ ...prev, message: "" }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 최신 메세지로 자동 스크롤
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    return {
        id, room, messages, input,
        setInput, sendMessage, handleKeyDown,
        messageListRef
    }
}
export default useChatBox;
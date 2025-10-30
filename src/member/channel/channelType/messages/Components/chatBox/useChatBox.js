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
        ws.current = new WebSocket(`ws://10.10.55.89/chatting?token=${token}&chat_seq=${seq}`);

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
    const sendMessage = async (data) => {
        if (input.message.trim() === "" && (!data || data.length === 0)) return;//메세지나 파일리스트 비어잇음 반송

        // 1️.텍스트 메시지 전송
        if (input.message.trim() !== "") {
            ws.current.send(JSON.stringify(input));
            setInput(prev => ({ ...prev, message: "" }));
        }

        // 2️. 파일(Blob 또는 FileList) 전송
        if (data) {
            const files = data instanceof FileList ? Array.from(data) : [data];// FileList나 단일 Blob 구분 없이 배열로 변환

            // 순차적으로 전송 (await로 메타 → 데이터 순서 보장)
            for (const file of files) {
                const fileName = file.name || `chatFile_${Date.now()}.bin`;

                // 1. 파일 메타정보 먼저 전송
                const fileMeta = {
                    type: "file",
                    chat_seq: input.chat_seq,
                    file_name: fileName,
                };
                ws.current.send(JSON.stringify(fileMeta)); // 채팅방 시퀀스, 파일 이름 보냄

                await new Promise((resolve) => setTimeout(resolve, 80));// 2. 잠시 대기 — 순차적으로 들어가도록
                ws.current.send(file);// 3.실제 파일 Blob 전송
            }
        }
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
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
        ws.current = new WebSocket(`ws://10.10.55.103/chatting?token=${token}&chat_seq=${seq}`);
        ws.current.binaryType = "arraybuffer";

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "chat") {
                console.log(data);
                setMessages((prev) => [...prev, data.data]);
            } else if (data.type === "history") {
                console.log(data);
                const converted = data.each.map(item => {
                    const msg = item.data;
                    const file = item.fdata;

                    if (file) {
                        return {
                            ...msg,
                            type: "file",
                            sysname: file.sysname,
                            oriname: file.oriname,
                            file_type: file.file_type,
                        };
                    } else {
                        return { ...msg, type: "chat" };
                    }
                })
                setMessages(converted);
            } else if (data.type === "file") {
                console.log(data);
                setMessages((prev) => [
                    ...prev,
                    {
                        ...data.data,        // 기본 메시지 정보
                        type: "file",        // 여기에 타입 표시 추가!
                        sysname: data.fdata.sysname,
                        file_type: data.fdata.file_type
                    },
                ]);
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

        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [room.title, seq]);

    // 메세지 전송
    const sendMessage = async (data) => {

        // 1️.텍스트 메시지 전송
        if (input.message.trim() !== "") {
            ws.current.send(JSON.stringify({
                ...input,
                chat_seq: seq
            }));
            setInput(prev => ({ ...prev, message: "" }));
        }


        // 2️. 파일(Blob 또는 FileList) 전송
        if (data instanceof Blob || data instanceof File) {
            const file = data;
            const fileName = file.name || `chatFile_${Date.now()}.bin`;

            // 1. 파일 메타정보 먼저 전송
            const fileMeta = {
                type: "file",
                chat_seq: seq,
                file_name: fileName,
            };

            ws.current.send(JSON.stringify(fileMeta));
            // 2. 메타 프레임 보낸 후 잠깐 기다리기
            await new Promise(resolve => setTimeout(resolve, 100));

            const buffer = await file.arrayBuffer();
            console.log("보내는 파일:", file.name, "크기:", file.size, "arrayBuffer:", buffer.byteLength);
            ws.current.send(buffer);
            setInput(prev => ({ ...prev, message: "" }));
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
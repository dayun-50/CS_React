import { useEffect, useRef, useState } from "react";
import { caxios } from "../../../../../../config/config";

/**
 * useChatBox 훅
 * seq: 채팅방 시퀀스
 * setAlertRooms: 채팅방 알람용 상태 setter (부모 컴포넌트에서 전달)
 */
function useChatBox(seq, setAlertRooms) {

    // 🔹 채팅방 제목/멤버 수 상태
    const [room, setRoom] = useState({ title: "", memberCount: "" });

    // 로그인된 유저 정보 가져오기
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    // 🔹 채팅 메시지 상태
    const [messages, setMessages] = useState([]);

    // 🔹 메시지 입력용 상태
    const [input, setInput] = useState({ chat_seq: seq, message: "" });

    // WebSocket 참조
    const ws = useRef(null);

    // 메시지 리스트 DOM 참조 (스크롤용)
    const messageListRef = useRef(null);

    // 🔹 채팅방 정보 가져오기 (채팅방 제목/멤버수)
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

    // 🔹 WebSocket 연결 및 메시지 수신
    useEffect(() => {
        setMessages([]); // 기존 메시지 초기화
        if (!room.title) return; // 채팅방 제목 없으면 연결 안함
        setInput(prev => ({ ...prev, chat_seq: seq })); // chat_seq 갱신
        ws.current = new WebSocket(`ws://10.10.55.89/chatting?token=${token}&chat_seq=${seq}`);

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === "chat") {
                // 일반 채팅 메시지
                console.log(data);
                setMessages((prev) => [...prev, data.data]);
            } else if (data.type === "history") {
                // 채팅 히스토리
                console.log(data);
                setMessages(data.messages);
            } else if (data.type === "alert") { 
                // 🔹 채팅 알람 기능
                // 🔹 추가: setAlertRooms가 함수인지 체크
                if (typeof setAlertRooms === "function") {
                    setAlertRooms(prev => {
                        // 중복 방지: chat_seq가 이미 있으면 추가하지 않음
                        if (!prev.some(room => room.chat_seq === data.chat_seq)) {
                            return [...prev, { chat_seq: data.chat_seq, title: data.title }];
                        }
                        return prev;
                    });
                }
            }
        };

        // 컴포넌트 언마운트 시 WebSocket 종료
        return () => ws.current?.close();
    }, [room.title, seq]);

    // 🔹 메시지 전송 함수
    const sendMessage = () => {
        if (input.message.trim() === "") return;
        ws.current.send(JSON.stringify(input));
        setInput(prev => ({ ...prev, message: "" }));
    };

    // 🔹 Enter 키 이벤트 처리 (Shift+Enter는 줄바꿈)
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 🔹 메시지 업데이트 시 자동 스크롤
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    // 🔹 훅에서 반환할 값
    return {
        id,
        room,
        messages,
        input,
        setInput,
        sendMessage,
        handleKeyDown,
        messageListRef
    }
}

export default useChatBox;

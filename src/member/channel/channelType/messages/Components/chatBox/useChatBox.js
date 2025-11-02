import { useEffect, useRef, useState } from "react";
import { caxios } from "../../../../../../config/config";

<<<<<<< HEAD
/**
 * useChatBox 훅
 * seq: 채팅방 시퀀스
 * setAlertRooms: 채팅방 알람용 상태 setter (부모 컴포넌트에서 전달)
 */
function useChatBox(seq, setAlertRooms) {
=======
function useChatBox(seq, setAlertRooms, setMemberCount, onFileUploaded) {
>>>>>>> 4f21d30d39f745a8ba55c2b0c735ea976f94432f

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

<<<<<<< HEAD
    // 메시지 리스트 DOM 참조 (스크롤용)
    const messageListRef = useRef(null);

    // 🔹 채팅방 정보 가져오기 (채팅방 제목/멤버수)
=======

    const messageListRef = useRef(null);


>>>>>>> 4f21d30d39f745a8ba55c2b0c735ea976f94432f
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
                setMemberCount(resp.data.MEMBER_COUNT);
                console.log("카운트~", resp.data.MEMBER_COUNT);
            })
            .catch(err => {
                console.log(err);
            });
    }, [seq]);

    // 🔹 WebSocket 연결 및 메시지 수신
    useEffect(() => {

        setMessages([]);
        if (!room.title) return;
        setInput(prev => ({ ...prev, chat_seq: seq }));
        ws.current = new WebSocket(`ws://10.10.55.89/chatting?token=${token}&chat_seq=${seq}`);
        ws.current.binaryType = "arraybuffer";


        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === "chat") {// 채팅 타입이라면
                console.log(data);
                setMessages((prev) => [...prev, data.data]);

            } else if (data.type === "history") { // 과거 내용이라면
                console.log(data);
                const converted = data.each.map(item => {
                    const msg = item.data;
                    const file = item.fdata;
                    if (file) {// 파일이면 링크처리 가능하게 추가정보
                        return { ...msg, type: "file", sysname: file.sysname, oriname: file.oriname, file_type: file.file_type, };
                    } else {
                        return { ...msg, type: "chat" };
                    }
                })
                setMessages(converted);

            } else if (data.type === "file") {// 파일타입
                console.log(data);
                setMessages((prev) => [...prev, { ...data.data, type: "file", sysname: data.fdata.sysname, file_type: data.fdata.file_type },]);
                onFileUploaded();// 파일올라갓다는 토글 실행

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

        return () => { //클리어
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
    // js파일에 잇으면 작동을 안하고 jsx 파일에 잇어야 작동이 되서 옮겻습니다..-지원



    // 검색 아이콘
    const serchBut = (options) => {
        caxios.post("/chat/", {},
            { withCredentials: true })
            .then(resp => {

            })
            .catch(err => console.log(err));
    }
    return {
        id, room, messages, input,
        setInput, sendMessage, handleKeyDown, serchBut,
    }
}

export default useChatBox;

import { useEffect, useRef, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useChatBox(
  seq,
  setAlertRooms,
  setMemberCount,
  onFileUploaded,
  collapseButtonText,
  serchValue,
  isSearching,
  setIsSearching,
  setSerchValue
) {
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
  const phoneRegex = /^\d{6}$/;

  // 🔹 메시지 리스트 ref (자동 스크롤용)
  const messageListRef = useRef(null);

  useEffect(() => {
    setIsSearching(false);
    setSerchValue("");
    caxios
      .post(
        "/chat/chatRoom",
        { chat_seq: seq, member_email: id },
        { withCredentials: true }
      )
      .then((resp) => {
        setRoom((prev) => ({
          ...prev,
          title: resp.data.CHAT_NAME,
          memberCount: resp.data.MEMBER_COUNT,
        }));
        setMemberCount(resp.data.MEMBER_COUNT);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [seq]);

  // 🔹 WebSocket 연결 및 메시지 수신
  useEffect(() => {
    if (isSearching) return;
    setMessages([]);
    if (!room.title) return;
    setInput((prev) => ({ ...prev, chat_seq: seq }));
    ws.current = new WebSocket(
      `ws://10.5.5.9/chatting?token=${token}&chat_seq=${seq}`
    );
    ws.current.binaryType = "arraybuffer";

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "chat") {
        setMessages((prev) => [...prev, { ...data.data, name: data.name }]);
      } else if (data.type === "history") {
        const converted = data.each.map((item) => {
          const msg = item.data;
          const file = item.fdata;
          const name = item.name;
          if (file) {
            return {
              ...msg,
              type: "file",
              sysname: file.sysname,
              oriname: file.oriname,
              file_type: file.file_type,
              name,
            };
          } else {
            return { ...msg, type: "chat", name };
          }
        });
        setMessages(converted);
      } else if (data.type === "file") {
        setMessages((prev) => [
          ...prev,
          {
            ...data.data,
            type: "file",
            sysname: data.fdata.sysname,
            file_type: data.fdata.file_type,
          },
        ]);
        onFileUploaded();
      } else if (data.type === "alert") {
        setAlertRooms((prev) => {
          if (!prev.some((room) => room.chat_seq === data.chat_seq)) {
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
  }, [room.title, seq, isSearching]);

  // 메세지 전송
  const sendMessage = async (data) => {
    if (input.message.trim() !== "") {
      ws.current.send(JSON.stringify({ ...input, chat_seq: seq }));
      setInput((prev) => ({ ...prev, message: "" }));
    }

    if (data instanceof Blob || data instanceof File) {
      const file = data;
      const fileName = file.name || `chatFile_${Date.now()}.bin`;

      const fileMeta = { type: "file", chat_seq: seq, file_name: fileName };
      ws.current.send(JSON.stringify(fileMeta));

      await new Promise((resolve) => setTimeout(resolve, 100));

      const buffer = await file.arrayBuffer();
      ws.current.send(buffer);
      setInput((prev) => ({ ...prev, message: "" }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 검색 아이콘
  const serchBut = () => {
    if (!serchValue) return;

    const handleResponse = (data) => {
      setIsSearching((prev) => !prev);
      const converted = data.each.map((item) => {
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
      });
      converted.sort((a, b) => new Date(b.message_at) - new Date(a.message_at));
      setMessages(converted);
    };

    if (collapseButtonText === "메시지") {
      caxios
        .post(
          "/chatMessage/serchByText",
          { chat_seq: seq, message: serchValue },
          { withCredentials: true }
        )
        .then((resp) => handleResponse(resp.data))
        .catch((err) => console.log(err));
    } else if (collapseButtonText === "날짜") {
      if (!phoneRegex.test(serchValue)) {
        alert("검색 조건 불일치");
        setSerchValue("");
        return;
      }
      caxios
        .post(
          "/chatMessage/serchByDate",
          { chat_seq: seq, message_at: serchValue },
          { withCredentials: true }
        )
        .then((resp) => handleResponse(resp.data))
        .catch((err) => console.log(err));
    }
  };

  return {
    id,
    room,
    messages,
    input,
    setInput,
    sendMessage,
    handleKeyDown,
    serchBut,
    messageListRef, // ✅ 추가
  };
}

export default useChatBox;

import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useAttendance() {

    // 출력 맴버 받을 준비
    const [members, setMembers] = useState([]);
    const [chatSeq, setChatSeq] = useState("");

    const id = sessionStorage.getItem("id");

    useEffect(() => {
        caxios.post("/chat/private", { email: id },
            { withCredentials: true })
            .then(resp => {
                setMembers(resp.data);
                setChatSeq(resp.data.chat_seq);
            })
            .catch(err => {
                console.log(err.data);
            });
    }, []);

    return {
        members, chatSeq,
        setChatSeq
    }
}
export default useAttendance;
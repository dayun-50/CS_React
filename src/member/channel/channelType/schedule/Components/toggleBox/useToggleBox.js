import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useToggleBox(seq, selectMemberEvent, setSelectMemberEvent) {

    const id = sessionStorage.getItem("id");

    const [members, setMembers] = useState([]);

    // 채팅방 멤버 출력
    useEffect(() => {
        if (!seq) return;
        caxios.post("/schedule/selectMember", { chat_seq: seq, member_email: id },
            { withCredentials: true })
            .then(resp => {
                setMembers(resp.data);
                console.log(resp.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [seq])

    

    return {
        members
    }
}
export default useToggleBox;
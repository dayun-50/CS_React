import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";
import { use } from "react";

function useToggleBox(seq, selected, setSelected) {

    const [members, setMembers] = useState([]);

    // 채팅방 멤버 출력
    useEffect(() => {
        if (!seq) return;
        caxios.post("/schedule/selectMember", { chat_seq: seq },
            { withCredentials: true })
            .then(resp => {
                setMembers(resp.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [seq])

    useEffect(() => {
        setSelected(Array(members.length).fill(false));
    }, [members])


    return {
        members
    }
}
export default useToggleBox;
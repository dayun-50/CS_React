import { post } from "jquery";
import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useChatRoomPlus(selected) {
    const [recipients, setRecipients] = useState([]);
    const id = sessionStorage.getItem("id");
    const [list, setList] = useState("");

    useEffect(() => {
        caxios.post("/chat/contactList", { member_email: id }, { withCredentials: true })
            .then(resp => {
                console.log(resp.data);
                setRecipients(resp.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
        // selected에 저장된 contact_seq를 이용해서 이름 문자열 만들기
        const selectedNames = recipients
            .filter(r => selected.includes(r.contact_seq))
            .map(r => r.name);

        setList(selectedNames.join(", "));
    }, [selected, recipients]);

    return {
        recipients, list
    }
}
export default useChatRoomPlus;
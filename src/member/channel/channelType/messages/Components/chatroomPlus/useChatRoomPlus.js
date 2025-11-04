import { post } from "jquery";
import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useChatRoomPlus(selected, title, setTitle ) {
    const [recipients, setRecipients] = useState([]);
    const [list, setList] = useState("");

    useEffect(() => {
        caxios.post("/chat/contactList", { withCredentials: true })
            .then(resp => {
                setRecipients(resp.data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        // selected에 저장된 contact_seq를 이용해서 이름 문자열 만들기
        const selectedNames = recipients
            .filter(r => selected.includes(r.contact_seq))
            .map(r => r.name);

        setList(selectedNames.join(", "));
    }, [selected, recipients]);

    const hendleTitle=(e)=>{
        setTitle(e.target.value);
    }

    return {
        recipients, list,
        hendleTitle
    }
}
export default useChatRoomPlus;
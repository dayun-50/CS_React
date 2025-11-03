import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useOutBox(seq, isOn, setIsOn) {
    const id = sessionStorage.getItem("id");
    const [manager, setManager] = useState("");

    // 프로젝트 on/ off 출력
    useEffect(() => {
        caxios.post("/chatRoom/manager", { chat_seq: seq }, { withCredentials: true })
            .then(resp => {
                setManager(resp.data.manager_email);
                if (resp.data.project_progress == "y") {
                    setIsOn(true);
                } else {
                    setIsOn(false);
                }
            })
            .catch(err => console.log(err));
    }, [seq]);

    return {
        id, manager
    }
}
export default useOutBox;
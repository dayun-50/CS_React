import { useEffect, useState } from "react";
import { caxios } from "../../../../../../config/config";

function useOutBox(seq, setIsOn, setLoading) {
  const id = sessionStorage.getItem("id");
  const [manager, setManager] = useState("");

  useEffect(() => {
    setLoading(true);
    caxios.post("/chatRoom/manager", { chat_seq: seq }, { withCredentials: true })
      .then(resp => {
        setManager(resp.data.manager_email);
        setIsOn(resp.data.project_progress === "y");
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false)); // 로딩 완료
  }, [seq]);

  return { id, manager };
}

export default useOutBox;

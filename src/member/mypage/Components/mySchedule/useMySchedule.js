import { useEffect, useState } from "react";
import { caxios } from "../../../../config/config";
import { useNavigate } from "react-router-dom";

function useMySchedule(selectedSeq, setSelectedSeq) {
    const [scheduleData, setScheduleData] = useState([]);
    const id = sessionStorage.getItem("id");
    const navigate = useNavigate();

    useEffect(() => {
        caxios.post("/schedule/myschedule", { withCredentials: true })
            .then(resp => {
                const newData = resp.data.map(data => {
                    const startDate = new Date(data.start_at);
                    const endDate = new Date(data.end_at);
                    const today = new Date();

                    const diffTime = startDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    const formattedStart = `${startDate.getMonth() + 1}월 ${startDate.getDate()}일`;
                    const formattedEnd = `${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;

                    const str = data.title;
                    const result = str.split(":")[1].trim();

                    return {
                        ...data,
                        title : result,
                        diffDays,
                        start_at: formattedStart,
                        end_at: formattedEnd,
                    };
                });
                setScheduleData(newData);
                console.log(newData);
            })
            .catch(err => console.log(err));
    }, []);

    const schedulePage = (chat_seq)=>{
        setSelectedSeq(chat_seq);
        navigate(`/channel/schedule`);
    }

    return {
        scheduleData, schedulePage
    }
}
export default useMySchedule;
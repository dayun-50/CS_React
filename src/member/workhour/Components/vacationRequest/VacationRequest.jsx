import { useEffect, useRef, useState } from "react";
import styles from "./VacationRequest.module.css";
import { useNavigate } from "react-router-dom";
import { caxios } from "../../../../config/config";

function VacationRequest({ setClickedWriteBtn }) {

    //1. 날짜 변환용 :오늘로부터 1주일 후부터 ~1년까지
    const todayAfterWeek = new Date();
    todayAfterWeek.setDate(todayAfterWeek.getDate() + 7); // 날짜를 7일 뒤로 이동
    todayAfterWeek.setHours(0, 0, 0, 0);
    const oneYearLater = new Date();
    oneYearLater.setFullYear(todayAfterWeek.getFullYear() + 1);
    oneYearLater.setDate(oneYearLater.getDate() + 7);
    const navigate = useNavigate();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    //2. 상태변수
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startType, setStartType] = useState("");
    const [endType, setEndType] = useState("");

    // 날짜가 같고 시작 시간이 14:00일 때 종료 14:00 비활성화
    const [disableEnd14, setDisableEnd14] = useState(false);
    const endTypeRef = useRef(null);
    useEffect(() => {
        const shouldDisable =
            startDate &&
            endDate &&
            startDate === endDate &&
            startType === "14:00" &&
            endType === "14:00";

        // DOM에서 직접 선택 초기화
        if (shouldDisable) {
            alert("시작일시와 종료일시가 동일합니다");
            endTypeRef.current.value = "";
            setEndType("");
        }

        setDisableEnd14(
            startDate && endDate && startDate === endDate && startType === "14:00"
        );
    }, [startDate, endDate, startType, endType]);



    //3. 시작시간 설정
    const handleStartTime = (e) => {
        setStartType(e.target.value);
    };


    //4. 끝나는시간 설정
    const handleEndTime = (e) => {
        setEndType(e.target.value);
    };

    //5. 내용 저장
    const contentRef = useRef(null);

    const handleSave = () => {
        const content = contentRef.current?.innerHTML || "";
        // HTML 태그 제거 + 공백 문자 제거
        const textOnly = content
            .replace(/<[^>]*>/g, "")     // 태그 제거
            .replace(/&nbsp;/gi, "")     // 공백 문자 제거
            .replace(/\s+/g, "")         // 모든 공백 제거
            .trim();

        if (textOnly.length < 1) {
            alert("내용을 입력하세요");
            return;
        }


        //시간 선택 안한거 있는지 체크
        if (!startDate || !endDate || !startType || !endType) {
            alert("시간을 모두 선택하세요");
            return;
        }

        const startDateTime = new Date(`${startDate}T${startType}:00`);
        const endDateTime = new Date(`${endDate}T${endType}:00`);
        // UTC+9 시간 보정
        const pto_start_at = new Date(startDateTime.getTime() + 9 * 60 * 60 * 1000)
            .toISOString()
            .replace("Z", "+09:00");

        const pto_end_at = new Date(endDateTime.getTime() + 9 * 60 * 60 * 1000)
            .toISOString()
            .replace("Z", "+09:00");
        const data = {
            pto_content: content,
            pto_start_at: pto_start_at,
            pto_end_at: pto_end_at,
        };


        //axios 로직 추가
        caxios.post(`/ptorequest`, data)
            .then(() => {
                alert("작성이 완료되었습니다");
                setClickedWriteBtn(false);
                navigate("/");
            })
            .catch(() => {
                alert("오류가 발생했습니다");
            })
    };


    return (
        <div className={styles.container}>
            <div className={styles.headerBox}>
                <div className={styles.headerBig}>연차 신청</div>
                <div className={styles.headerSmall}>신청일로부터 1주일 후부터~1년후 까지 신청가능합니다</div>
            </div>

            <div className={styles.startBox}>
                <div className={styles.startBoxLeft}>시작일</div>
                <div className={styles.startBoxRight}>
                    <div className={styles.selectGroup}>
                        <select
                            ref={endTypeRef}
                            value={startType}
                            onChange={handleStartTime}>

                            <option value="">선택</option>
                            <option value="09:00">09:00</option>
                            <option value="14:00">14:00</option>
                        </select>
                    </div>

                    <div className={styles.dateInputBox}>
                        <input
                            type="date"
                            id="pto_start_at"
                            name="pto_start_at"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={formatDate(todayAfterWeek)}
                            max={formatDate(oneYearLater)}
                        />
                    </div>
                </div>
            </div>


            <div className={styles.endBox}>
                <div className={styles.endBoxLeft}>종료일</div>
                <div className={styles.endBoxRight}>
                    <div className={styles.selectGroup}>
                        <select
                            value={endType}
                            onChange={handleEndTime}>
                            <option value="">선택</option>
                            <option
                                value="14:00"
                                disabled={disableEnd14}
                                className={disableEnd14 ? styles.disabled : ""}>
                                14:00
                            </option>
                            <option value="18:00">18:00</option>
                        </select>
                    </div>

                    <div className={styles.dateInputBox}>
                        <input
                            type="date"
                            id="pto_end_at"
                            name="pto_end_at"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={formatDate(todayAfterWeek)}
                            max={formatDate(oneYearLater)}
                        />
                    </div>
                </div>
            </div>


            <div className={styles.contentBox}>
                <div ref={contentRef} className={styles.content} contentEditable></div>
            </div>

            <div className={styles.btns}>
                <button className={styles.btn1} onClick={() => { navigate("/"); setClickedWriteBtn(false); }}>뒤로가기</button>
                <button className={styles.btn2} onClick={handleSave}>작성완료</button>
            </div>
        </div>
    )

}

export default VacationRequest;
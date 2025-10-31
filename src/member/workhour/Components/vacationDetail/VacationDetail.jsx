import { useEffect, useRef, useState } from "react";
import styles from "./VacationDetail.module.css";
import { caxios } from "../../../../config/config";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function VacationDetail({ selectedData, setSelectedData, setClickedDetailBtn }) {

    const navigate = useNavigate();
    const seq = selectedData.pto_seq;// 시퀀스 번호 받아오기
    console.log(seq);

    // 1. 오리지날 객체 저장후, 화면에 뿌리기
    const [oriRequest, setOriRequest] = useState({}); //객체로받음
    useEffect(() => {
        console.log(selectedData);
        setOriRequest(selectedData);
    }, [seq]);



    //1-1 날짜 변환용 :오늘로부터 1주일 후부터 ~1년까지
    const todayAfterWeek = new Date();
    todayAfterWeek.setDate(todayAfterWeek.getDate() + 7); // 날짜를 7일 뒤로 이동
    todayAfterWeek.setHours(0, 0, 0, 0);
    const oneYearLater = new Date();
    oneYearLater.setFullYear(todayAfterWeek.getFullYear() + 1);
    oneYearLater.setDate(oneYearLater.getDate() + 7);
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    // 1-2 시간 value 바꿔놓기
    useEffect(() => {
        if (selectedData?.pto_start_at) {
            const startDate = dayjs(selectedData.pto_start_at).format("YYYY-MM-DD");
            const startTime = dayjs(selectedData.pto_start_at).format("HH:mm");
            setStartDate(startDate);
            setStartType(startTime);
        }

        if (selectedData?.pto_end_at) {
            const endDate = dayjs(selectedData.pto_end_at).format("YYYY-MM-DD");
            const endTime = dayjs(selectedData.pto_end_at).format("HH:mm");
            setEndDate(endDate);
            setEndType(endTime);
        }
    }, [selectedData]);


    //2. 삭제하기
    const handleDel = () => {
        console.log("삭제하기 버튼", seq);
        caxios.delete(`/ptorequest/${seq}`)
            .then(() => {
                alert("삭제되었습니다!");
                setClickedDetailBtn(false);// 다시 리스트 화면 보이도록
                navigate("/");
            })
            .catch((resp) => {
                alert("올바르지 않은 접근입니다!");
                navigate("/");
            })
    }


    // 3. 수정하기
    const [updating, setUpdating] = useState(false);
    const handleUpdate = () => {// 수정하기 버튼을 눌럿을때
        setUpdating(true);// 버튼 수정취소, 수정완료 버튼이 보임
    }
    // 4. 업데이트용 변수에 넣기
    const contentRef = useRef();
    // 5. 수정취소 버튼누르면
    const handleUpdateDel = () => {
        if (contentRef.current) { contentRef.current.innerText = oriRequest.pto_content; }// 컨텐츠 원래대로 넣고
        setUpdating(false);
    }

    // 6. 수정완료 버튼누르면
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startType, setStartType] = useState("");
    const [endType, setEndType] = useState("");


    // 6-1 .날짜가 같고 시작 시간이 14:00일 때 종료 14:00 비활성화
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

    //6-2. 시작시간 + 끝 시간 설정
    const handleStartTime = (e) => {
        setStartType(e.target.value);
    };
    const handleEndTime = (e) => {
        setEndType(e.target.value);
    };

    // 6. 수정오나료버튼 누르면
    const handleUpdateCom = () => {
        const pto_content = contentRef.current?.innerHTML || "";

        // HTML 태그 제거 + 공백 문자 제거
        const textOnly = pto_content
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
            pto_content: pto_content,
            pto_start_at: pto_start_at,
            pto_end_at: pto_end_at,
            pto_seq: seq
        };

        caxios.put(`/ptorequest/${oriRequest.pto_seq}`, data)
            .then(() => {
                setOriRequest(prev => ({ ...prev, pto_content }));
                setUpdating(false);
                alert("수정이 완료되었습니다!");
            })
            .catch(() => {
                alert("올바르지 않은 접근입니다!");
            })
            ;
    };



    return (
        <div className={styles.container}>
            <div className={styles.parent}>
                <div className={styles.parentHeader}>
                    <div className={styles.headerEmail}>
                        {oriRequest.member_email}
                    </div>
                    <div className={styles.header_start_at}>
                        <div className={styles.startBoxRight}>
                            <div className={styles.selectGroup}>
                                <select
                                    value={startType}
                                    onChange={handleStartTime}
                                    disabled={!updating} // 수정 불가
                                >
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
                                    disabled={!updating}
                                />
                            </div>

                        </div>

                    </div>

                    <div className={styles.header_end_at}>
                        <div className={styles.endBoxRight}>
                            <div className={styles.selectGroup}>
                                <select
                                    ref={endTypeRef}
                                    value={endType}
                                    onChange={handleEndTime}
                                    disabled={!updating}
                                >
                                    <option value="">선택</option>
                                    <option value="14:00">14:00</option>
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
                                    disabled={!updating}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${styles.header_status} ${{
                            대기: styles.inProgress,
                            완료: styles.approved,
                        }[oriRequest.pto_status] || styles.denied
                            }`}
                    >
                        {oriRequest.pto_status}
                    </div>

                </div>

                <div className={styles.parentBody}>
                    <div className={`${styles.txt} ${updating ? styles.txtActive : ""}`}
                        ref={contentRef}
                        contentEditable={updating}
                        dangerouslySetInnerHTML={{ __html: oriRequest.pto_content }}
                    ></div>
                </div>




            </div>

            <div className={styles.btns}>
                <button className={styles.btn3} onClick={() => { setClickedDetailBtn(false) }}>뒤로가기</button>

                {oriRequest.pto_status == "대기" && !updating && (
                    <>
                        <button className={styles.btn2} onClick={handleDel}>삭제하기</button>
                        <button className={styles.btn1} onClick={handleUpdate}>수정하기</button>
                    </>
                )}

                {oriRequest.pto_status == "대기" && updating && (
                    <>
                        <button className={styles.btn2} onClick={handleUpdateDel}>수정취소</button>
                        <button className={styles.btn1} onClick={handleUpdateCom}>수정완료</button>
                    </>
                )}
            </div>

        </div>
    );
}


export default VacationDetail;
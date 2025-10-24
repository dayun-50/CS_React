import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from './ApprovalDetail.module.css'
import axios from "axios";
import dayjs from "dayjs";
import { caxios } from "../../../../config/config";


function ApprovalDetail() {
    const navigate = useNavigate();
    const { seq } = useParams(); // url에서 파라미터 가져오기


    //1. 오리지날 객체 저장후, 화면에 뿌리기
    const [oriApproval, setOriApproval] = useState({}); //객체로받음
    useEffect(() => {
        caxios.get(`/approval/${seq}`)

            .then((resp) => {
                const data = resp.data;
                // 날짜 포맷 변환
                const formattedData = {
                    ...data,
                    approval_at: dayjs(data.approval_at).format("YYYY-MM-DD"),
                };

                setOriApproval(formattedData);
                console.log(formattedData);
            })
            .catch((resp) => {
                alert("올바르지 않은 접근입니다!");
                navigate(-1);
            });
    }, [seq]);



    //2. 삭제하기
    const handleDel = () => {
        console.log("삭제하기 버튼", seq);
        caxios.delete(`/approval/${seq}`)
            .then(() => {
                alert("삭제되었습니다!");
                navigate("/approval");
            })
            .catch((resp) => {
                alert("올바르지 않은 접근입니다!");
                navigate(-1);
            })
    }


    //3. 수정하기
    const [updating, setUpdating] = useState(false);
    const handleUpdate = () => {// 수정하기 버튼을 눌럿을때
        setUpdating(true);// 버튼 수정취소, 수정완료 버튼이 보임
    }

    //업데이트용 객체에 넣기
    const titleRef = useRef();
    const contentRef = useRef();

    //수정취소 버튼누르면
    const handleUpdateDel = () => {
        if (titleRef.current) { titleRef.current.innerText = oriApproval.approval_title; } // 타이틀, 컨텐츠 원래대로 넣고
        if (contentRef.current) { contentRef.current.innerText = oriApproval.approval_content; }
        setUpdating(false);
    }
    //수정완료 버튼누르면

    const handleUpdateCom = () => {
        const approval_title = titleRef.current?.innerText || "";
        const approval_content = contentRef.current?.innerHTML || "";

        // 길이 체크
        // HTML 태그 제거
        const textOnly = approval_content.replace(/<[^>]*>/g, "").trim();
        if (approval_title.trim().length < 1 || textOnly.length < 1) {
            alert("제목과 내용을 입력하세요");
            return;
        }

        caxios.put(`/approval/${oriApproval.approval_seq}`, { approval_seq: oriApproval.approval_seq, approval_title, approval_content })
            .then(() => {

                setOriApproval(prev => ({ ...prev, approval_title, approval_content }));
                setUpdating(false);
                alert("수정이 완료되었습니다!");
                navigate(`/approval/detail/${oriApproval.approval_seq}`);
            })
            .catch(() => {
                alert("올바르지 않은 접근입니다!");
            })
            ;
    };

    return (
        <div className={styles.detailBox}>
            <div className={styles.parent}>


                <div className={styles.div2}>
                    <div className={`${styles.div3} ${updating ? styles.div3Active : ""}`}
                        ref={titleRef} contentEditable={updating}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); } }}
                        onInput={(e) => {
                            const text = e.currentTarget.innerText;
                            if (text.length > 15) {
                                alert("제목은 15자까지 입력 가능합니다.");
                                // 초과된 텍스트 제거
                                e.currentTarget.innerText = text.slice(0, 15);
                                // 커서를 맨 끝으로 이동
                                const range = document.createRange();
                                const sel = window.getSelection();
                                range.selectNodeContents(e.currentTarget);
                                range.collapse(false);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }}
                    >
                        {oriApproval.approval_title}
                    </div>
                </div>


                <div className={styles.div4}>
                    <div className={styles.div5}>
                        <div className={`${styles.div6} ${styles.div6_left}`} id={styles.unseen}>{oriApproval.member_email}</div>
                        <div className={`${styles.div6} ${styles.div6_center}`}>{oriApproval.approval_at}</div>
                        <div className={`${styles.div6} ${styles.div6_right}`}>{oriApproval.approval_status}</div>
                    </div>


                    <div className={styles.div9}>

                        <div className={styles.rectangleParent}>
                            <div className={styles.iconbox}><img className={styles.documentIcon} alt="" /></div>

                            <div className={styles.hwp}>자금 사용 정의서.hwp</div>
                        </div>

                    </div>
                    <div className={styles.div10}>
                        <div className={`${styles.txt} ${updating ? styles.txtActive : ""}`}
                            ref={contentRef}
                            contentEditable={updating}
                            dangerouslySetInnerHTML={{ __html: oriApproval.approval_content }}
                        ></div>
                    </div>
                </div>
            </div>


            <div className={styles.btns}>
                <button className={styles.btn3} onClick={() => { navigate(-1) }}>뒤로가기</button>

                {oriApproval.approval_status == "처리중" && !updating && (
                    <>
                        <button className={styles.btn2} onClick={handleDel}>삭제하기</button>
                        <button className={styles.btn1} onClick={handleUpdate}>수정하기</button>
                    </>
                )}

                {oriApproval.approval_status == "처리중" && updating && (
                    <>
                        <button className={styles.btn2} onClick={handleUpdateDel}>수정취소</button>
                        <button className={styles.btn1} onClick={handleUpdateCom}>수정완료</button>
                    </>
                )}
            </div>
        </div>

    );
}

export default ApprovalDetail;
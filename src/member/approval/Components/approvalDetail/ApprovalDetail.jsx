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
    const [oriFiles, setOriFiles] = useState([]);
    useEffect(() => {
        caxios.get(`/approval/${seq}`)

            .then((resp) => {
                console.log("디테일 보드", resp);
                console.log("디테일 보드파일 이름", resp.data.files);
                setOriFiles(resp.data.files);
                setNewFiles(resp.data.files);
                const data = resp.data.approval;
                // 날짜 포맷 변환
                const formattedData = {
                    ...data,
                    approval_at: dayjs(data.approval_at).format("YYYY-MM-DD"),
                };

                setOriApproval(formattedData);
                console.log(formattedData, "폼태그");
            })
            .catch((resp) => {
                alert("올바르지 않은 접근입니다!");
                navigate(-1);
            });
    }, [seq]);



    //2. 글 삭제하기
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

    //업데이트용 객체+변수에 넣기
    const titleRef = useRef();
    const contentRef = useRef();
    const [newFiles, setNewFiles] = useState([]);
    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        setNewFiles((prev) => [...prev, ...selected]); // 기존 유지 + 새로 추가
    };
    //파일 1개 x 버튼 누르면
    const handleRemoveFile = (index) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
    };
    //수정취소 버튼누르면
    const handleUpdateDel = () => {
        if (titleRef.current) { titleRef.current.innerText = oriApproval.approval_title; } // 타이틀, 컨텐츠 원래대로 넣고
        if (contentRef.current) { contentRef.current.innerText = oriApproval.approval_content; }
        setNewFiles(oriFiles); // 파일 목록 원본으로 되돌리기
        setUpdating(false);
    }
    //수정완료 버튼누르면
    const handleUpdateCom = () => {
        const approval_title = titleRef.current?.innerText || "";
        const approval_content = contentRef.current?.innerHTML || "";

        const textOnly = approval_content.replace(/<[^>]*>/g, "").trim();
        if (approval_title.trim().length < 1 || textOnly.length < 1) {
            alert("제목과 내용을 입력하세요");
            return;
        }

        const formData = new FormData();
        formData.append("approval_seq", oriApproval.approval_seq);
        formData.append("approval_title", approval_title);
        formData.append("approval_content", approval_content);

        newFiles.forEach((f) => {
            if (f instanceof File) formData.append("files", f);
            else if (f.oriname) formData.append("keepFiles", f.oriname);
        });

        caxios.put(`/approval/${oriApproval.approval_seq}`, formData)
            .then(() => {
                // 수정 완료 후 즉시 최신 데이터 다시 불러오기
                return caxios.get(`/approval/${oriApproval.approval_seq}`);
            })
            .then((resp) => {
                const data = resp.data.approval;
                setOriApproval({
                    ...data,
                    approval_at: dayjs(data.approval_at).format("YYYY-MM-DD"),
                });
                setOriFiles(resp.data.files);
                setNewFiles(resp.data.files);
                setUpdating(false);
                alert("수정이 완료되었습니다!");
            })
            .catch(() => alert("올바르지 않은 접근입니다!"));
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
                        <div className={`${styles.div6} ${styles.div6_left}`}>
                            {oriApproval.member_email}
                        </div>
                        <div className={`${styles.div6} ${styles.div6_center}`}>{oriApproval.approval_at}</div>
                        <div className={
                            {
                                처리중: `${styles.div6} ${styles.div6_right} ${styles.inProgress}`,
                                완료: `${styles.div6} ${styles.div6_right} ${styles.approved}`,
                            }
                            [oriApproval.approval_status] || `${styles.div6} ${styles.div6_right} ${styles.denied}`}>
                            {oriApproval.approval_status}
                        </div>

                    </div>


                    <div className={styles.div9}>
                        <div className={styles.rectangleParent}>
                            {updating ? (
                                <div className={styles.updatingFileBox}>
                                    {newFiles.map((file, index) => (
                                        <div key={index} className={styles.fileRow}>
                                            {/* <div className={styles.iconbox}>
                                                <img className={styles.documentIcon} alt="" />
                                            </div> */}
                                            <div className={styles.hwp}>
                                                {file.name || file.oriname}
                                                <button className={styles.fileBtn} onClick={() => handleRemoveFile(index)}>X</button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 파일 추가 영역 */}
                                    <div className={`${styles.fileRowCenter} ${styles.fileRow}`}>
                                        <label htmlFor="fileUpload" className={styles.addFileLabel}>
                                            + 파일 추가
                                        </label>
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            className={styles.hiddenFileInput}
                                            onChange={handleFileChange}
                                            multiple
                                        />
                                    </div>
                                </div>
                            ) : (
                                oriFiles.length === 0 ? (
                                    <div className={styles.noFile}>파일이 존재하지 않습니다</div>
                                ) : (
                                    oriFiles.map((file, index) => (
                                        <div key={index} className={styles.fileRow}>
                                            {/* <div className={styles.iconbox}>
                                                <img className={styles.documentIcon} alt="" />
                                            </div> */}
                                            <div className={styles.hwp}>
                                                <a href={`http://127.0.0.1/file/download?sysname=${encodeURIComponent(file.sysname)}&file_type=${encodeURIComponent(file.file_type)}`} download >
                                                    {file.oriname}
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>



                    <div className={styles.div10}>
                        <div className={`${styles.txt} ${updating ? styles.txtActive : ""}`}
                            ref={contentRef}
                            contentEditable={updating}
                            // dangerouslySetInnerHTML={{ __html: oriApproval.approval?.approval_content }}
                            dangerouslySetInnerHTML={{ __html: oriApproval.approval_content }}
                        ></div>
                    </div>
                </div>
            </div>


            <div className={styles.btns}>
                <button className={styles.btn3} onClick={() => { navigate(-1) }}>뒤로가기</button>

                {oriApproval.approval?.approval_status == "처리중" && !updating && (
                    <>
                        <button className={styles.btn2} onClick={handleDel}>삭제하기</button>
                        <button className={styles.btn1} onClick={handleUpdate}>수정하기</button>
                    </>
                )}

                {oriApproval.approval?.approval_status == "처리중" && updating && (
                    <>
                        <button className={styles.btn2} onClick={handleUpdateDel}>수정취소</button>
                        <button className={styles.btn1} onClick={handleUpdateCom}>수정완료</button>
                    </>
                )}
            </div>
        </div >

    );
}

export default ApprovalDetail;
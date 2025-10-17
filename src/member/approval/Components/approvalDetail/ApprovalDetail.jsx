import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from './ApprovalDetail.module.css'
import axios from "axios";

function ApprovalDetail (){
    const navigate = useNavigate();
    const { seq } = useParams(); // url에서 파라미터 가져오기


    //1. 오리지날 객체 저장후, 화면에 뿌리기
    const [oriApproval, setOriApproval] = useState({}); //객체로받음
    useEffect(() => {
        axios.get(`http://10.5.5.3/approval/${seq}`).then((resp) => {
        setOriApproval(resp.data); //오리보드에 내용 넣기
        console.log(resp.data);
        });
    }, [seq]);



    //2. 삭제하기
    const handleDel = () => {
        // axios.delete(`http://10.5.5.3/approval/${seq}`).then(() => {
        navigate("/approval");
        // })
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
        const title = titleRef.current?.innerText || "";
        const content = contentRef.current?.innerText || "";

        // axios.put(`http://10.5.5.3/board/${oriApproval.seq}`, { title, content, writer: user }).then(() => {
        //     setUpdating(false);
        navigate(`/approval/detail/${oriApproval.seq}`);
        // });
    };


    //4. 뒤로가기
    const location = useLocation();
    const path = location.state?.path;

 return (
            <div className={styles.detailBox}>
               <div className={styles.parent}>


                    <div className={styles.div2}>
                         <div className={styles.div3} ref={titleRef} contentEditable={updating} >{oriApproval.approval_title}</div>
                    </div>


                    <div className={styles.div4}>
                         <div className={styles.div5}>
                              <div className={styles.frameParent}>
                                   <div className={styles.wrapper}>
                                        <div className={styles.div6}>{oriApproval.member_email}</div>
                                   </div>
                                   <img className={styles.frameChild} alt="" />
                                   <div className={styles.wrapper}>
                                        <div className={styles.div6}>{oriApproval.approval_at}</div>
                                   </div>
                                   <div className={styles.frameItem} />
                                   <div className={styles.frame}>
                                        <div className={styles.div6}>{oriApproval.approval_status}</div>
                                   </div>
                              </div>
                         </div>
                         <div className={styles.div9}>
                              <div className={styles.inner}>
                                   <div className={styles.rectangleParent}>
                                        <img className={styles.documentIcon} alt="" />
                                        <div className={styles.hwp}>자금 사용 정의서.hwp</div>
                                   </div>
                              </div>
                         </div>
                         <div className={styles.div10}>
                                <div className={styles.txt} ref={contentRef} contentEditable={updating}>
                                    {oriApproval.approval_content}
                                </div>
                         </div>
                    </div>
                </div>

                
                <div className={styles.btns}>
                    <button className={styles.btn3} onClick={() => { navigate(-1) }}>뒤로가기</button>

                    {!updating ? (
                        <>
                        <button className={styles.btn2} onClick={handleDel}>삭제하기</button>
                        <button className={styles.btn1} onClick={handleUpdate}>수정하기</button>
                        </>
                    ) : (
                        <>
                        <button className={styles.btn2} onClick={handleUpdateDel}>수정취소</button>
                        <button className={styles.btn1} onClick={handleUpdateCom}>수정완료</button>
                        </>
                    )}
                    
                </div>

            </div>
            
        );}

export default ApprovalDetail;
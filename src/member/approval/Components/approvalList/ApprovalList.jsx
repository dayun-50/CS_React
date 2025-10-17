import { useEffect, useState } from "react";
import SubSideBar from "../../../navis/subsidebar/SubSideBar";
import styles from "./ApprovalList.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import { caxios } from "../../../../config/config";

function ApprovalList(){

    // 1. 경로 추출
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const target = queryParams.get("type"); // 'denied', 'approved' 등
    const navigate = useNavigate();
    console.log("타켓",target);

    // 2. 경로에 따라서 데이터 값 요청하도록
    useEffect(() => {
        const serverPath = target ? `/approval?type=${target}` : `http://10.5.5.3/approval`;
        caxios.get(serverPath)
            .then(response => {
                    const formattedData = response.data.map(item => ({
                    ...item,
                    approval_at: dayjs(item.approval_at).format('YYYY-MM-DD') //날짜변환
                    }));
                setDatas(formattedData);//data props로 넘겨주기
                console.log(response.data)
            })
            .catch(()=>{
                setDatas([]); // 오류 나도 빈 배열
            })
    },[target])
    const [datas, setDatas] = useState([]);

    
    //3. 경로에 따라서 상단 문구 변경
    const statusMap = {
        inprogress: '처리중',
        denied: '반려',
        approved: '완료',
    };
    const [type, setType] = useState('');
    useEffect(() => {
        if (!target) { //null, undefined, ''이라면
            setType('전체 리스트');
            setSubSidebarData((prev) => ({...prev,selectedBtn: '전체'}) );
        } else {
            setType(statusMap[target] || ''); //이상한 값이면 null
            setSubSidebarData(prev => ({...prev,selectedBtn: statusMap[target] || ''}));
        }
    }, [target]);


    //4. 넘겨줄 파라미터 :버튼, 작성하기 클릭했을뗴의 함수, 버튼명, 선택한 버튼(스타일링 다르게)
    const [subSidebarData, setSubSidebarData] = useState({
            btns: [{ name: "전체", path: "/approval" },
                   { name: "처리중", path: "/approval?type=inprogress" },
                   { name: "반려", path: "/approval?type=denied" },
                   { name: "완료", path: "/approval?type=approved" }
            ],
            text: "서류 작성", //추가하기 버튼 문구
            selectedBtn: target, // 어떤 버튼 선택했는지 넘겨주는 상태변수
            navigateFunc: () => navigate("/approval/write") //추가하기 버튼에 줄 페이지 이동 함수
            });


    

    //5. 디테일 페이지로 이동
    const handleToDetail = (seq) => {
        navigate(`/approval/detail/${seq}`, { state: { path: target || "" } });
    };




    return(
        <div className={styles.container}>  {/* 전체 영역, 부모의 100%를 가지기 */}
            

            {/* 서브 네비바 영역 */}
            <div className={styles.left}>
            <SubSideBar  data={subSidebarData}/>
            </div>


            {/* 서브 네비바 제외 우측 영역 */}
            <div className={styles.right}>
                <div className={styles.approvalListBox}>
                    <div className={styles.listFirst}>{type}</div>
                    <div className={styles.listSecond}>
                        <div>번호</div>
                        <div>제목</div>
                        <div>작성일</div>
                        <div>결재상태</div>
                    </div>
                    <div className={styles.listThird}>
                        {datas.map((data) => {
                            const className = {
                                '처리중': styles.inProgress,
                                '완료': styles.approved,
                            }[data.approval_status] || styles.denied;

                            return (
                                <div key={data.approval_seq} className={styles.listRow}>
                                    <div>{data.approval_seq}</div>
                                    <div className={styles.hoverPointer} onClick={() => handleToDetail(data.approval_seq)}>
                                        {data.approval_title}
                                    </div>
                                    <div>{data.approval_at}</div>
                                    <div className={className}>
                                        {data.approval_status}
                                    </div>
                                </div>
                            );
                        }
                        )}
                    </div>

                </div>
            </div>
            
        </div>
    );
}

export default ApprovalList;
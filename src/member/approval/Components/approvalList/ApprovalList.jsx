import { useEffect, useState } from "react";
import SubSideBar from "../../../navis/subsidebar/SubSideBar";
import styles from "./ApprovalList.module.css"
import { useLocation, useNavigate } from "react-router-dom";

function ApprovalList(){
    // 1. 경로 추출
    const location = useLocation();
    const target = location.pathname.split('/')[3]; // URL 경로에서 타입 추출
    const navigate = useNavigate();
    
    // 2. 경로에 따라서 데이터 값 요청하도록
    // useEffect(() => {
    //     const serverPath = target ? `http://10.5.0.0/approval/${target}` : `http://10.5.0.0/getAll`;
    //     axios.get(serverPath)
    //         .then(response => {
    //             setDatas(response.data);
    //         })
    // })
    //휴가 리스트 더미 객체 (이후에는 버튼마다 onClick 걸어놓고 aixios 통신해서 데이터 받아오고 props로 넘겨주기)
    //휴가 리스트 더미 객체 (이후에는 버튼마다 onClick 걸어놓고 aixios 통신해서 데이터 받아오고 props로 넘겨주기)
    const [datas, setDatas] = useState([
        { seq: 1, title: "휴가신청", writedate: "2024-06-01", status: "결재 처리중" },
        { seq: 2, title: "출장신청", writedate: "2024-06-02", status: "결재 완료" },
        { seq: 3, title: "휴가신청", writedate: "2024-06-03", status: "결재 반려" },
        { seq: 4, title: "휴가신청", writedate: "2024-06-04", status: "결재 완료" }
    ]);
    
    
    //3. 경로에 따라서 상단 문구 변경
    const statusMap = {
        inprogress: '결재 처리중',
        denied: '결재 반려',
        approved: '결재 완료',
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
    // const [btns, setBtns] = useState([
    //     { name: "전체", path: "/member/approval" },
    //     { name: "결재 처리중", path: "/member/approval/inprogress" },
    //     { name: "결재 반려", path: "/member/approval/denied" },
    //     { name: "결재 완료", path: "/member/approval/approved" }
    // ]);
    // const navigateFunc = () => {
    //     navaigate("/approval/write");
    // }
    // const text = "서류 작성";
    // const [selectedBtn, setSelectedBtn] = useState(target);

    const [subSidebarData, setSubSidebarData] = useState({
            btns: [{ name: "전체", path: "/member/approval" },
                   { name: "결재 처리중", path: "/member/approval/inprogress" },
                   { name: "결재 반려", path: "/member/approval/denied" },
                   { name: "결재 완료", path: "/member/approval/approved" }
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
                approval list 컨테이너 영역
            </div>
            
        </div>
    );
}

export default ApprovalList;
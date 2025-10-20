import { useEffect, useState } from "react";
import { caxios } from "../../../../config/config"
import { useNavigate } from "react-router-dom";

function useMyinform() {
    const navigate = useNavigate();
    const id = sessionStorage.getItem("id");

     // 수정 모드 상태
    const [isEditing, setIsEditing] = useState(false);
    // 유저 데이터 받을 준비
    const [memberData, setMemberData] = useState({
        email: "", dept_code: "", level_code: ""
    });

    useEffect(() => {
        caxios.post("/member/mypage", { email: id },
            { withCredentials: true })
            .then(resp => {
                if (resp.data) {
                    setMemberData(prev => ({
                        ...prev,
                        email: resp.data[0].email,
                        dept_code: resp.data[0].dept_code,
                        level_code: resp.data[0].level_code
                    }));
                    setName(resp.data[0].name);
                    setPhone(resp.data[0].phone.replace(/-/g, " - "));
                    setPhone1(resp.data[0].phone.substring(4, 8));
                    setPhone2(resp.data[0].phone.substring(9));
                }
            })
            .catch(err => {
                console.log(err);
                navigate("/"); alert("토큰 확인 실패 또는 오류 발생");
            })
    }, [isEditing, id]);

    // 입력값 상태
    const [name, setName] = useState(memberData.name);
    const [phone, setPhone] = useState(memberData.phone);
    const [phone1, setPhone1] = useState(""); // 핸드폰번호입력 우측
    const [phone2, setPhone2] = useState(""); // 핸드폰번호입력 좌측

    // 수정버튼 클릭시
    const handleEditClick = () => {setIsEditing(true);}

    // 수정 취소 클릭시
    const handleCancelClick = () => setIsEditing(false);
    // 수정 완료 클릭시
    const handleSaveClick = () => {
        if (!name.trim() || !phone1.trim() || !phone2.trim() || !phone.trim()) {
            alert("이름과 연락처를 모두 입력해주세요.");
            return;
        }
        // TODO: 서버 전송 로직 가능
        caxios.post("/member/updateMypage", { email: id, name: name, phone: `010${phone1}${phone2}` },
            { withCredentials: true })
            .then(resp => {
                alert("수정이 완료되었습니다.");
                setIsEditing(false);
            })
            .catch(err => {
                console.log(err);
                alert("수정실패");
            })

    };

    return {
        id, memberData, isEditing, name, phone, phone1, phone2,
        setName, setPhone1, setPhone2,
        handleSaveClick, handleEditClick, handleCancelClick
    }
}
export default useMyinform;
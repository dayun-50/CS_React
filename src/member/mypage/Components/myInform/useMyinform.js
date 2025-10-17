import { useEffect, useState } from "react";
import { caxios } from "../../../../config/config"
import { useNavigate } from "react-router-dom";

function useMyinform() {
    const navigate = useNavigate();

    const [memberData, setMemberData] = useState({
        email: "", name: "",
        dept_code: "", level_code: "",
        phone: ""
    });

    useEffect(() => {
        const id = sessionStorage.getItem("id");
        caxios.post("/member/mypage", { email: id },
            { withCredentials: true })
            .then(resp => {
                if (resp.data) {
                    setMemberData({
                        email: resp.data.email,
                        name: resp.data.name,
                        dept_code: resp.data.dept_code,
                        level_code: resp.data.level_code,
                        phone: resp.data.phone
                    });
                    setName(resp.data.name);
                    setPhone(resp.data.phone);
                      console.log("전달받은값",memberData);
                }
                console.log(resp.data);
            })
            .catch(err => {
                console.log(err);
                navigate("/"); alert("토큰 확인 실패 또는 오류 발생");
            })
    }, [])

    // 인풋 입력 가능, 불가능용
    const isDisabledByName = () => {

    }

    // 수정 모드 상태
    const [isEditing, setIsEditing] = useState(false);

    // 입력값 상태
    const [name, setName] = useState(memberData.name);
    const [phone, setPhone] = useState(memberData.phone);

    const handleEditClick = () => setIsEditing(true);
    const handleCancelClick = () => setIsEditing(false);

    const handleSaveClick = () => {
        if (!name.trim() || !phone.trim()) {
            alert("이름과 연락처를 모두 입력해주세요.");
            return;
        }
        // TODO: 서버 전송 로직 가능
        alert("수정이 완료되었습니다.");
        setIsEditing(false);
    };

    return {
        memberData, isEditing, name, phone,
        setName, setPhone,
        handleSaveClick, handleEditClick, handleCancelClick
    }
}
export default useMyinform;
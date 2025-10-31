import { useEffect, useState } from "react";
import { caxios } from "../../../config/config"
import { useLocation, useNavigate } from "react-router-dom";

function useGewpw() {
    const navigate = useNavigate();
    const location = useLocation();

    // 빈값인지 확인용
    const [check, setCheck] = useState({ pw: false });

    // 상태변수 및 아이디값 준비
    const [pw, setPw] = useState("");
    const { id } = location.state || {};

    // 비밀번호 핸들러
    const hendleChangeByPw = (e) => {
        let value = e.target.value;
        setPw(value);
        if (value != "") {
            setCheck(prev => ({
                ...prev,
                pw: true
            }));
        }
    }

    // 완료 버튼 클릭시
    const clickByComplete = () => {
        if (check == false) {
            return false;
        }

        caxios.post("/member/gnewpw", { email: id, pw: pw },
            { withCredentials: true })
            .then(resp=>{
                navigate("/");
            })
            .catch(err=>{
                console.log(err);
                alert("변경 실패");
                setPw("");
            })
    }

    return {
        pw, hendleChangeByPw, clickByComplete
    }
}
export default useGewpw;

/* 혜빈쨩 비밀번호 재설정 유효성검사가 빠져있다능 , 유효성 css 해야 한다능 */
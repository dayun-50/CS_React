import { useEffect, useState } from "react";
import { caxios } from "../../../config/config"
import { useLocation, useNavigate } from "react-router-dom";

function useGewpw() {
    const navigate = useNavigate();
    const location = useLocation();

    // 빈값인지 확인용
    const [check, setCheck] = useState({ pw: false });
    const pwRegex = /^[a-z0-9!@#$%^&*()]{6,}$/; // 소문자,숫자,특수문자 최소 6글자 이상

    // 상태변수 및 아이디값 준비
    const [pw, setPw] = useState("");
    const { id } = location.state || {};

    // 비밀번호 핸들러
    const hendleChangeByPw = (e) => {
        let value = e.target.value;
        setPw(value);
        setCheck((prev) => ({
            ...prev,
            pw: pwRegex.test(value),
        }));
        if (check.pw === false) {
            /*
                      보더 색깔창이요
                  */
        }
    }

    // 완료 버튼 클릭시
    const clickByComplete = () => {
        if (check.pw == false) {
            return false;
        }

        caxios.post("/member/gnewpw", { email: id, pw: pw },
            { withCredentials: true })
            .then(resp => {
                navigate("/");
            })
            .catch(err => {
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
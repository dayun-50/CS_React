import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import { useLocation, useNavigate } from "react-router-dom";

function useGewpw() {
    const navigate = useNavigate();
    const location = useLocation();

    // 유효성 확인용 상태
    const [error, setError] = useState({ pw: false });

    // 상태변수 및 아이디값
    const [pw, setPw] = useState("");
    const { id } = location.state || {};

    // pwRegex: 최소 6글자, 소문자/숫자/특수문자 허용
    const pwRegex = /^[a-z0-9!@#$%^&*()]{6,}$/;

    // 비밀번호 핸들러 (실시간 유효성 체크)
    const hendleChangeByPw = (e) => {
        const value = e.target.value;
        setPw(value);

        // pwRegex 기준으로 유효성 체크
        const isValid = pwRegex.test(value);
        setError({ pw: !isValid }); // 유효하지 않으면 true → border 적용
    };

    // 완료 버튼 클릭시
    const clickByComplete = () => {
        // pwRegex 기준으로 유효성 검사
        const isValid = pwRegex.test(pw);
        if (!isValid) {
            setError({ pw: true });
            alert("비밀번호는 최소 6글자, 소문자/숫자/특수문자만 가능합니다.");
            return false;
        }

        // 서버 전송
        caxios.post("/member/gnewpw", { email: id, pw: pw }, { withCredentials: true })
            .then(resp => {
                navigate("/");
            })
            .catch(err => {
                console.log(err);
                alert("변경 실패");
                setPw("");
            });
    };

    return {
        pw, hendleChangeByPw, clickByComplete, error,
    };
}

export default useGewpw;

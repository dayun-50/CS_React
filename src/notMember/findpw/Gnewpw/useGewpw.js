import { useEffect, useState } from "react";
import { caxios } from "../../../config/config"
import { useLocation, useNavigate } from "react-router-dom";

function useGewpw() {
    const navigate = useNavigate();
    const location = useLocation();

    // 빈값인지 확인용
    const [check, setCheck] = useState({ pw: false });

    // 유효성 확인용 상태 추가
    const [error, setError] = useState({ pw: false });

    // 상태변수 및 아이디값 준비
    const [pw, setPw] = useState("");
    const { id } = location.state || {};

    // 비밀번호 핸들러 (실시간 유효성 체크)
    const hendleChangeByPw = (e) => {
        const value = e.target.value;
        setPw(value);

        // 입력 여부 체크
        setCheck(prev => ({
            ...prev,
            pw: value !== ""
        }));

        // 실시간 유효성 체크: 8자리 이상, 숫자 포함, 특수문자 포함
        const isValid = value.length >= 8 && /[0-9]/.test(value) && /[!@#$%^&*]/.test(value);
        setError({ pw: !isValid }); // 유효하지 않으면 true → border 적용
    };

    // 완료 버튼 클릭시
    const clickByComplete = () => {
        // 비밀번호 유효성 검사
        const isValid = pw.length >= 8 && /[0-9]/.test(pw) && /[!@#$%^&*]/.test(pw);
        if (!isValid) {
            setError({ pw: true }); // border 표시
            alert("비밀번호는 8자리 이상, 숫자와 특수문자를 포함해야 합니다.");
            return false;
        }

        // 기존 서버 전송 코드
        caxios.post("/member/gnewpw", { email: id, pw: pw },
            { withCredentials: true })
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
    }
}
export default useGewpw;

/* 혜빈쨩 비밀번호 재설정 유효성검사가 빠져있다능 , 유효성 css 해야 한다능 */
import { useState } from "react";
import { caxios } from "../../config/config"
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

function useLogin() {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    // 입력창 빈값 확인용
    const [check, setCheck] = useState({ id: false, pw: false });

    // 상태변수 준비
    const [id, setId] = useState(""); // 이메일
    const [pw, setPw] = useState(""); // 비밀번호

    // 아이디(이메일) 입력창 핸들러
    const hendleChangeById = (e) => {
        let value = e.target.value;
        setId(value);
        if (value !== "") { // 입력했을시
            setCheck(prev => ({
                ...prev,
                id: true
            }));
        } else { // 빈값일때
            setCheck(prev => ({
                ...prev,
                id: false
            }));
        }
    }
    // 비밀번호 입력창 핸들러
    const hendleChangeByPw = (e) => {
        let value = e.target.value;
        setPw(value);
        if (value !== "") { // 입력했을시
            setCheck(prev => ({
                ...prev,
                pw: true
            }));
        } else { // 빈값일때
            setCheck(prev => ({
                ...prev,
                pw: false
            }));
        }
    }

    // 로그인 버튼 클릭시
    const clickLogin = () => {
        const allvalid = Object.values(check).every(value => value === true);
        // 입력 안한칸이 있다면 false로 중단
        if (!allvalid) {
            /* 
                입력안한칸에 보더색깔 줄건지 여쭤보는걸로~!
            */
            return false;
        }

        // if문 통과시 데이터 전송
        caxios.post("/member/login",
            { email: id, pw: pw }, { withCredentials: true })
            .then(resp => {
                if (resp.data) { // 로그인 성공시 토큰 및 id값 저장
                    login(resp.data, id);
                    navigate("/");
                }
            })
            .catch(err => {
                alert("로그인 실패 : 이메일 또는 비밀번호 확인 필요"); // 나중에 제거하셈
                setId(""); setPw("");
            })
    }

    return {
        id, pw,
        hendleChangeById, hendleChangeByPw,
        clickLogin
    }
}
export default useLogin;
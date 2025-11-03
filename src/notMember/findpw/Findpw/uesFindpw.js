import { useEffect, useState } from "react";
import { caxios } from "../../../config/config"
import { useNavigate } from "react-router-dom";

function useFindpw() {
    const navigate = useNavigate();

    // 입력창 빈값 확인용
    const [check, setCheck] = useState({ id: false, idcheck: false });

    // error 상태 추가 이메일 인증 실패
    const [error, setError] = useState({ emailauth: false });

    // 상태변수 준비
    const [id, setId] = useState(""); // 이메일
    const [emailauth, setEmailauth] = useState(""); // 이메일 인증
    const [serverCode, setServerCode] = useState(""); // 서버에서 보낸 인증번호 받을 준비

    // 정규식
    const idRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // e-mail 정규식(영서띠가보내줌)

    useEffect(() => {
        if (serverCode !== "") {
            console.log("업데이트된 serverCode:", serverCode);
        }
    }, [serverCode]);

    // 아이디(이메일) 입력창 핸들러
    const hendleChangeById = (e) => {
        let value = e.target.value;
        setId(value);
        setCheck(prev => ({
            ...prev,
            id: idRegex.test(value),
            idcheck: false
        }));
        if (check.id === false) {
            /*
                보더 색깔창이요
            */
        }
    }
    // 이메일 인증 핸들러
    const hendleChangeByEmailauth = (e) => {
        let value = e.target.value;
        setEmailauth(value);
        if (value == serverCode) { // 서버에서 전달해준 값과 같다면
            setCheck(prev => ({ ...prev, idcheck: true }));
            setError(prev => ({ ...prev, emailauth: false })); // 틀렸으면 border 제거
        } else {
            setCheck(prev => ({ ...prev, idcheck: false }));
            setError(prev => ({ ...prev, emailauth: true })); // 틀렸으면 border 표시
            /*
                보더 색넣는거 해야함
            */
        }
    }

    // 이메일 인증 클릭시
    const clickByEmailauth = () => {
        if (id === "") { // 이메일란에 아무것도 입력안할시 중지
            return false;
        }
        caxios.post("/member/findpw", { email: id },
            { withCredentials: true }) // 사원 테이블에 있는지부터 체크
            .then(resp => {
                if (resp) { // 사원테이블에 존재하지 않은 이메일일시
                    // 사원 존재하면 이메일 발송
                    caxios.post("/emailauth", { email: id },
                        { withCredentials: true })
                        .then(resp => {
                            if (resp) {
                                alert("이메일 발송 성공");
                                setServerCode(resp.data);
                            }
                        });
                }
            })
            .catch(err => {
                console.log(err);
                alert("이메일 확인 필요 : 동일한 이메일을 찾지 못하였습니다");
                setId(""); setEmailauth(""); setServerCode("");
            });
    }

    // 완료 버튼 클릭시
    const clickByComplete = () => {
        const allvalid = Object.values(check).every(value => value === true);
        // 빈값이 아니라 값이 다 들어있고 모두 올바른 값이라면
        if (!allvalid) {
            alert("인증 실패 : 인증 번호 재확인 필요");
            return false;
        }
        navigate("../Gnewpw/Gnewpw", { state: { id: id } });
    }


    return {
        id, emailauth,
        hendleChangeById, hendleChangeByEmailauth,
        clickByEmailauth, clickByComplete,
        error,
    }
}
export default useFindpw;
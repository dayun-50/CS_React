import { useState } from "react";
import { caxios } from "../../config/config";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 입력창 빈값 확인용
  const [check, setCheck] = useState({ id: false, pw: false });

  // 상태변수 준비
  const [id, setId] = useState(""); // 이메일
  const [pw, setPw] = useState(""); // 비밀번호

  // 아이디(이메일) 입력창 핸들러
  const hendleChangeById = (e) => {
    let value = e.target.value;
    setId(value);
    if (value !== "") {
      // 입력했을시
      setCheck((prev) => ({
        ...prev,
        id: true,
      }));
    } else {
      // 빈값일때
      setCheck((prev) => ({
        ...prev,
        id: false,
      }));
    }
  };
  // 비밀번호 입력창 핸들러
  const hendleChangeByPw = (e) => {
    let value = e.target.value;
    setPw(value);
    if (value !== "") {
      // 입력했을시
      setCheck((prev) => ({
        ...prev,
        pw: true,
      }));
    } else {
      // 빈값일때
      setCheck((prev) => ({
        ...prev,
        pw: false,
      }));
    }
  };

  // 로그인 버튼 클릭시
  const clickLogin = () => {
    const allvalid = Object.values(check).every((value) => value === true);
    // 입력 안한칸이 있다면 false로 중단
    if (!allvalid) {
      /* 
                입력안한칸에 보더색깔 줄건지 여쭤보는걸로~!
            */
      return false;
    }

    // 💡 1. 토큰 분리 로직을 처리하는 헬퍼 함수 정의
    const processLoginResponse = (combinedToken) => {
      const cleanToken = combinedToken.trim();
      // 💡 토큰을 "|||" 구분자로 분리
      const tokenParts = cleanToken.split("|||");

      if (tokenParts.length === 2) {
        const generalToken = tokenParts[0].trim(); // (Token A: 일반 API용)
        const jamesAccessToken = tokenParts[1].trim(); // (Token B: 메일 발송용)

        // 2. 각각의 sessionStorage 키에 저장
        sessionStorage.setItem("token", generalToken);

        sessionStorage.setItem("jamesAccessToken", jamesAccessToken);

        console.log("일반 토큰 (A):", generalToken);
        console.log("메일 토큰 (B):", jamesAccessToken);
        return generalToken;
      }
      return null;
    };

    // if문 통과시 데이터 전송
    caxios
      .post("/member/login", { email: id, pw: pw }, { withCredentials: true })
      .then((resp) => {
        if (resp.data) {
          // 로그인 성공시 토큰 및 id값 저장
          const generalToken = processLoginResponse(resp.data);

          if (generalToken) {
            login(generalToken, id);
            navigate("/");
          } else {
            alert("토큰 구조 오류로 로그인 실패");
          }
        }
      })
      .catch((err) => {
        alert("로그인 실패 : 이메일 또는 비밀번호 확인 필요1"); // 나중에 제거하셈
        setId("");
        setPw("");
      });
  };

  return {
    id,
    pw,
    hendleChangeById,
    hendleChangeByPw,
    clickLogin,
  };
}
export default useLogin;

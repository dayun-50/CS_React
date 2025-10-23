import { useEffect, useState } from "react";
import { caxios } from "../../config/config";
import { useNavigate } from "react-router-dom";

function useSignin() {
  const navigate = useNavigate();

  // 유효성 검사 확인용
  const [check, setCheck] = useState({
    id: false,
    idcheck: false,
    pw: false,
    name: false,
    phone1: false,
    phone2: false,
    code: false,
    checkBox: false,
  });

  // 정규식
  const idRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // e-mail 정규식(영서띠가보내줌)
  const pwRegex = /^[a-z0-9!@#$%^&*()]{6,}$/; // 소문자,숫자,특수문자 최소 6글자 이상
  const nameRegex = /^[가-힣]{2,6}$/; // 한국이름만 허용
  const phoneRegex = /^\d{4}$/; // 전화번호 4자씩 끊어서 검사할거라 4만함

  // 상태변수 준비
  const [id, setId] = useState(""); // 이메일
  const [emailauth, setEmailauth] = useState(""); // 이메일 인증
  const [serverCode, setServerCode] = useState(""); // 서버에서 보낸 인증번호 받을 준비
  const [pw, setPw] = useState(""); // 비밀번호
  const [name, setName] = useState(""); // 이름
  const [phone1, setPhone1] = useState(""); // 핸드폰번호입력 우측
  const [phone2, setPhone2] = useState(""); // 핸드폰번호입력 좌측
  const [code, setCode] = useState(""); // 초대코드
  const [checked, setChecked] = useState(false); // 개인정보 동의

  useEffect(() => {
    if (serverCode !== "") {
      console.log("업데이트된 serverCode:", serverCode);
    }
  }, [serverCode]);

  // 아이디(이메일) 입력창 핸들러
  const hendleChangeById = (e) => {
    let value = e.target.value;
    setId(value);
    console.log(check.idcheck); // 나중에 제거
    setCheck((prev) => ({
      ...prev,
      id: idRegex.test(value),
      idcheck: false,
    }));
    if (check.id === false) {
      /*
                보더 색깔창이요
            */
    }
  };
  // 이메일 인증 핸들러
  const hendleChangeByEmailauth = (e) => {
    let value = e.target.value;
    setEmailauth(value);
    if (value == serverCode) {
      // 서버에서 전달해준 값과 같다면
      setCheck((prev) => ({ ...prev, idcheck: true }));
    } else {
      setCheck((prev) => ({ ...prev, idcheck: false }));
      /*
                보더 색넣는거 해야함
            */
    }
  };
  // 비밀번호 입력창 핸들러
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
  };
  // 이름 입력창 핸들러
  const hendleChangeByName = (e) => {
    let value = e.target.value;
    setName(value);
    setCheck((prev) => ({
      ...prev,
      name: nameRegex.test(value),
    }));
    if (check.name === false) {
      /*
                보더 색깔창이요
            */
    }
  };
  // 우측 전화번호 입력창 핸들러
  const hendleChangeByPhone1 = (e) => {
    let value = e.target.value;
    setPhone1(value);
    setCheck((prev) => ({
      ...prev,
      phone1: phoneRegex.test(value),
    }));
    if (check.phone1 === false) {
      /*
                보더 색깔창이요
            */
    }
  };
  // 좌측 전화번호 입력창 핸들러
  const hendleChangeByPhone2 = (e) => {
    let value = e.target.value;
    setPhone2(value);
    setCheck((prev) => ({
      ...prev,
      phone2: phoneRegex.test(value),
    }));
    if (check.phone2 === false) {
      /*
                보더 색깔창이요
            */
    }
  };
  // 초대코드 입력창 핸들러
  const hendleChangeByCode = (e) => {
    let value = e.target.value;
    setCode(e.target.value);
    if (value != "") {
      setCheck((prev) => ({
        ...prev,
        code: true,
      }));
    }
  };
  // 개인정보 동의 체크란 클릭마다 그에따른 true / false 값 대입
  const clickByChacBox = (e) => {
    let value = e.target.checked;
    setChecked(value);
    setCheck((prev) => ({
      ...prev,
      checkBox: value,
    }));
  };

  // 이메일 인증 클릭시
  const clickByEmailauth = () => {
    if (id === "") {
      // 이메일란에 아무것도 입력안할시 중지
      return false;
    }

    caxios
      .post(`/emailauth`, { email: id }, { withCredentials: true })
      .then((resp) => {
        if (resp) {
          // 이메일 전송 성공시
          alert("이메일 발송 성공");
          setServerCode(resp.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 완료 버튼 클릭시
  const clickByComplete = () => {
    if (code === "") {
      //초대코드 비입력시
      return false;
    }
    console.log(check);

    const allvalid = Object.values(check).every((value) => value === true);
    // 유효성(정규식) 모두 통과시 true , 하나라도 false 라면 false
    if (!allvalid) {
      // 하나라도 유효성(정규식) 검사에 false 라면
      /*
                뭐 알림을 띄울건지 팀장님께 여쭤봐야할거 같습니다.
            */
      alert("a"); // 나중에 제거하셈
      return false;
    }

    // 위에 모든 if문 통과시 데이터보내기
    caxios
      .post(
        "/member",
        {
          email: id,
          pw: pw,
          name: name,
          phone: `010${phone1}${phone2}`,
          company_code: code,
        },
        { withCredentials: true }
      )
      .then((resp) => {
        alert("회원가입 성공!"); // 나중에 제거하셈
        navigate("/"); // Login으로 이동
      })
      .catch((err) => {
        setId("");
        setEmailauth("");
        setServerCode("");
        setPw("");
        setName("");
        setPhone1("");
        setChecked(false);
        setPhone2("");
        setCode("");
        alert("회원가입 실패 : 사용중인 이메일");
      });
  };

  return {
    id,
    emailauth,
    pw,
    name,
    phone1,
    phone2,
    code,
    checked,
    hendleChangeById,
    hendleChangeByPw,
    hendleChangeByName,
    hendleChangeByPhone1,
    hendleChangeByPhone2,
    hendleChangeByCode,
    hendleChangeByEmailauth,
    clickByChacBox,
    clickByComplete,
    clickByEmailauth,
  };
}
export default useSignin;

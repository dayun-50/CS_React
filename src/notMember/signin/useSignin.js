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

  // 유효성 검사 표시용
  const [error, setError] = useState({
      id: false,
      idcheck: false,
      pw: false,
      name: false,
      phone1: false,
      phone2: false,
      code: false,
      checkBox: false
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
  const value = e.target.value;
  setId(value);

  let isValid = false;

  if (value === "") {
    // 입력이 없으면 유효성 검사 false, error 표시도 없음
    isValid = false;
    setError(prev => ({ ...prev, id: false }));
  } else {
    // 입력이 있을 때만 정규식 체크
    isValid = idRegex.test(value);
    setError(prev => ({ ...prev, id: !isValid }));
  }

  setCheck(prev => ({ ...prev, id: isValid, idcheck: false }));
};

/*-----------------------------------------------------------------*/

  // 이메일 인증 핸들러
  const hendleChangeByEmailauth = (e) => {
  const value = e.target.value;
  setEmailauth(value);

  // 1) 빈값 또는 서버코드 없음 → border 없음
  if (!value || !serverCode) {
    setCheck(prev => ({ ...prev, idcheck: false }));
    setError(prev => ({ ...prev, idcheck: false }));
    return;
  }

  // 2) 서버 코드와 비교
  if (value === String(serverCode)) {
    // 일치 → 정상
    setCheck(prev => ({ ...prev, idcheck: true }));
    setError(prev => ({ ...prev, idcheck: false }));
  } else {
    // 불일치 → border 빨강
    setCheck(prev => ({ ...prev, idcheck: false }));
    setError(prev => ({ ...prev, idcheck: true }));
  }
};

/*-----------------------------------------------------------------*/

  // 비밀번호 입력창 핸들러
  const hendleChangeByPw = (e) => {
  const value = e.target.value;
  setPw(value);

  if (!value) {
    // 빈 입력 → border 없음
    setCheck(prev => ({ ...prev, pw: false }));
    setError(prev => ({ ...prev, pw: false }));
    return;
  }

  if (pwRegex.test(value)) {
    // 정규식 통과 → 정상
    setCheck(prev => ({ ...prev, pw: true }));
    setError(prev => ({ ...prev, pw: false }));
  } else {
    // 정규식 실패 → border 빨강
    setCheck(prev => ({ ...prev, pw: false }));
    setError(prev => ({ ...prev, pw: true }));
  }
};

/*-----------------------------------------------------------------*/

  // 이름 입력창 핸들러
  const hendleChangeByName = (e) => {
  const value = e.target.value;
  setName(value);

  if (!value) {
    // 입력 없으면 border 없음
    setCheck(prev => ({ ...prev, name: false }));
    setError(prev => ({ ...prev, name: false }));
    return;
  }

  if (nameRegex.test(value)) {
    // 정규식 통과 → 정상
    setCheck(prev => ({ ...prev, name: true }));
    setError(prev => ({ ...prev, name: false }));
  } else {
    // 정규식 실패 → border 빨강
    setCheck(prev => ({ ...prev, name: false }));
    setError(prev => ({ ...prev, name: true }));
  }
};

/*-----------------------------------------------------------------*/

  // 우측 전화번호 입력창 핸들러
  const hendleChangeByPhone1 = (e) => {
  const value = e.target.value;
  setPhone1(value);

  if (!value) {
    setCheck(prev => ({ ...prev, phone1: false }));
    setError(prev => ({ ...prev, phone1: false }));
    return;
  }

  if (phoneRegex.test(value)) {
    setCheck(prev => ({ ...prev, phone1: true }));
    setError(prev => ({ ...prev, phone1: false }));
  } else {
    setCheck(prev => ({ ...prev, phone1: false }));
    setError(prev => ({ ...prev, phone1: true }));
  }
};
  // 좌측 전화번호 입력창 핸들러
  const hendleChangeByPhone2 = (e) => {
  const value = e.target.value;
  setPhone2(value);

  if (!value) {
    setCheck(prev => ({ ...prev, phone2: false }));
    setError(prev => ({ ...prev, phone2: false }));
    return;
  }

  if (phoneRegex.test(value)) {
    setCheck(prev => ({ ...prev, phone2: true }));
    setError(prev => ({ ...prev, phone2: false }));
  } else {
    setCheck(prev => ({ ...prev, phone2: false }));
    setError(prev => ({ ...prev, phone2: true }));
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
      alert("입력값 조건 불일치"); // 나중에 제거하셈
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
    error,
  };
}
export default useSignin;

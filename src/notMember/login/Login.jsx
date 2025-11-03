import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import useLogin from "./useLogin";

function Login() {

    // js 코드들 따로 모아두고 임포트시켜서 사용함
    const {
        id, pw, error, hendleChangeById, hendleChangeByPw, clickLogin
    } = useLogin();

    return (
        <div className={styles.container}
            style={{
                width: '100vw',
                height: '100vh',
                backgroundImage: 'url(/back.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div className={styles.loginbox}>

                <div className={styles.logininbox}>

                    <div className={styles.img}>
                        <img className={styles.logo} src="/Logo.png" alt="Logo" />
                    </div>

                    <h1>CS에 오신 걸 환영합니다!</h1>

                    <div className={styles.emailbox}>
                        <label htmlFor="email">이메일</label><br />
                        <input
                            id="email"
                            type="email"
                            placeholder="이메일"
                            value={id}
                            onChange={hendleChangeById}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") clickLogin();
                            }}
                            className={`${error.id ? styles.inputError : ""}`} //빈값이면 border
                        />
                    </div>

                    <div className={styles.pwbox}>
                        <label htmlFor="pw">비밀번호</label><br />
                        <input
                            id="pw"
                            type="password"
                            placeholder="비밀번호"
                            value={pw}
                            onChange={hendleChangeByPw}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") clickLogin();
                            }}
                            className={`${error.pw ? styles.inputError : ""}`} // 빈값이면 border
                        />
                    </div>

                    <button className={styles.loginbutton} onClick={clickLogin}>로그인</button>

                    <p className={styles.signup}>
                        회원이 아니신가요? <Link to="/signin">회원가입</Link>
                    </p>

                    <Link to="/findpw" className={styles.changepw}>비밀번호 찾기</Link>

                </div>
            </div>
        </div>
    );
};

export default Login;
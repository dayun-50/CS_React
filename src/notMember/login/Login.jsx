import { Link } from "react-router-dom";
import styles from "./Login.module.css";

function Login (){
    return(
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
                    <img src="/Logo.png" alt="Logo" />
                    </div>

                    <h1>CS에 오신 걸 환영합니다!</h1>
                    
                    <div className={styles.emailbox}>
                    <label htmlFor="email">이메일</label><br/>
                    <input id="email" type="email" placeholder="이메일" />
                    </div>

                    <div className={styles.pwbox}>
                    <label htmlFor="pw">비밀번호</label><br/>
                    <input id="pw" type="password" placeholder="비밀번호"/>
                    </div>

                    <button className={styles.loginbutton}>로그인</button>

                    <p className={styles.signup}>
                        회원이신가요? <Link to="/Signin">회원가입</Link>
                    </p>

                    <Link to="/Findpw" className={styles.changepw}>비밀번호 찾기</Link>
                    
                </div>
            </div>
        </div>
    );
};

export default Login;
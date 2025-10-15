import { useNavigate } from "react-router-dom";
import styles from "./Findpw.module.css";

function Findpw (){

    const navigate = useNavigate();

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
            <div className={styles.pwfindbox}>

                <div className={styles.pfin}>

                    <div className={styles.high}>
                        <h1>비밀번호 찾기</h1>
                        <span>비밀번호를 잊어버리셨나요?</span>
                    </div>

                    <div className={styles.findemail}>
                        <label htmlFor="email">이메일</label>
                        <div className={styles.inputButtonemail}>
                        <input id="email" type="email" placeholder="이메일" />
                        <button className={styles.emailrequest}>인증 요청</button>
                        </div>
                    </div>

                    <div className={styles.requestcheck}>
                        <label htmlFor="emailcheck">인증확인</label>
                        <input id="emailcheck" type="text" placeholder="인증확인"/>
                    </div>

                    <div className={styles.pwcheckbuttons}>
                        <button className={styles.backbt} onClick={() => navigate(-1)}>취소</button>
                        <button className={styles.okbt} onClick={() => navigate("/gnewpw")}>완료</button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Findpw;
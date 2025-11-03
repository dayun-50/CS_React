import { useNavigate } from "react-router-dom";
import styles from "./Findpw.module.css";
import useFindpw from "./uesFindpw";

function Findpw (){

    const navigate = useNavigate();

    const{
        id, emailauth, 
        hendleChangeById, hendleChangeByEmailauth, 
        clickByEmailauth, clickByComplete,
        error
    } = useFindpw();

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
                        <input id="email" type="email" placeholder="이메일" value={id} onChange={hendleChangeById}/>
                        <button className={styles.emailrequest} onClick={clickByEmailauth}>인증 요청</button>
                        </div>
                    </div>

                    <div className={styles.requestcheck}>
                        <label htmlFor="emailcheck">인증확인</label>
                        <input 
                            id="emailcheck" 
                            type="text" 
                            placeholder="인증확인" 
                            value={emailauth} 
                            onChange={hendleChangeByEmailauth}
                            className={`${error.emailauth ? styles.inputError : ""}`}/>
                    </div>

                    <div className={styles.pwcheckbuttons}>
                        <button className={styles.backbt} onClick={() => navigate(-1)}>취소</button>
                        <button className={styles.okbt} onClick={clickByComplete}>완료</button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Findpw;
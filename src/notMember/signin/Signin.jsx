import { useNavigate } from "react-router-dom";
import styles from "./Signin.module.css";

function Signin (){

    const navigate = useNavigate();

    return(
        <div
            className={styles.container}
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
            <div className={styles.membershipbox}>

                <div className={styles.mbsinbox}>

                    <div className={styles.h1h1}>
                    <h1 className={styles.newusertitle}>회원가입</h1>
                    </div>
                    
                    <div className={styles.newemail}>
                        <label htmlFor="email">이메일</label>
                        <div className={styles.inputButtonWrapper}>
                            <input id="email" type="email" placeholder="이메일" />
                            <button className={styles.emailauth}>이메일 인증</button>
                        </div>
                    </div>

                    <div className={styles.newpw}>
                    <label htmlFor="emailok">이메일 확인</label>
                    <input id="emailok" type="password" placeholder="이메일 인증"/> <br/>
                    </div>

                    <div className={styles.newpw}>
                    <label htmlFor="password">비밀번호</label>
                    <input id="password" type="password" placeholder="비밀번호"/> <br/>
                    </div>

                    <div className={styles.name}>
                    <label htmlFor="name">이름</label>
                    <input id="name" type="text" placeholder="이름"/> <br/>
                    </div>

                    <div className={styles.phone}>
                        <label htmlFor="phone">연락처</label>
                        <div className={styles.phoneWrapper}>
                            <span className={styles.prefix}>010 -</span>
                            <input id="phone1" type="text" placeholder="연락처" />
                            <span className={styles.dash}>-</span>
                            <input id="phone2" type="text" placeholder="연락처" />
                        </div>
                    </div>

                    <div className={styles.invitecode}>
                    <label htmlFor="code">초대코드</label>
                    <input id="code" type="text" placeholder="초대코드"/> <br/>
                    </div>

                    <div className={styles.okcheck}>
                    <label className={`${styles.checkboxLabel} ${styles.true}`}>
                        <input type="checkbox" /> 개인정보 동의
                    </label>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.backbutton} onClick={() => navigate(-1)}>취소</button>
                        <button className={styles.signinbutton}>완료</button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Signin;
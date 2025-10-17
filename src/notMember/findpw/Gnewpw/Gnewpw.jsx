import { useNavigate } from "react-router-dom";
import styles from "./Gnewpw.module.css";
import useGewpw from "./useGewpw";

function Gnewpw() {

    const navigate = useNavigate();

    const {
        pw, hendleChangeByPw, clickByComplete
    } = useGewpw();

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
            <div className={styles.newpwcontainer}>
                <div className={styles.newpwin}>

                    <div className={styles.newpwhigh}>
                        <h1>비밀번호 재설정</h1>
                        <span>비밀번호를 변경해주세요</span>
                    </div>

                    <div className={styles.newpw}>
                        <label htmlFor="newpw">새 비밀번호</label>
                        <input id="newpw" type="password" placeholder="비밀번호" value={pw} onChange={hendleChangeByPw}/>
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

export default Gnewpw;
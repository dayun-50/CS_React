import { useNavigate } from "react-router-dom";
import styles from "./Gnewpw.module.css";

function Gnewpw (){

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
            <div className={styles.newpwcontainer}>
                <div className={styles.newpwin}>

                    <div className={styles.newpwhigh}>
                        <h1>비밀번호 재설정</h1>
                        <span>비밀번호를 변경해주세요</span>
                    </div>

                    <div className={styles.newpw}>
                        <label htmlFor="newpw">새 비밀번호</label>
                        <input id="newpw" type="text" placeholder="비밀번호"/>
                    </div>

                    <div className={styles.pwcheckbuttons}>
                        <button className={styles.backbt} onClick={() => navigate(-1)}>취소</button>
                        <button className={styles.okbt}>완료</button>
                    </div>
                                        
                </div>
            </div>
        </div>
    );
};

export default Gnewpw;
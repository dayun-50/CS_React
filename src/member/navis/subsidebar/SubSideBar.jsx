import styles from "./SubSideBar.module.css"
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

function SubSideBar({ data }) {
      // 구조분해할당으로 꺼내기
  const { btns, navigateFunc, text, selectedBtn } = data;

    const navigate= useNavigate();
    const handleToPath = (path)=>{
        navigate(path);
    }


    return (
        <div className={styles.submenuWrapper}>
            <button className={styles.btn} onClick={navigateFunc}>{text}</button>
            
            
            <div className={styles.tabWrapper}>
                {btns.map((btn) =>

                        <div key={btn.name} className={`${styles.tab} ${selectedBtn ===  btn.name ? styles.active : ""}`} onClick={() => handleToPath(btn.path)}>
                            {btn.name}
                        </div>
                        
            
                )}
            </div>
        </div>
    )
}

export default SubSideBar;
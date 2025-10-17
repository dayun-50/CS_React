import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styles from './MemberIndex.module.css';
import { useState } from 'react';
import Topbar from './navis/topbar/Topbar';
import Sidebar from './navis/sidebar/Sidebar';
import WorkHourIndex from './workhour/WorkHourIndex';
import ApprovalIndex from './approval/ApprovalIndex';
import Mypage from './mypage/Mypage';
import MyInform from './mypage/Components/myInform/MyInform'
import MySchedule from './mypage/Components/mySchedule/MySchedule'
function MemberIndex (){

    //사이드바 열림 여부 상태변수
    const [sidebarOpen, setSidebarOpen] = useState(false);


    return(
        <div className={styles.container}>

      {/* 상단바 고정*/}
      <div className={styles.header}>
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

        {/* 상단바 제외 영역 */}
        <div className={styles.body}>

            {/* 메인네비바 영역 :좌측 */}
            <nav className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
                <Sidebar />
            </nav>
        
            {/* 바디영역 :우측*/}
            {/*가장 첫번째 뜨는 화면이 근태관리로 해서 /랑 매핑해놓음*/}
            <div className={styles.content}>
                <Routes>
                    <Route path='/' element={<WorkHourIndex />} />
                    <Route path='/approval/*' element={<ApprovalIndex />} />
                    <Route path='/mypage' element={<Mypage />} />
                    <Route path='/myinform' element={<MyInform />} />
                    <Route path='/myschedule' element={<MySchedule />} />
                </Routes>
            </div>

        {/* 오버레이 - 불투명 설정 */}
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      </div>



        </div>
    )
}

export default MemberIndex;
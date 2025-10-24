import styles from "./MemberIndex.module.css";
import { useEffect, useState } from "react";
import Topbar from "./navis/topbar/Topbar";
import Sidebar from "./navis/sidebar/Sidebar";
import Board from "./board/Board";
import Mail from "./mail/Mail";
import MailWrite from "./mail/Components/mailWrite/MailWrite";
import BoardDetail from "./board/Components/boardDetail/BoardDetail";
import { Route, Routes } from "react-router-dom";
import WorkHourIndex from "./workhour/WorkHourIndex";
import ApprovalIndex from "./approval/ApprovalIndex";
import Mypage from "./mypage/Mypage";
import Contact from "./contact/Contact";
import ContactList from "./contact/Components/contactList/ContactList";
import TeamContact from "./contact/Components/contactList/TeamContact";
import Individual from "./contact/Components/contactList/Individual";
import Channellndex from "./channel/ChannelIndex"; // 여기도 이름 오타 확인
import MessagesIndex from "./channel/channelType/messages/MessagesIndex";
import Schedule from "./channel/channelType/schedule/Schedule";


function MemberIndex() {
  //사이드바 열림 여부 상태변수
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
            {/* 지원 --건들 ㄴㄴ */}
            <Route path='/' element={<WorkHourIndex />} />
            <Route path='/approval/*' element={<ApprovalIndex />} />


            {/* 채널 중첩 라우트 -- 혜빈승진*/}
            <Route path="/channel/*" element={<Channellndex />}>
              <Route index element={<MessagesIndex />} /> {/* 메신저 */}
              <Route path="schedule" element={<Schedule />} />  {/* 먼슬리*/}
            </Route>

            {/* 보드 라우트 --영서 */}
            <Route path="/board" element={<Board />} /> {/* 공지사항 */}
            <Route path="/board/detail/:id" element={<BoardDetail />} /> {/* 공지사항 디테일 */}
            <Route path="/approval/*" element={<ApprovalIndex />} /> {/* 전자결재 */}

            {/* 메일 라우트 -- 휘경 승진*/}
            <Route path="/mail/*" element={<Mail />} /> {/* 메일 */}

            
            {/* 주소록 중첩 라우트 -- 영서*/}
            <Route path="/contact" element={<Contact />}> {/* 주소록 */}
              <Route index element={<ContactList />} /> {/* 주소록 리스트 */}
              <Route path="individual" element={<Individual />} /> {/* 개인용 */}
              <Route path="teamContact" element={<TeamContact />} /> {/* 팀용 */}
            </Route>

            {/* 마이페이지 라우트 -- 혜빈 승진 */}
            <Route path='/mypage' element={<Mypage />} />
          </Routes>
            
            
        </div>


        {/* 오버레이 - 불투명 설정 */}
        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default MemberIndex;

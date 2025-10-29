import { useEffect, useState } from "react";
import styles from "./VacationList.module.css";
import file from "./icon/Filing.svg"; // 리스트 없음 아이콘
import { caxios } from "../../../../config/config";
import PageNaviBar from "../../../navis/pagenavibar/PageNaviBar";
import dayjs from "dayjs";
import VacationDetail from "../vacationDetail/VacationDetail";
import VacationRequest from "../vacationRequest/VacationRequest";

function VacationList() {
  //1. 페이지 네비를 통해 데이터 가져오기
  const [datas, setDatas] = useState([]);
  // useEffect(() => {
  //     setDatas([]);
  // }, []);

  //버튼 클릭 상태변수들
  const [clickedWriteBtn, setClickedWriteBtn] = useState(false); //작성하기 버튼
  const [clickedDetailBtn, setClickedDetailBtn] = useState(false); //디테일 페이지로 가기

  //3. 리스트뽑은 객체 배열중, 선택받은 객체만 디테일 페이지로 이동
  // 상태변수 참, datas props로 넘겨주기
  const [selectedData, setSelectedData] = useState(null);
  const handleToDetail = (seq) => {
    const target = datas.find((item) => item.pto_seq === seq);
    if (!target) return;
    setSelectedData(target);
    setClickedDetailBtn(true);
  };

  //4. html 태그 제거 함수
  const extractTextOnly = (html) => {
    const withoutTags = html.replace(/<[^>]*>/g, ""); // 태그 제거
    const withoutEntities = withoutTags.replace(/&nbsp;/g, " "); // &nbsp; 제거
    return withoutEntities.trim(); // 앞뒤 공백 제거
  };

  //5. 작성페이지로 이동
  //상태변수 넘겨주기
  const handleToWrite = () => setClickedWriteBtn(true);

  //디테일 페이지로 이동
  if (clickedDetailBtn && !clickedWriteBtn) {
    return (
      <VacationDetail
        selectedData={selectedData}
        setClickedDetailBtn={setClickedDetailBtn}
        setSelectedData={setSelectedData}
      />
    );
  }

  // 신청하기 페이지
  if (clickedWriteBtn) {
    return <VacationRequest setClickedWriteBtn={setClickedWriteBtn} />;
  }

  return (
    <div className={styles.container}>
      {/* 상단 제목 및 버튼 */}
      <div className={styles.listFirst}>
        <div className={styles.listFirstLeft}>연차</div>
        <div className={styles.listFirstRight}>
          <button onClick={handleToWrite}>신청</button>
        </div>
      </div>

      {/* 테이블 헤더 */}
      <div className={styles.listSecond}>
        <div className={styles.number}>번호</div>
        <div className={styles.title}>사유</div>
        <div className={styles.date}>일정</div>
        <div className={styles.check}>상태</div>
      </div>

      {/* 내용 */}
      {datas.length === 0 ? (
        <div className={styles.noticeEmptyContainer}>
          <img src={file} className={styles.noticeEmptyIcon} alt="File" />
          <div className={styles.noticeEmptyText}>연차신청 기록이 없습니다</div>
        </div>
      ) : (
        <div className={styles.listThird}>
          {datas.map((data) => {
            const className =
              {
                대기: styles.inProgress,
                완료: styles.approved,
              }[data.pto_status] || styles.denied;

            return (
              <div key={data.pto_seq} className={styles.listRow}>
                <div>{data.pto_seq}</div>
                <div
                  className={styles.hoverPointer}
                  onClick={() => handleToDetail(data.pto_seq)}
                >
                  {extractTextOnly(data.pto_content)}
                </div>
                <div>
                  {dayjs(data.pto_start_at).format("YY.MM.DD")} ~{" "}
                  {dayjs(data.pto_end_at).format("YY.MM.DD")}
                </div>
                <div className={className}>{data.pto_status}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      <div className={styles.listFourth}>
        <PageNaviBar key="ptorequest" path={`/ptorequest`} onData={setDatas} />
      </div>
    </div>
  );
}

export default VacationList;

import { useNavigate } from "react-router-dom";
import styles from "./BoardList.module.css";
import { useEffect, useState } from "react";
import file from "./icon/File.svg";
import dayjs from "dayjs";
import PageNaviBar from "../../../navis/pagenavibar/PageNaviBar";
import { caxios } from "../../../../config/config";

const BoardList = () => {
  const [noticeList, setNoticeList] = useState([]); // 페이지별 공지사항
  const navigate = useNavigate();
  const target = null; // 필요 시 필터용

  useEffect(() => {
    caxios.get('/board/notices')
      .then(resp => {
        setNoticeList(resp.data);
      })
      .catch(err => {
        console.log(err);
      });
  },[noticeList])

  const handleTitleClick = (id) => {
    navigate(`/board/detail/${id}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>공지사항</header>

      {/* 리스트 헤더 */}
      <section className={styles.listBody}>
        <div className={styles.listHeader}>
          <div className={styles.numbertitle}>번호</div>
          <div className={styles.Toptitle}>제목</div>
          <div className={styles.datetitle}>작성일</div>
          <div className={styles.viewstitle}>조회수</div>
        </div>

        {/* 리스트 데이터 */}
        {noticeList.length > 0 ? (
          noticeList.map((item) => (
            <div className={styles.listItem} key={item.notice_seq}>
              <div className={styles.number}>{item.notice_seq ?? "-"}</div>
              <div
                className={styles.title}
                onClick={() => handleTitleClick(item.notice_seq)}
              >
                {item.title}
              </div>
              <div className={styles.date}>
                {item.created_at
                  ? dayjs(item.created_at).format("YYYY-MM-DD")
                  : "-"}
              </div>
              <div className={styles.views}>{item.view_count}회</div>
            </div>
          ))
        ) : (
          <div className={styles.noticeEmptyContainer}>
            <img src={file} className={styles.noticeEmptyIcon} alt="File" />
            <div className={styles.noticeEmptyText}>공지사항이 없습니다</div>
          </div>
        )}
      </section>

      {/* 페이지네비게이션 */}
      <div className={styles.paginationParent}>
        <PageNaviBar
          key={target || "all"}
          path={target ? `/board/notices?type=${target}` : `/board/notices`}
          onData={(data) => {
            // PageNaviBar에서 받아온 데이터를 날짜 포맷 적용 후 세팅
            const formatted = data.map((item) => ({
              ...item,
              created_at: item.created_at
                ? dayjs(item.created_at).format("YYYY-MM-DD")
                : null,
            }));
            setNoticeList(formatted);
          }}
        />
      </div>
    </div>
  );
};

export default BoardList;

import { useNavigate } from "react-router-dom";
import styles from "./BoardList.module.css";
import { caxios } from "../../../../config/config";
import { useEffect, useState } from "react";
import file from "./icon/File.svg"; // 공지사항 리스트 목록 없음 아이콘

const BoardList = () => {
  const [noticeList, setNoticeList] = useState([]); // 목록
  const navigate = useNavigate();

  // 전체 공지사항 불러오기 (페이징 없이)
  const fetchNotices = () => {
    caxios
      .get(`/board/notices`) // 전체 공지사항 반환하는 API라고 가정
      .then((res) => {
        setNoticeList(res.data);
      })
      .catch((err) => console.error("공지사항 불러오기 실패", err));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

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
        {noticeList?.length > 0 ? (
          noticeList.map((item) => (
            <div className={styles.listItem} key={item.notice_seq}>
              <div className={styles.number}>{item.notice_seq}</div>
              <div
                className={styles.title}
                onClick={() => handleTitleClick(item.notice_seq)}
              >
                {item.title}
              </div>
              <div className={styles.date}>{item.created_at?.slice(0, 10)}</div>
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

      {/* 
      페이징 네비게이션 
      <nav className={styles.paginationParent}>
        << 
        <img
          src={doubleLeftArrow}
          alt="처음"
          onClick={() => handlePageClick(1)}
          className={currentPage === 1 ? styles.disabled : ""}
        />
        < 
        <img
          src={leftArrow}
          alt="이전"
          onClick={() =>
            handlePageClick(Math.max(1, pageRange[0] - 1))
          }
          className={pageRange[0] === 1 ? styles.disabled : ""}
        />
        페이지 리스트 
        <div className={styles.pagination}>
          <div className={styles.paginationList}>
            {pageRange.map((page) => (
              <div
                key={page}
                className={
                  page === currentPage
                    ? styles.paginationPageActive
                    : styles.paginationPage
                }
                onClick={() => handlePageClick(page)}
              >
                <div className={styles.pageNumber}>{page}</div>
              </div>
            ))}
          </div>
        </div>
        >
        <img
          src={rightArrow}
          alt="다음"
          onClick={() =>
            handlePageClick(
              Math.min(totalPages, pageRange[pageRange.length - 1] + 1)
            )
          }
          className={
            pageRange[pageRange.length - 1] === totalPages
              ? styles.disabled
              : ""
          }
        />
        >> 
        <img
          src={doubleRightArrow}
          alt="끝"
          onClick={() => handlePageClick(totalPages)}
          className={currentPage === totalPages ? styles.disabled : ""}
        />
      </nav>
      */}

    </div>
  );
};

export default BoardList;

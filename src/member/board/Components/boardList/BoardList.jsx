import { useNavigate } from "react-router-dom";
import styles from "./BoardList.module.css";
import { caxios } from "../../../../config/config";
import { useEffect, useState } from "react";
import file from "./icon/File.svg"; // 공지사항 리스트 목록 없음 아이콘
import  doubleLeftArrow from "./icon/doubleLeftArrow.svg"; // << 아이콘
import leftArrow from "./icon/leftArrow.svg"; // < 아이콘
import rightArrow from "./icon/rightArrow.svg"; // > 아이콘
import doubleRightArrow from "./icon/doubleRightArrow.svg"; // >> 아이콘

const BoardList = () => {
  const [noticeList, setNoticeList] = useState([]); // 목록
  const [currentPage, setCurrentPage] = useState(1); // 내가 있는 위치
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [pageRange, setPageRange] = useState([]); // 보여줄 페이지 번호 목록

  const navigate = useNavigate();

  // 페이지 데이터 불러오기
  const fetchNotices = (page) => {
    caxios
      .get(`/board/notices?page=${page}`)
      .then((res) => {
        setNoticeList(res.data.notices); // 공지 데이터 배열
        setTotalPages(res.data.total_pages); // 총 페이지 수
        setCurrentPage(page); // 첫페이지 1번
      })
      .catch((err) => console.error("공지사항 불러오기 실패", err));
  };

  useEffect(() => {
    fetchNotices(currentPage);
  }, []);

  // 페이지 버튼 생성 로직 (5개씩)
  useEffect(() => {
    const maxButtons = 5; // 페이지 버튼 개수
    const group = Math.floor((currentPage - 1) / maxButtons); // 현재 그룹 인덱스
    const start = group * maxButtons + 1;
    const end = Math.min(start + maxButtons - 1, totalPages);

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    setPageRange(range);
  }, [currentPage, totalPages]);

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      fetchNotices(page);
    }
  };

  const handleTitleClick = (id) => {
    navigate(`/member/board/detail/${id}`);
  };


  // ---------------------------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      <header className={styles.header}>공지사항</header>

      <section className={styles.listBody}>
        <div className={styles.listHeader}>
          <div className={styles.numbertitle}>번호</div>
          <div className={styles.Toptitle}>제목</div>
          <div className={styles.datetitle}>작성일</div>
          <div className={styles.viewstitle}>조회수</div>
        </div>

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

      {/* 페이징 네비게이션 */}
      <nav className={styles.paginationParent}>
        {/* << */}
        <img
          src={doubleLeftArrow}
          alt="처음"
          onClick={() => handlePageClick(1)}
          className={currentPage === 1 ? styles.disabled : ""}
        />

        {/* < */}
        <img
          src={leftArrow}
          alt="이전"
          onClick={() => handlePageClick(Math.max(1, pageRange[0] - 1))}
          className={pageRange[0] === 1 ? styles.disabled : ""}
        />

        {/* 페이지 리스트 */}
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

        {/* > */}
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

        {/* >> */}
        <img
          src={doubleRightArrow}
          alt="끝"
          onClick={() => handlePageClick(totalPages)}
          className={currentPage === totalPages ? styles.disabled : ""}
        />
      </nav>
    </div>
  );
};

export default BoardList;

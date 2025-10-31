import { useNavigate } from "react-router-dom";
import styles from "./BoardList.module.css";
import { useEffect, useState } from "react";
import file from "./icon/File.svg";
import dayjs from "dayjs";
import { caxios } from "../../../../config/config";

// 아이콘 import
import doubleLeftArrow from "./icon/doubleLeftArrow.svg";
import leftArrow from "./icon/leftArrow.svg";
import rightArrow from "./icon/rightArrow.svg";
import doubleRightArrow from "./icon/doubleRightArrow.svg";

const BoardList = () => {
  const [allNotices, setAllNotices] = useState([]); // 전체 공지사항
  const [noticeList, setNoticeList] = useState([]); // 현재 페이지 공지사항
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const PAGE_SIZE = 10; // 한 페이지에 10개

  const target = null; // 필요 시 필터용

  const totalPages = Math.ceil(allNotices.length / PAGE_SIZE);

  // 전체 공지사항 가져오기
  const fetchNotices = () => {
    const url = target ? `/board/notices?type=${target}` : `/board/notices`;

    caxios
      .get(url)
      .then((resp) => {
        const data = resp.data.items || resp.data;
        setAllNotices(data); // 전체 데이터만 저장
      })
      .catch((err) => console.log(err));
  };

  // currentPage나 allNotices가 바뀔 때 noticeList 갱신
  useEffect(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setNoticeList(allNotices.slice(start, end));
  }, [currentPage, allNotices]);

  // 컴포넌트 마운트 시 전체 공지 가져오기
  useEffect(() => {
    fetchNotices();
  }, []);

  const handleTitleClick = (id) => {
    navigate(`/board/detail/${id}`);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

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

      <div className={styles.paginationParent}>
        <button
          className={styles.paginationButton}
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          <img src={doubleLeftArrow} alt="First Page" />
        </button>

        <button
          className={styles.paginationButton}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <img src={leftArrow} alt="Prev Page" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={
              i + 1 === currentPage
                ? styles.paginationPageActive
                : styles.paginationButton
            }
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className={styles.paginationButton}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <img src={rightArrow} alt="Next Page" />
        </button>

        <button
          className={styles.paginationButton}
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          <img src={doubleRightArrow} alt="Last Page" />
        </button>
      </div>
    </div>
  );
};

export default BoardList;

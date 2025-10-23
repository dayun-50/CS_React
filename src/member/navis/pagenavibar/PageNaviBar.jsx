import styles from "./PageNaviBar.module.css"
import  doubleLeftArrow from "./icon/doubleLeftArrow.svg"; // << 아이콘
import leftArrow from "./icon/leftArrow.svg"; // < 아이콘
import rightArrow from "./icon/rightArrow.svg"; // > 아이콘
import doubleRightArrow from "./icon/doubleRightArrow.svg"; // >> 아이콘
import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";




function PageNaviBar({ path, onData }) {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageRange, setPageRange] = useState([]);


  // 1. 현재 페이지가 바뀌거나, 버튼을 눌러서 경로가 바뀐다면 다시 데이터 가져오도록
  useEffect(() => {
    console.log("path:", path);
    fetchDatas(currentPage);
  }, [currentPage, path]);

  const fetchDatas = (page) => {
    const connector = path.includes("?") ? "&" : "?"; // 쿼리파라미터 쓰는 사람들이 사용할 로직 쿼리파라미터 방식아녀도 작동 잘합니다 
    const fullPath = `${path}${connector}page=${page}`;

    caxios
      .get(fullPath)
      .then((resp) => {
        console.log(resp.data);
        setTotalPages(resp.data.totalPages); // 토탈 페이지 변경
        setCurrentPage(resp.data.currentPage);//현제 페이지 변경

        if (onData) {
          onData(resp.data.list || []); // list받아오면 list 없으면 빈배열
        }
      })

      .catch((err) => {
        console.error(err);
        if (onData) onData([]); // 요청 실패 시에도 빈 배열 전달
  });
  };

  //2. 버튼과 현재 페이지 조절용
  useEffect(() => {
    const maxButtons = 5;
    const group = Math.floor((currentPage - 1) / maxButtons);
    const start = group * maxButtons + 1;
    const end = Math.min(start + maxButtons - 1, totalPages);

    const range = [];
    for (let i = start; i <= end; i++) range.push(i);
    setPageRange(range);
  }, [currentPage, totalPages]);

  const handlePageClick = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  return (
    <div className={styles.pageNaviContainer}>
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
}

export default PageNaviBar;

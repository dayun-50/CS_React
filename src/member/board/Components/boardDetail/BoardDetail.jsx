import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./BoardDetail.module.css";
import { caxios } from "../../../../config/config";

const BoardDetail = () => {
  const { id } = useParams(); // id === notice_seq
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null); // 공지사항 내용 데이터

  useEffect(() => {
    if (!id) return; // id 확인용

    caxios
      .get(`/board/detail/${id}`)
      .then((res) => {
        setNotice(res.data);
      })
      .catch((err) => {
        console.error("게시글 불러오기 실패:", err);
      });
  }, [id]);

  if (!notice) return <div className={styles.loading}>불러오는 중...</div>; // null 값일 경우

  return (
    <div className={styles.container}>
      <div className={styles.noticeBox}>
        {/* 제목 */}
        <h2 className={styles.title}>{notice.title}</h2>

        <div className={styles.meta}>
          <span>{notice.created_at?.slice(0, 10)}</span>
          {/* "2025-10-16T08:15:30.000Z".slice(0, 10) 결과: "2025-10-16" => 앞에서부터 10글자만 잘라서 보여줘라는 의미 */}
          <span className={styles.viewCount}>
            조회수 : {notice.view_count}회
          </span>
        </div>

        {/* 내용 */}
        <div className={styles.content}>
          {notice.content?.split("\n").map((line, i) => (
            // 안녕하세요\n공지사항입니다\n오늘부터 적용됩니다 - split("\n") 이렇게 적용됨
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* 뒤로가기 버튼 */}
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        뒤로가기
      </button>
    </div>
  );
};

export default BoardDetail;

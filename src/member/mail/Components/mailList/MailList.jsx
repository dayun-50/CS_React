import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MailList.module.css";
import Search from "./icon/Search.svg";
import basket from "./icon/basket.svg";
import CollapseArrow from "./icon/CollapseArrow.svg";
import PageNaviBar from "../../../navis/pagenavibar/PageNaviBar";

// 한글 초성 배열
const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

function getInitials(str) {
  return str
    .split("")
    .map(ch => {
      const code = ch.charCodeAt(0) - 44032;
      if (code >= 0 && code <= 11171) {
        return CHO[Math.floor(code / 588)];
      }
      return ch;
    })
    .join("");
}

const MailList = ({ tabName = "전체", data = { mails: [] } }) => {
  const navigate = useNavigate();

  // ---------------- 상태 변수 ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const [headerSelected, setHeaderSelected] = useState(false);
  const [selectedMails, setSelectedMails] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortButtonText, setSortButtonText] = useState("정렬");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // 화면 너비 감지

  const sortOptions = ["날짜 순", "제목 순"];
  const mailsPerPage = 10;

  // ---------------- 화면 크기 감지 ----------------
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------- 더미 메일 데이터 ----------------
  const dummyMailsInitial = [
    { id: 1, email: "RLA15@gmail.com", title: "보낸 사람이 작성한 Title 나오는곳", date: "2025-10-25" },
    { id: 2, email: "testtest1@example.com", title: "베이베 내게 반해 버린 내게 왜이래", date: "2025-10-26" },
    { id: 3, email: "test2@example.com", title: "링딩동 링딩동 링디리링 디디 딩딩딩", date: "2025-10-22" },
    { id: 4, email: "test3@example.com", title: "ㄴ집에 가지마 베이베 너에게 줄 숙제가 여깄는데", date: "2025-10-07" },
    { id: 5, email: "test3@example.com", title: "베이베~ 이제는 내게와 and be my lady", date: "2025-10-03" },
    { id: 6, email: "test3@example.com", title: "갈비찜을 밥위 얹어주세용~ 내가 제일 좋아하는 갈비찜 덮밥", date: "2025-10-01" },
    { id: 7, email: "test3@example.com", title: "베이베 베이베 베이베 그대가 내 안에", date: "2025-10-13" },
    { id: 8, email: "test3@example.com", title: "베이베 베이베 베이베 oh~~", date: "2025-10-18" },
    { id: 9, email: "test3@example.com", title: "나는 운이 좋았지 내 삶에서 나보다 더 사랑한 사람이 있었으니", date: "2025-10-28" },
    { id: 10, email: "test3@example.com", title: "내게 반해 버린 내게 왜이래~", date: "2025-10-17" },
    { id: 11, email: "test3@example.com", title: "니가 바람 펴도 너는 절대 피지마 베이베~", date: "2025-10-13" },
    { id: 12, email: "test3@example.com", title: "이러다 미쳐 내가 여리여리 착하던 그런 내가", date: "2025-10-13" },
    { id: 13, email: "test3@example.com", title: "미스터 chu~♥ 입술위에 chu~♥ 달콤하게 chu~♥ 널보면 난 눈이 떨려", date: "2025-10-13" },
    { id: 14, email: "test3@example.com", title: "마돈나 돈나 돈나 마돈나 돈나 돈나 ", date: "2025-10-13" },
    { id: 15, email: "test3@example.com", title: "Girl Pretty Girl Pretty Girl 그냥 되진 않는 거죠 난!! ", date: "2025-10-13" },
    { id: 16, email: "test3@example.com", title: "Hey 거기 거기 Mr 여길 좀 봐봐 Mr ", date: "2025-10-13" },
  ];

  const [dummyMails, setDummyMails] = useState(dummyMailsInitial);

  let mails = (data.mails && data.mails.length > 0) ? data.mails : dummyMails;

  // ---------------- 검색 필터링 ----------------
  const filteredMails = mails.filter(mail => {
    const titleLower = mail.title.toLowerCase();
    const searchLower = searchText.toLowerCase();
    return titleLower.includes(searchLower) || getInitials(mail.title).includes(searchText);
  });

  // ---------------- 정렬 ----------------
  const sortedMails = [...filteredMails].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortAsc ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "title") {
      return sortAsc ? a.title.localeCompare(b.title, "ko") : b.title.localeCompare(a.title, "ko");
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedMails.length / mailsPerPage);
  const indexOfLastMail = currentPage * mailsPerPage;
  const indexOfFirstMail = indexOfLastMail - mailsPerPage;
  const currentMails = sortedMails.slice(indexOfFirstMail, indexOfLastMail);

  // ---------------- 클릭 이벤트 ----------------
  const handleMailClick = (mail) => navigate("/mail/detail", { state: { mail } });
  const handleHeaderCircleClick = () => {
    if (headerSelected) {
      setHeaderSelected(false);
      setSelectedMails([]);
    } else {
      setHeaderSelected(true);
      setSelectedMails(currentMails.map(mail => mail.id));
    }
  };
  const handleCircleClick = (id, e) => {
    e.stopPropagation();
    setSelectedMails(prev => {
      const newSelected = prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id];
      setHeaderSelected(newSelected.length === currentMails.length);
      return newSelected;
    });
  };
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (selectedMails.length === 0) {
      alert("삭제할 메일을 선택하세요.");
      return;
    }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setDummyMails(prev => prev.filter(mail => !selectedMails.includes(mail.id)));
      setSelectedMails([]);
      setHeaderSelected(false);
    }
  };
  const handleSortClick = () => setShowSortDropdown(prev => !prev);
  const handleSortOptionClick = (option) => {
    setShowSortDropdown(false);
    setSortButtonText(option);
    if (option === "날짜 순") {
      setSortBy("date"); setSortAsc(false);
    } else if (option === "제목 순") {
      setSortBy("title"); setSortAsc(true);
    }
  };

  // ---------------- 렌더링 ----------------
  return (
    <div className={styles.maillistbox}>
      <div className={styles.maillistin}>
        {/* 상단 제목 + 검색 */}
        <div className={styles.maillisttitle}>
          <span className={styles.titleText}>
            {tabName === "전체" ? `${tabName} 메일` : tabName} {filteredMails.length}
          </span>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <img src={Search} className={styles.Searchicon} alt="검색" />
          </div>
        </div>

        {/* 메일 헤더 */}
        <div className={styles.mailitem}>
          <div className={styles.mailleft}>
            <div
              className={styles.mailcircle}
              onClick={handleHeaderCircleClick}
              style={{ backgroundColor: headerSelected ? "#007AFF" : "#ccc" }}
            />
            <span className={styles.mailtext}>목록</span>
            <button className={styles.delebt} onClick={handleDeleteClick}>삭제</button>
          </div>

          <div className={styles.maild} style={{ position: "relative", cursor: "pointer" }}>
            <span onClick={handleSortClick}>
              {sortButtonText}
              <img src={CollapseArrow} className={styles.arrowicon} alt="정렬"/>
            </span>
            {showSortDropdown && (
              <div className={styles.sortDropdown}>
                {sortOptions.map(option => (
                  <div
                    key={option}
                    className={styles.sortOption}
                    onClick={() => handleSortOptionClick(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 메일 리스트 */}
        <div className={styles.realmaillist}>
          {currentMails.length > 0 ? (
            currentMails.map(mail => (
              <div
                key={mail.id}
                className={styles.maillistdown}
                onClick={() => handleMailClick(mail)}
              >
                <div className={styles.leftGroup}>
                  <div
                    className={styles.mailcirclelist}
                    onClick={(e) => handleCircleClick(mail.id, e)}
                    style={{ backgroundColor: selectedMails.includes(mail.id) ? "#007AFF" : "#ccc" }}
                  />
                  <span className={styles.email}>{mail.email}</span>
                  {/* 제목은 화면이 작으면 렌더링 안함 */}
                  {windowWidth > 1024 && (
                    <span className={styles.listt}>{mail.title}</span>
                  )}
                </div>
                <span className={styles.day}>{mail.date}</span>
              </div>
            ))
          ) : (
            <div className={styles.mailh}>
              <div className={styles.mmh}>
                <img src={basket} alt="empty"/>
                <p>메일함이 비어있습니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* 페이지네비게이션 */}
        {filteredMails.length > mailsPerPage && (
          <div className={styles.pagination}>
            <PageNaviBar
              key={tabName || "all"}
              path={tabName ? `/approval?type=${tabName}` : `/approval`}
              onData={(newMails) => {
                if (!newMails || newMails.length === 0) {
                  setDummyMails(dummyMailsInitial);
                } else {
                  setDummyMails(newMails);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MailList;

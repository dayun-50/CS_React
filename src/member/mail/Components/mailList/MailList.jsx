import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MailList.module.css";
import Search from "./icon/Search.svg";
import basket from "./icon/basket.svg";
import CollapseArrow from "./icon/CollapseArrow.svg";
import PageNaviBar from "../../../navis/pagenavibar/PageNaviBar";
import { mailRequest } from "../../../../config/config";

// 한글 초성 배열
const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

function getInitials(str) {
  return str
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0) - 44032;
      if (code >= 0 && code <= 11171) {
        return CHO[Math.floor(code / 588)];
      }
      return ch;
    })
    .join("");
}

const MailList = ({ tabName = "전체" }) => {
  const navigate = useNavigate();

  // ---------------- 상태 변수 ----------------
  const [mailList, setMailList] = useState([]); // 실제 API 데이터 목록
  const [isLoading, setIsLoading] = useState(true); //  로딩 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [headerSelected, setHeaderSelected] = useState(false);
  const [selectedMails, setSelectedMails] = useState([]); //uid 저장
  const [sortBy, setSortBy] = useState("date"); //  date -> receivedDate
  const [sortAsc, setSortAsc] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortButtonText, setSortButtonText] = useState("정렬");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // 화면 너비 감지

  const sortOptions = ["날짜 순", "제목 순"];
  const mailsPerPage = 10;

  // ---------------- 화면 크기 감지 (고객님 요청에 따라 유지) ----------------
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------- API 호출 및 데이터 로드 ----------------

  useEffect(() => {
    const loadMails = async () => {
      setIsLoading(true);

      try {
        //  API 호출: INBOX, Sent 구분하여 호출
        let folderToFetch = "INBOX";
        if (tabName === "보낸 편지함") folderToFetch = "Sent";
        //  mailRequest 헬퍼 함수를 사용하여 JWT 인증을 통과하며 데이터 요청

        const response = await mailRequest(
          "get",
          `/emails/list?folder=${folderToFetch}`
        );
        if (response.data.status === "SUCCESS" && response.data.emails) {
          //  [핵심] folder.getMessages()의 결과(EmailDTO 목록)를 상태에 저장
          setMailList(response.data.emails);
        } else {
          setMailList([]);
        }
      } catch (error) {
        console.error(
          "메일 목록 조회 중 오류 발생:",
          error.response?.data?.error || error.message
        );
        alert("세션 만료 또는 서버 연결 오류로 목록을 불러올 수 없습니다.");
        setMailList([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMails();
  }, [tabName]); // tabName이 변경될 때마다 전체 로직 재실행

  // ---------------- 데이터 가공 (API 데이터 사용) ----------------

  let mails = mailList;

  // ---------------- 검색 필터링 ----------------
  const filteredMails = mails.filter((mail) => {
    const subjectLower = mail.subject ? mail.subject.toLowerCase() : ""; // subject 사용
    const senderLower = mail.sender ? mail.sender.toLowerCase() : ""; // sender 추가
    const searchLower = searchText.toLowerCase();
    return (
      subjectLower.includes(searchLower) ||
      senderLower.includes(searchLower) || // sender 검색 추가
      getInitials(subjectLower).includes(searchText) // subject 초성 검색
    );
  });

  // ---------------- 정렬 ----------------
  const sortedMails = [...filteredMails].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.receivedDate || a.sentDate);
      const dateB = new Date(b.receivedDate || b.sentDate);
      return sortAsc ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "title") {
      return sortAsc
        ? a.subject.localeCompare(b.subject, "ko") // subject 사용
        : b.subject.localeCompare(a.subject, "ko"); // subject 사용
    }
    return 0;
  });

  // 페이지 네이션 적용

  const totalPages = Math.ceil(sortedMails.length / mailsPerPage);
  const indexOfLastMail = currentPage * mailsPerPage;
  const indexOfFirstMail = indexOfLastMail - mailsPerPage;
  const currentMails = sortedMails.slice(indexOfFirstMail, indexOfLastMail);

  // ---------------- 클릭 이벤트 ----------------
  //  상세 페이지 이동 시 mail.uid 로 수정
  const handleMailClick = (mail) => {
    // 상세 페이지에서는 실제 폴더 이름을 전달해야 정확한 메일을 로드할 수 있음
    let folderName = "";
    if (
      tabName === "보낸 편지함" ||
      (tabName === "전체 메일함" && mail.folder === "Sent")
    ) {
      folderName = "Sent";
    } else {
      folderName = "INBOX";
    }
    // mail.folder 필드가 EmailDTO에 있다고 가정하고 로직 작성
    if (mail.folder) folderName = mail.folder;

    navigate(`/mail/detail/${mail.uid}?folder=${folderName}`);
  };
  const handleHeaderCircleClick = () => {
    if (headerSelected) {
      setHeaderSelected(false);
      setSelectedMails([]);
    } else {
      setHeaderSelected(true);
      setSelectedMails(currentMails.map((mail) => mail.uid));
    }
  };
  const handleCircleClick = (uid, e) => {
    e.stopPropagation();
    setSelectedMails((prev) => {
      const newSelected = prev.includes(uid)
        ? prev.filter((i) => i !== uid)
        : [...prev, uid];
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
      //  임시: setMailList로 상태 업데이트 (실제로는 API 호출 후 fetchMailList 재호출)
      setMailList((prev) =>
        prev.filter((mail) => !selectedMails.includes(mail.uid))
      );
      setSelectedMails([]);
      setHeaderSelected(false);
    }
  };
  const handleSortClick = () => setShowSortDropdown((prev) => !prev);
  const handleSortOptionClick = (option) => {
    setShowSortDropdown(false);
    setSortButtonText(option);
    if (option === "날짜 순") {
      setSortBy("date");
      setSortAsc(false);
    } else if (option === "제목 순") {
      setSortBy("title");
      setSortAsc(true);
    }
  };

  // ---------------- 렌더링 ----------------
  return (
    <div className={styles.maillistbox}>
      <div className={styles.maillistin}>
        {/* 상단 제목 + 검색 */}
        <div className={styles.maillisttitle}>
          <span className={styles.titleText}>
            {tabName === "전체" ? `${tabName} 메일` : tabName}{" "}
            {filteredMails.length}
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
              style={{ backgroundColor: headerSelected ? "#0090FF" : "#ccc" }}
            />
            <span className={styles.mailtext}>목록</span>
            <button className={styles.delebt} onClick={handleDeleteClick}>
              삭제
            </button>
          </div>

          <div
            className={styles.maild}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <span onClick={handleSortClick}>
              {sortButtonText}
              <img
                src={CollapseArrow}
                className={styles.arrowicon}
                alt="정렬"
              />
            </span>
            {showSortDropdown && (
              <div className={styles.sortDropdown}>
                {sortOptions.map((option) => (
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
          {isLoading ? ( //  로딩 상태 표시
            <p>메일 목록을 불러오는 중입니다...</p>
          ) : currentMails.length > 0 ? (
            currentMails.map((mail) => (
              <div
                key={mail.uid} //고유키 사용
                className={styles.maillistdown}
                onClick={() => handleMailClick(mail)}
                style={{ fontWeight: mail.isRead === "n" ? "bold" : "normal" }} // 안 읽은 메일 굵게
              >
                <div className={styles.leftGroup}>
                  <div
                    className={styles.mailcirclelist}
                    onClick={(e) => handleCircleClick(mail.uid, e)}
                    style={{
                      backgroundColor: selectedMails.includes(mail.uid)
                        ? "#007AFF"
                        : "#ccc",
                    }}
                  />
                  <span className={styles.sender}>{mail.sender}</span>
                  {/* 제목은 화면이 작으면 렌더링 안함 */}
                  {windowWidth > 1024 && (
                    <span className={styles.listt}>{mail.subject}</span>
                  )}
                </div>
                <span className={styles.day}>
                  {mail.receivedDate
                    ? mail.receivedDate.split(" ")[0]
                    : mail.sentDate
                    ? mail.sentDate.split(" ")[0]
                    : ""}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.mailh}>
              <div className={styles.mmh}>
                <img src={basket} alt="empty" />
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
                  setMailList([]);
                } else {
                  setMailList(newMails);
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

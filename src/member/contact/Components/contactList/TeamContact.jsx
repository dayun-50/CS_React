import { useEffect, useState } from "react";
import styles from "./TeamContact.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import doubleLeftArrow from "./icon/doubleLeftArrow.svg";
import leftArrow from "./icon/leftArrow.svg";
import rightArrow from "./icon/rightArrow.svg";
import useAuthStore from "../../../../store/useAuthStore";

const TeamContact = () => {
  const { id: userEmail, deptCode } = useAuthStore(); // 로그인한 사용자 이메일 가져오기
  const [contacts, setContacts] = useState([]); // 팀용 연락처 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedContact, setSelectedContact] = useState(null); // 상세보기 연락처 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 팀용 연락처 불러오기 (로그인 사용자가 추가한 것만)
  const fetchContacts = () => {
    // [수정] 팀 연락처 조회 API를 백엔드 경로 /contact/team/{owner_email}에 맞춥니다.
    if (!userEmail) {
      console.warn("사용자 이메일을 찾을 수 없습니다.");
      return;
    }

    // 💡 API 경로를 /contact/team/{owner_email}로 변경
    // 백엔드에서 deptCode를 조회하므로 프론트에서 보낼 필요가 없습니다.
    caxios
      .get(`/contact/team/${userEmail}`)
      .then((res) => {
        setContacts(res.data);
      })
      .catch((err) => console.error("팀원용 주소록 로딩 실패:", err));
  };

  useEffect(() => {
    // 의존성 배열에서 deptCode를 제거하고 userEmail만 사용합니다.
    fetchContacts();
  }, [userEmail]);

  // 개인용으로 전환: 서버 업데이트 + UI에서 제거
  const handleIndividual = (contact_seq) => {
    caxios
      .put("/contact/update", {
        share: "n",
        contact_seq,
        owner_email: userEmail,
      })
      .then(() => {
        console.log(`연락처 ${contact_seq}: 개인용으로 설정 성공`);
        // 1) 팀용 목록에서 제거
        setContacts((prev) =>
          prev.filter((contact) => contact.contact_seq !== contact_seq)
        );
        // 2) 상세보기 닫기
        if (selectedContact?.contact_seq === contact_seq) {
          setSelectedContact(null);
        }
      })
      .catch((err) => console.error("개인용 설정 실패:", err));
  };

  // 연락처 수정 후 상태 갱신 (ContactDetail에서 호출)
  const handleUpdated = (updatedContact) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.contact_seq === updatedContact.contact_seq ? updatedContact : c
      )
    );
    setSelectedContact(updatedContact);
  };

  // 연락처 삭제 후 상태 갱신 (ContactDetail에서 호출)
  const handleDeleted = (contact_seq) => {
    setContacts((prev) => prev.filter((c) => c.contact_seq !== contact_seq));
    setSelectedContact(null);
  };

  // 검색어 기반 필터링 (회사 이름 또는 이름)
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.contact_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const currentContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  const goPrev = () => goToPage(currentPage - 1);
  const goNext = () => goToPage(currentPage + 1);

  return (
    <div className={styles.contactList}>
      {selectedContact ? (
        // -------------------------------
        // 상세보기 화면
        // -------------------------------
        <ContactDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ) : (
        <>
          {/* -------------------------------
              상단 영역: 제목 + 검색창
          ------------------------------- */}
          <div className={styles.header}>
            <div className={styles.title}>팀원용</div>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="회사 이름 또는 이름을 입력하세요"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 검색 시 페이지 초기화
                }}
                className={styles.searchInput}
              />
              <IoSearch size={24} color="#8c8c8c" />
            </div>
          </div>

          {/* -------------------------------
              테이블 헤더
          ------------------------------- */}
          <div className={styles.tableHeader}>
            <div className={`${styles.cell} ${styles.number}`}>번호</div>
            <div className={`${styles.cell} ${styles.name}`}>이름</div>
            <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
            <div className={`${styles.cell} ${styles.email}`}>이메일</div>
            <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
            <div className={`${styles.cell} ${styles.group}`}>분류</div>
          </div>

          {/* -------------------------------
              연락처 없을 때 표시
          ------------------------------- */}
          {filteredContacts.length === 0 && (
            <div className={styles.contactEmptyContainer}>
              <img
                src={addressBook}
                className={styles.contactEmptyIcon}
                alt="주소록 없음"
              />
              <div className={styles.contactEmptyText}>주소록이 없습니다</div>
            </div>
          )}

          {/* -------------------------------
              연락처 리스트
          ------------------------------- */}
          {filteredContacts.map((item, index) => (
            <div
              key={item.contact_seq}
              className={styles.tableRow}
              onClick={() => setSelectedContact(item)}
              style={{ cursor: "pointer" }}
            >
              <div className={`${styles.cell} ${styles.number}`}>
                {index + 1}
              </div>
              <div className={`${styles.cell} ${styles.name}`}>{item.name}</div>
              <div className={`${styles.cell} ${styles.company}`}>
                {item.contact_group || "N/A"}
              </div>
              <div className={`${styles.cell} ${styles.email}`}>
                {item.email}
              </div>
              <div className={`${styles.cell} ${styles.phone}`}>
                {item.phone}
              </div>

              {/* -------------------------------
                  버튼 그룹: 개인용 / 팀용
              ------------------------------- */}
              <div className={`${styles.cell} ${styles.group}`}>
                <div className={styles.buttonGroup}>
                  {/* 개인용 버튼 클릭 시 handleIndividual 호출 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // 상세보기 열리는 이벤트 방지
                      handleIndividual(item.contact_seq);
                    }}
                    className={`${styles.button} ${
                      item.share === "n" ? styles.active : styles.inactive
                    }`}
                  >
                    개인용
                  </button>

                  {/* 팀용 버튼: 현재 팀용 목록이므로 비활성화 */}
                  <button
                    type="button"
                    className={`${styles.button} ${
                      item.share === "y" ? styles.active : styles.inactive
                    }`}
                    disabled={item.share === "y"}
                  >
                    팀용
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Pagination (항상 하단 고정) */}
          {totalPages > 1 && (
            <div className={styles.paginationParent}>
              <button
                className={styles.pageArrow}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <img src={doubleLeftArrow} alt="first" />
              </button>
              <button
                className={styles.pageArrow}
                onClick={goPrev}
                disabled={currentPage === 1}
              >
                <img src={leftArrow} alt="prev" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`${styles.pageButton} ${
                    currentPage === i + 1 ? styles.activePage : ""
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className={styles.pageArrow}
                onClick={goNext}
                disabled={currentPage === totalPages}
              >
                <img src={rightArrow} alt="next" />
              </button>
              <button
                className={styles.pageArrow}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <img src={doubleRightArrow} alt="last" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamContact;

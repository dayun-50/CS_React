import { useEffect, useState } from "react";
import styles from "./TeamContact.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import doubleRightArrow from "./icon/doubleRightArrow.svg";
import doubleLeftArrow from "./icon/doubleLeftArrow.svg";
import leftArrow from "./icon/leftArrow.svg";
import rightArrow from "./icon/rightArrow.svg";
import useAuthStore from "../../../../store/useAuthStore";

const TeamContact = () => {
const { isLogin, user } = useAuthStore();
const userEmail = user?.email; // 로그인 시 이메일 추출

  const [contacts, setContacts] = useState([]); // 팀용 연락처 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedContact, setSelectedContact] = useState(null); // 상세보기 연락처 상태

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 팀용 연락처 불러오기
  const fetchContacts = async () => {
    if (!isLogin) return setContacts([]); // 로그인 안되면 빈 배열

    try {
      // 이메일 없이 요청, 백엔드에서 JWT 토큰으로 팀 연락처 확인
      const res = await caxios.get("/contact/team");
      setContacts(res.data || []);
    } catch (err) {
      console.error("팀용 주소록 로딩 실패:", err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [isLogin]);

  // 개인용으로 전환: 서버 업데이트 + UI에서 제거
  const handleIndividual = async (contact_seq) => {
    // UI에서 바로 제거
    setContacts((prev) => prev.filter((c) => c.contact_seq !== contact_seq));
    if (selectedContact?.contact_seq === contact_seq) setSelectedContact(null);

    try {
      await caxios.put("/contact/update", { contact_seq, share: "n" });
      console.log(`연락처 ${contact_seq} 개인용 설정 완료`);
    } catch (err) {
      console.error("개인용 설정 실패:", err);
      // 롤백
      fetchContacts();
    }
  };

  // 연락처 수정 후 상태 갱신
  const handleUpdated = (updatedContact) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.contact_seq === updatedContact.contact_seq ? updatedContact : c
      )
    );
    setSelectedContact(updatedContact);
  };

  // 연락처 삭제 후 상태 갱신
  const handleDeleted = (contact_seq) => {
    setContacts((prev) => prev.filter((c) => c.contact_seq !== contact_seq));
    setSelectedContact(null);
  };

  // 검색 필터
  const filteredContacts = contacts.filter(
    (c) =>
      c.contact_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <ContactDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ) : (
        <>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.title}>팀원용</div>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="회사 이름 또는 이름을 입력하세요"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
              />
              <IoSearch size={24} color="#8c8c8c" />
            </div>
          </div>

          {/* Table Header */}
          <div className={styles.tableHeader}>
            <div className={`${styles.cell} ${styles.number}`}>번호</div>
            <div className={`${styles.cell} ${styles.name}`}>이름</div>
            <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
            <div className={`${styles.cell} ${styles.email}`}>이메일</div>
            <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
            <div className={`${styles.cell} ${styles.group}`}>분류</div>
          </div>

          {/* 연락처 없을 때 */}
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

          {/* 연락처 리스트 */}
          {currentContacts.map((item, index) => (
            <div
              key={item.contact_seq}
              className={styles.tableRow}
              onClick={() => setSelectedContact(item)}
            >
              <div className={`${styles.cell} ${styles.number}`}>
                {(currentPage - 1) * itemsPerPage + index + 1}
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

              <div className={`${styles.cell} ${styles.group}`}>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIndividual(item.contact_seq);
                    }}
                    className={`${styles.button} ${
                      item.share === "n" ? styles.active : styles.inactive
                    }`}
                  >
                    개인용
                  </button>
                  <button
                    type="button"
                    className={`${styles.button} ${
                      item.share === "y"
                        ? item.owner_email === userEmail
                          ? styles.myTeam // 내가 공유한 팀용
                          : styles.team // 팀원이 공유한 팀용
                        : styles.inactive
                    }`}
                    disabled
                  >
                    {item.owner_email === userEmail && item.share === "y"
                      ? "내 팀용"
                      : "팀용"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
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

import { useEffect, useState } from "react";
import styles from "./TeamContact.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import doubleLeftArrow from "./icon/doubleLeftArrow.svg";
import leftArrow from "./icon/leftArrow.svg";
import rightArrow from "./icon/rightArrow.svg";
import doubleRightArrow from "./icon/doubleRightArrow.svg";

const TeamContact = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 팀용 주소록 불러오기
  const fetchContacts = () => {
    caxios
      .get("/contact/list")
      .then((res) => {
        const teamContacts = res.data.filter((item) => item.share === "y");
        setContacts(teamContacts);
      })
      .catch((err) => console.error("팀원용 주소록 로딩 실패:", err));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 개인용으로 전환
  const handleIndividual = (contact_seq) => {
    caxios
      .put(`/contact/update`, { share: "n", contact_seq })
      .then(() => {
        setContacts((prev) =>
          prev.filter((contact) => contact.contact_seq !== contact_seq)
        );
      })
      .catch((err) => console.error("개인용 설정 실패:", err));
  };

  // 검색 필터
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
        <ContactDetail
          contact={selectedContact}
          onClick={() => setSelectedContact(null)}
        />
      ) : (
        <>
          {/* 상단 영역 */}
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

          {/* 리스트 영역 (스크롤 가능) */}
          <div className={styles.listContainer}>
            {/* 리스트 헤더 */}
            <div className={styles.tableHeader}>
              <div className={`${styles.cell} ${styles.number}`}>번호</div>
              <div className={`${styles.cell} ${styles.name}`}>이름</div>
              <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
              <div className={`${styles.cell} ${styles.email}`}>이메일</div>
              <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
              <div className={`${styles.cell} ${styles.group}`}>분류</div>
            </div>

            {/* 데이터 없을 때 */}
            {currentContacts.length === 0 && (
              <div className={styles.noContacts}>
                {searchTerm ? (
                  "검색 결과가 없습니다."
                ) : (
                  <div className={styles.contactEmptyContainer}>
                    <img
                      src={addressBook}
                      className={styles.contactEmptyIcon}
                      alt="File"
                    />
                    <div className={styles.contactEmptyText}>
                      주소록이 없습니다
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 리스트 데이터 */}
            {currentContacts.map((item, index) => (
              <div
                key={item.contact_seq}
                className={styles.tableRow}
                onClick={() => setSelectedContact(item)}
                style={{ cursor: "pointer" }}
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

                {/* 버튼 그룹 */}
                <div className={`${styles.cell} ${styles.group}`}>
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIndividual(item.contact_seq);
                      }}
                      className={`${styles.button} ${styles.inactive}`}
                    >
                      개인용
                    </button>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.active}`}
                      disabled
                    >
                      팀용
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

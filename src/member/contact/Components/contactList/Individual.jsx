import { useEffect, useState } from "react";
import styles from "./Indiviidual.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import doubleLeftArrow from "./icon/doubleLeftArrow.svg"; // << 아이콘
import leftArrow from "./icon/leftArrow.svg"; // < 아이콘
import rightArrow from "./icon/rightArrow.svg"; // > 아이콘
import doubleRightArrow from "./icon/doubleRightArrow.svg"; // >> 아이콘

const Individual = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색용
  const [selectedContact, setSelectedContact] = useState(null); // 디테일 정보
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션
  const itemsPerPage = 10; // 한 페이지에 표시할 연락처 수

  // 초기 데이터 로딩 (개인용만)
  useEffect(() => {
    caxios
      .get("/contact/list")
      .then((res) => {
        setContacts(res.data.filter((item) => item.share === "n"));
      })
      .catch((err) => console.error("개인용 주소록 로딩 실패:", err));
  }, []);

  // share 버튼 클릭 시 상태 업데이트 + 서버 요청
  const updateShare = (contact_seq, newShare) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.contact_seq === contact_seq ? { ...c, share: newShare } : c
      )
    );

    caxios
      .put("/contact/update", { contact_seq, share: newShare })
      .then(() =>
        console.log(`${newShare === "n" ? "개인용" : "팀용"} 설정 성공`)
      )
      .catch((err) => {
        console.error(`${newShare === "n" ? "개인용" : "팀용"} 설정 실패`, err);
        setContacts((prev) =>
          prev.map((c) =>
            c.contact_seq === contact_seq
              ? { ...c, share: newShare === "n" ? "y" : "n" }
              : c
          )
        );
      });
  };

  // 연락처 수정 후 리스트 갱신
  const handleUpdated = (updatedContact) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.contact_seq === updatedContact.contact_seq ? updatedContact : c
      )
    );
    setSelectedContact(updatedContact);
  };

  // 연락처 삭제 후 리스트 갱신
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

  // Pagination 계산
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
          <div className={styles.header}>
            <div className={styles.title}>개인용</div>
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

          <div className={styles.contentWrapper}>
            <div className={styles.tableHeader}>
              <div className={`${styles.cell} ${styles.number}`}>번호</div>
              <div className={`${styles.cell} ${styles.name}`}>이름</div>
              <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
              <div className={`${styles.cell} ${styles.email}`}>이메일</div>
              <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
              <div className={`${styles.cell} ${styles.group}`}>분류</div>
            </div>

            {currentContacts.length === 0 ? (
              <div className={styles.contactEmptyContainer}>
                <img
                  src={addressBook}
                  className={styles.contactEmptyIcon}
                  alt="File"
                />
                <div className={styles.contactEmptyText}>주소록이 없습니다</div>
              </div>
            ) : (
              currentContacts.map((item, index) => (
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
                  <div className={`${styles.cell} ${styles.email}`}>{item.email}</div>
                  <div className={`${styles.cell} ${styles.phone}`}>{item.phone}</div>
                  <div className={`${styles.cell} ${styles.group}`}>
                    <div className={styles.buttonGroup}>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.active}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateShare(item.contact_seq, "n");
                        }}
                      >
                        개인용
                      </button>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.inactive}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateShare(item.contact_seq, "y");
                        }}
                      >
                        팀용
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

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

export default Individual;

import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { IoSearch } from "react-icons/io5";
import { caxios } from "../../../../config/config";
import Individual from "./Individual";
import TeamContact from "./TeamContact";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import  doubleLeftArrow from "./icon/doubleLeftArrow.svg"; // << 아이콘
import leftArrow from "./icon/leftArrow.svg"; // < 아이콘
import rightArrow from "./icon/rightArrow.svg"; // > 아이콘
import doubleRightArrow from "./icon/doubleRightArrow.svg"; // >> 아이콘

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [viewMode, setViewMode] = useState("all"); // 'all', 'individual', 'teamContact'
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedContact, setSelectedContact] = useState(null); // 디테일 페이지용

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 초기 데이터 로딩
  useEffect(() => {
    caxios
      .get("/contact/list")
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("연락처 로딩 실패:", err));
  }, []);

  // '개인용' 설정
  const handleIndividual = (contact_seq) => {
    caxios
      .put(`/contact/update`, { share: "n", contact_seq })
      .then(() =>
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "n" }
              : contact
          )
        )
      )
      .catch((err) => console.error("개인용 설정 실패:", err));
  };

  // '팀용' 설정
  const handleTeamContact = (contact_seq) => {
    caxios
      .put(`/contact/update`, { share: "y", contact_seq })
      .then(() =>
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "y" }
              : contact
          )
        )
      )
      .catch((err) => console.error("팀용 설정 실패:", err));
  };

  // 수정 후 업데이트
  const handleUpdated = (updatedContact) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.contact_seq === updatedContact.contact_seq
          ? updatedContact
          : contact
      )
    );
    setSelectedContact(updatedContact);
  };

  // 삭제 후 업데이트
  const handleDeleted = (deletedContactSeq) => {
    setContacts((prev) =>
      prev.filter((contact) => contact.contact_seq !== deletedContactSeq)
    );
    setSelectedContact(null);
  };

  // 검색 필터링
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.company_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 적용
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

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
          {viewMode === "individual" && <Individual />}
          {viewMode === "teamContact" && <TeamContact />}

          {viewMode === "all" && (
            <>
              <div className={styles.header}>
                <div className={styles.title}>주소록</div>
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

              {/* 리스트 영역: 스크롤 가능 */}
              <div className={styles.listContainer}>
                <div className={styles.tableHeader}>
                  <div className={`${styles.cell} ${styles.number}`}>번호</div>
                  <div className={`${styles.cell} ${styles.name}`}>이름</div>
                  <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
                  <div className={`${styles.cell} ${styles.email}`}>이메일</div>
                  <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
                  <div className={`${styles.cell} ${styles.group}`}>분류</div>
                </div>

                {currentContacts.map((item, index) => (
                  <div
                    className={styles.tableRow}
                    key={item.contact_seq}
                    onClick={() => setSelectedContact(item)}
                  >
                    <div className={`${styles.cell} ${styles.number}`}>
                      {indexOfFirstItem + index + 1}
                    </div>
                    <div className={`${styles.cell} ${styles.name}`}>
                      {item.name}
                    </div>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeamContact(item.contact_seq);
                          }}
                          className={`${styles.button} ${
                            item.share === "y" ? styles.active : styles.inactive
                          }`}
                        >
                          팀용
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredContacts.length === 0 && (
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

              {/* 페이지 네비게이션 항상 하단 */}
              {totalPages > 1 && (
                <div className={styles.paginationParent}>
  <button
    onClick={() => setCurrentPage(1)}
    disabled={currentPage === 1}
    className={styles.pageArrow}
  >
    <img src={doubleLeftArrow} alt="처음" />
  </button>

  <button
    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
    disabled={currentPage === 1}
    className={styles.pageArrow}
  >
    <img src={leftArrow} alt="이전" />
  </button>

  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`${styles.pageButton} ${
        currentPage === page ? styles.activePage : ""
      }`}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
    disabled={currentPage === totalPages}
    className={styles.pageArrow}
  >
    <img src={rightArrow} alt="다음" />
  </button>

  <button
    onClick={() => setCurrentPage(totalPages)}
    disabled={currentPage === totalPages}
    className={styles.pageArrow}
  >
    <img src={doubleRightArrow} alt="마지막" />
  </button>
</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ContactList;

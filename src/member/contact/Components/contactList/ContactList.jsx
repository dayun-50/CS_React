import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { IoSearch } from "react-icons/io5";
import { caxios } from "../../../../config/config";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import useAuthStore from "../../../../store/useAuthStore";
import doubleLeftArrow from "./icon/doubleLeftArrow.svg"; // <<
import leftArrow from "./icon/leftArrow.svg"; // <
import rightArrow from "./icon/rightArrow.svg"; // >
import doubleRightArrow from "./icon/doubleRightArrow.svg"; // >>

const ContactList = () => {
  // 로그인 정보 가져오기
  const { id: userEmail, isLogin } = useAuthStore();

  // 상태값 정의
  const [contacts, setContacts] = useState([]); // 전체 연락처
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [selectedContact, setSelectedContact] = useState(null); // 상세보기
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 페이지당 항목 수

  // 연락처 가져오기 함수
  const fetchContacts = async () => {
    console.log("로그인 상태:", isLogin);
    console.log("현재 사용자 이메일:", userEmail);

    // 로그인 안 되었으면 목록 초기화
    if (!isLogin || !userEmail) {
      console.log("API 호출 조건 불만족 (로그인 필요)");
      return setContacts([]);
    }

    try {
      // 전체 주소록 조회 (백엔드: /contact/list/{userEmail})
      const res = await caxios.get(`/contact/list/${userEmail}`);
      console.log("API 응답 데이터:", res.data);
      setContacts(res.data || []);
    } catch (err) {
      console.error("연락처 로딩 실패:", err);
      setContacts([]);
    }
  };

  // 컴포넌트 로드시 및 로그인 정보 변경 시 데이터 로드
  useEffect(() => {
    fetchContacts();
  }, [isLogin, userEmail]);

  // '개인용'으로 변경 핸들러
  const handleIndividual = (contact_seq) => {
    caxios
      .put(`/contact/update`, {
        share: "n",
        contact_seq,
        owner_email: userEmail,
      })
      .then(() => {
        // share 상태를 즉시 반영
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "n" }
              : contact
          )
        );
      })
      .catch((err) => console.error("개인용 설정 실패:", err));
  };

  // '팀용'으로 변경 핸들러
  const handleTeamContact = (contact_seq) => {
    caxios
      .put(`/contact/update`, {
        share: "y",
        contact_seq,
        owner_email: userEmail,
      })
      .then(() => {
        // share 상태를 즉시 반영
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "y" }
              : contact
          )
        );
      })
      .catch((err) => console.error("팀용 설정 실패:", err));
  };

  // 연락처 수정 후 상태 갱신
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

  // 연락처 삭제 후 상태 갱신
  const handleDeleted = (deletedContactSeq) => {
    setContacts((prev) =>
      prev.filter((contact) => contact.contact_seq !== deletedContactSeq)
    );
    setSelectedContact(null);
  };

  // 검색 필터링
  const filteredContacts = contacts?.filter(
    (contact) =>
      contact.contact_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 처리
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // 페이지 이동 함수
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.contactList}>
      {/* 상세보기 화면 */}
      {selectedContact ? (
        <ContactDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ) : (
        <>
          {/* -------------------------------
              상단 영역 (타이틀 + 검색창)
          ------------------------------- */}
          <div className={styles.header}>
            <div className={styles.title}>주소록</div>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="회사 이름 또는 이름을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              연락처 목록 or 빈 상태 표시
          ------------------------------- */}
          {filteredContacts?.length > 0 ? (
            currentContacts.map((item, index) => (
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
                    {/* 개인용 버튼 */}
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
                    {/* 팀용 버튼 */}
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
            ))
          ) : (
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
              페이지네이션 (항상 하단 고정)
          ------------------------------- */}
          {totalPages > 1 && (
            <div className={styles.paginationParent}>
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={styles.pageArrow}
              >
                <img src={doubleLeftArrow} alt="처음" />
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageArrow}
              >
                <img src={leftArrow} alt="이전" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.activePage : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageArrow}
              >
                <img src={rightArrow} alt="다음" />
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={styles.pageArrow}
              >
                <img src={doubleRightArrow} alt="마지막" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactList;

import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";

const TeamContact = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색용
  const [selectedContact, setSelectedContact] = useState(null); // 디테일용

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

  // 개인용으로 전환 시 리스트에서 제거 + 서버 갱신
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <IoSearch size={24} color="#8c8c8c" />
            </div>
          </div>

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
          {filteredContacts.length === 0 && (
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
        </>
      )}
    </div>
  );
};

export default TeamContact;

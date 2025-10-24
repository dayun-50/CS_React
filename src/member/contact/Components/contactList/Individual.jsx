import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";

const Individual = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색용
  const [selectedContact, setSelectedContact] = useState(null); // 디테일 정보

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
    // 상태 먼저 업데이트 (즉시 UI 반영)
    setContacts((prev) =>
      prev.map((c) =>
        c.contact_seq === contact_seq ? { ...c, share: newShare } : c
      )
    );

    // 서버 요청
    caxios
      .put("/contact/update", { contact_seq, share: newShare })
      .then(() =>
        console.log(`${newShare === "n" ? "개인용" : "팀용"} 설정 성공`)
      )
      .catch((err) => {
        console.error(`${newShare === "n" ? "개인용" : "팀용"} 설정 실패`, err);
        // 실패 시 롤백
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <IoSearch size={24} color="#8c8c8c" />
            </div>
          </div>

          <div className={styles.tableHeader}>
            <div className={`${styles.cell} ${styles.number}`}>번호</div>
            <div className={`${styles.cell} ${styles.name}`}>이름</div>
            <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
            <div className={`${styles.cell} ${styles.email}`}>이메일</div>
            <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
            <div className={`${styles.cell} ${styles.group}`}>분류</div>
          </div>

          {filteredContacts.length === 0 ? (
            <div className={styles.contactEmptyContainer}>
              <img
                src={addressBook}
                className={styles.contactEmptyIcon}
                alt="File"
              />
              <div className={styles.contactEmptyText}>주소록이 없습니다</div>
            </div>
          ) : (
            filteredContacts.map((item, index) => (
              <div
                key={item.contact_seq}
                className={styles.tableRow}
                onClick={() => setSelectedContact(item)}
              >
                <div className={`${styles.cell} ${styles.number}`}>
                  {index + 1}
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
        </>
      )}
    </div>
  );
};

export default Individual;

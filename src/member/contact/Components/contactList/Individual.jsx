import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import useAuthStore from "../../../../store/useAuthStore";

const Individual = () => {
  const { id: userEmail } = useAuthStore(); // 로그인 사용자 이메일 가져오기
  const [contacts, setContacts] = useState([]); // 개인용 연락처 리스트
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedContact, setSelectedContact] = useState(null); // 선택된 연락처 상세보기

  // 컴포넌트 마운트 시 개인용 연락처 로딩
  const fetchContacts = () => {
    // 백엔드에 정의된 경로로 요청 (userEmail 포함)
    caxios
      .get(`/contact/individual/${userEmail}`)
      .then((res) => {
        setContacts(res.data);
      })
      .catch((err) => console.error("개인용 주소록 로딩 실패:", err));
  };

  useEffect(() => {
    fetchContacts();
  }, [userEmail]);

  // 연락처 공유 상태(개인용/팀용) 변경
  const updateShare = (contact_seq, newShare) => {
    // share를 "y"로 바꾸면 개인용 목록에서 제거
    if (newShare === "y") {
      // 1. UI에서 즉시 제거
      setContacts((prev) => prev.filter((c) => c.contact_seq !== contact_seq));
      // 2. 상세보기 열려 있으면 닫기
      if (selectedContact?.contact_seq === contact_seq) {
        setSelectedContact(null);
      }
    } else {
      // "n"으로 바꾸는 경우, 목록에 있으므로 share 값만 업데이트
      setContacts((prev) =>
        prev.map((c) =>
          c.contact_seq === contact_seq ? { ...c, share: newShare } : c
        )
      );
    }

    // 서버 요청
    caxios
      .put("/contact/update", { contact_seq, share: newShare })
      .then(() => {
        console.log(`${newShare === "n" ? "개인용" : "팀용"} 설정 성공`);
        // 성공 시 추가 처리 필요 없음 (UI는 이미 반영됨)
      })
      .catch((err) => {
        console.error(`${newShare === "n" ? "개인용" : "팀용"} 설정 실패`, err);
        // newShare가 "y"였는데 실패했다면, "n"으로 돌려 다시 목록에 표시
      });
  };

  // 연락처 수정 후 리스트 갱신
  const handleUpdated = (updatedContact) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.contact_seq === updatedContact.contact_seq ? updatedContact : c
      )
    );
    setSelectedContact(updatedContact); // 상세보기 업데이트
  };

  // 연락처 삭제 후 리스트 갱신
  const handleDeleted = (contact_seq) => {
    setContacts((prev) => prev.filter((c) => c.contact_seq !== contact_seq));
    setSelectedContact(null); // 상세보기 닫기
  };

  // 검색어 기반 필터링 (회사 이름 또는 이름)
  const filteredContacts = contacts.filter(
    (c) =>
      c.contact_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.contactList}>
      {selectedContact ? (
        // 선택된 연락처 상세보기
        <ContactDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ) : (
        <>
          {/* 헤더: 제목 + 검색창 */}
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

          {/* 테이블 헤더 */}
          <div className={styles.tableHeader}>
            <div className={`${styles.cell} ${styles.number}`}>번호</div>
            <div className={`${styles.cell} ${styles.name}`}>이름</div>
            <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
            <div className={`${styles.cell} ${styles.email}`}>이메일</div>
            <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
            <div className={`${styles.cell} ${styles.group}`}>분류</div>
          </div>

          {/* 연락처 없을 때 표시 */}
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
            // 연락처 목록
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
                    {/* 개인용 버튼: share가 "n"일 때만 활성화 */}
                    <button
                      type="button"
                      className={`${styles.button} ${
                        item.share === "n" ? styles.active : styles.inactive
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // 이미 개인용이면 클릭 막기
                        if (item.share !== "n") return;
                        updateShare(item.contact_seq, "n");
                      }}
                    >
                      개인용
                    </button>
                    {/* 팀용 버튼: share가 "y"일 때만 활성화 */}
                    <button
                      type="button"
                      className={`${styles.button} ${
                        item.share === "y" ? styles.active : styles.inactive
                      }`}
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

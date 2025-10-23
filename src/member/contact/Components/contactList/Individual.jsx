import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";

const Individual = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedContact, setSelectedContact] = useState(null); //디테일 페이지용

  // 데이터 로딩 함수 (개인용만 필터링)
  const fetchContacts = () => {
    caxios
      .get("/contact/list")
      .then((res) => {
        // 전체 주소록을 받아와 개인용만 필터링
        const individualContacts = res.data.filter(
          (item) => item.contact_group === "개인"
        );
        setContacts(individualContacts);
      })
      .catch((err) => {
        console.error("개인용 주소록 로딩 실패:", err);
      });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // '개인용' 설정 핸들러 (API 호출 + UI 업데이트)
  const handleIndividual = (contact_seq) => {
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "n" })
      .then(() => {
        console.log("개인용 설정 성공: 그룹 유지");
        // 개인용 페이지이므로 UI 변경 사항은 없으나, 상태 업데이트를 통해 리렌더링 (contact_group이 "개인"으로 유지됨)
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "n" }
              : contact
          )
        );
      })
      .catch((err) => {
        console.error("개인용 설정 실패:", err);
      });
  };

  // '팀용' 설정 핸들러 (API 호출 + UI 업데이트: 리스트에서 항목 제거)
  const handleTeamContact = (contact_seq) => {
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "y" })
      .then(() => {
        console.log("팀용 설정 성공: 리스트에서 항목 제거");
        // 🚨 핵심 로직: contacts 상태에서 해당 contact_seq를 가진 항목을 필터링하여 제거
        setContacts((prev) =>
          prev.filter((contact) => contact.contact_seq !== contact_seq)
        );
      })
      .catch((err) => {
        console.error("팀용 설정 실패:", err);
      });
  };

  // 검색 필터링 로직 (회사 이름 기준)
  const filteredContacts = contacts?.filter(
    (contact) =>
      contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) // 이름으로도 검색되도록 추가
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
            <div className={styles.title}>개인용 주소록</div>
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
          {/* ContactList의 헤더 구조를 그대로 사용 */}
          <div className={styles.tableHeader}>
            <div className={`${styles.cell} ${styles.number}`}>번호</div>
            <div className={`${styles.cell} ${styles.name}`}>이름</div>
            <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
            <div className={`${styles.cell} ${styles.email}`}>이메일</div>
            <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
            <div className={`${styles.cell} ${styles.group}`}>분류</div>{" "}
            {/* 버튼 셀 추가 */}
          </div>

          {/* 리스트 데이터 */}
          {filteredContacts.length === 0 && (
            <div className={styles.noContacts}>개인용 주소록이 없습니다.</div>
          )}

          {filteredContacts.map((item, index) => (
            <div key={item.contact_seq} className={styles.tableRow}>
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

              {/* 분류 버튼 그룹 추가 */}
              <div className={`${styles.cell} ${styles.group}`}>
                <div className={styles.buttonGroup}>
                  {/* 개인용 버튼: 이 페이지에 있으므로 항상 active */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIndividual(item.share);
                    }}
                    className={`${styles.button} ${styles.active}`}
                  >
                    개인용
                  </button>
                  {/* 팀용 버튼: inactive, 클릭 시 리스트에서 사라짐 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTeamContact(item.share);
                    }}
                    className={`${styles.button} ${styles.inactive}`}
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

export default Individual;

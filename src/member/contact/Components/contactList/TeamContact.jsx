import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5"; // 검색 아이콘 추가
import ContactDetail from "../contactDetail/ContactDetail";

const TeamContact = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [selectedContact, setSelectedContact] = useState(null); //디테일 페이지용

  // 데이터 로딩 함수 (팀원용만 필터링)
  const fetchContacts = () => {
    caxios
      .get("/contact/list")
      .then((res) => {
        // 전체 주소록을 받아와 팀원용만 필터링
        const teamContacts = res.data.filter((item) => item.share === "y");
        setContacts(teamContacts);
      })
      .catch((err) => {
        console.error("팀원용 주소록 로딩 실패:", err);
      });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // '개인용' 설정 핸들러 (API 호출 + UI 업데이트: 리스트에서 항목 제거)
  const handleIndividual = (contact_seq) => {
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "n" })
      .then(() => {
        console.log("개인용 설정 성공: 리스트에서 항목 제거");
        setContacts((prev) =>
          prev.filter((contact) => contact.contact_seq !== contact_seq)
        );
      })
      .catch((err) => {
        console.error("개인용 설정 실패:", err);
      });
  };

  // '팀용' 설정 핸들러 (API 호출 + UI 업데이트)
  const handleTeamContact = (contact_seq) => {
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "y" })
      .then(() => {
        console.log("팀용 설정 성공: 그룹 유지");
        // 팀용 페이지이므로 UI 변경 사항은 없으나, 상태 업데이트를 통해 리렌더링
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "y" }
              : contact
          )
        );
      })
      .catch((err) => {
        console.error("팀용 설정 실패:", err);
      });
  };

  // 검색 필터링 로직 (회사 이름 또는 이름 기준)
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.contactList}>
      {/* 디테일 페이지로 이동하고 싶을 시 */}
      {selectedContact ? (
        <ContactDetail
          contact={selectedContact}
          onClick={() => setSelectedContact(null)} // 뒤로가기
        />
      ) : (
        <>
          {/* 상단 영역 (검색창 추가) */}
          <div className={styles.header}>
            <div className={styles.title}>팀원용 주소록</div>
            {/* 검색 */}
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
            <div className={`${styles.cell} ${styles.group}`}>분류</div>{" "}
            {/* 버튼 셀 추가 */}
          </div>

          {/* 리스트 데이터는 필터링된 리스트를 사용 */}
          {filteredContacts.length === 0 && (
            <div className={styles.noContacts}>
              {searchTerm
                ? "검색 결과가 없습니다."
                : "팀원용 주소록이 없습니다."}
            </div>
          )}

          {filteredContacts.map((item, index) => (
            <div
              key={item.contact_seq}
              className={styles.tableRow}
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

              {/* 분류 버튼 그룹 추가 */}
              <div className={`${styles.cell} ${styles.group}`}>
                <div className={styles.buttonGroup}>
                  {/* 개인용 버튼: inactive, 클릭 시 리스트에서 사라짐 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIndividual(item.contact_seq);
                    }}
                    className={`${styles.button} ${styles.inactive}`}
                  >
                    개인용
                  </button>
                  {/* 팀용 버튼: 이 페이지에서는 항상 active */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTeamContact(item.contact_seq);
                    }}
                    className={`${styles.button} ${styles.active}`}
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

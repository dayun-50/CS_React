import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { caxios } from "../../../../config/config";
import { IoSearch } from "react-icons/io5";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";

const TeamContact = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null); // 데이터 로딩 함수 (팀원용만 필터링)

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
  }, []); // '개인용' 설정 핸들러 (API 호출 + UI 업데이트: 리스트에서 항목 제거)

  const handleTeamContact = (contact_seq) => {
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "y", contact_seq })
      .then(() => {
        console.log("개인용 설정 성공: 리스트에서 항목 제거");
        setContacts((prev) =>
          prev.filter((contact) => contact.contact_seq !== contact_seq)
        );
      })
      .catch((err) => {
        console.error("개인용 설정 실패:", err);
      });
  }; // '팀용' 설정 핸들러 (API 호출 + UI 업데이트)

  const handleIndividual = (contact_seq) => {
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "n", contact_seq })
      .then(() => {
        console.log("개인용 설정 성공: 리스트에서 항목 제거");
        setContacts((prev) =>
          prev.filter((contact) => contact.contact_seq !== contact_seq)
        );
      })
      .catch((err) => {
        console.error("개인용 설정 실패:", err);
      });
  }; // 검색 필터링 로직 (회사 이름 또는 이름 기준)

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.company_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          {/* 상단 영역 (검색창 추가) */}
          <div className={styles.header}>
            <div className={styles.title}>팀원용</div>
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

            <div className={`${styles.cell} ${styles.group}`}>분류</div>
          </div>
          {/* 리스트 데이터는 필터링된 리스트를 사용 */}
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
                    공지사항이 없습니다
                  </div>
                </div>
              )}
            </div>
          )}

          {filteredContacts.map((item, index) => (
            <div
              key={item.contact_seq}
              className={styles.tableRow}
              onClick={() => setSelectedContact(item)} // 디테일 페이지 이동을 위해 onClick 추가
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
              {/* 분류 버튼 그룹 */}
              <div className={`${styles.cell} ${styles.group}`}>
                <div className={styles.buttonGroup}>
                  {/* 개인용 버튼: inactive, 클릭 시 리스트에서 사라짐 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 여기서 item.share 대신 item.contact_seq를 전달해야 합니다.
                      handleIndividual(item.contact_seq);
                    }}
                    className={`${styles.button} ${styles.inactive}`}
                    type="button"
                  >
                    개인용
                  </button>
                  {/* 팀용 버튼: 이 페이지에서는 항상 active */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 여기서 item.share 대신 item.contact_seq를 전달해야 합니다.
                      handleTeamContact(item.contact_seq);
                    }}
                    className={`${styles.button} ${styles.active}`}
                    type="button"
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

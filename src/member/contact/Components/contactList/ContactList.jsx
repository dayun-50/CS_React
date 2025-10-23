import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { IoSearch } from "react-icons/io5";
import { caxios } from "../../../../config/config";
import Individual from "./Individual";
import TeamContact from "./TeamContact";
import ContactDetail from "../contactDetail/ContactDetail";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [viewMode, setViewMode] = useState("all"); // 'all', 'individual', 'teamContact' 상태 복구 및 초기화
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedContact, setSelectedContact] = useState(null); //디테일 페이지용

  // 초기 데이터 로딩
  useEffect(() => {
    caxios
      .get("/contact/list")
      .then((res) => {
        console.log("연락처 로딩 성공:", res.data);
        // DB에서 받은 데이터를 contacts 상태에 저장
        setContacts(res.data);
      })
      .catch((err) => {
        console.error("연락처 로딩 실패:", err);
      });
  }, []);

  // '개인용' 설정 핸들러 (UI 즉시 업데이트 + DB 반영)
  const handleIndividual = (contact_seq) => {
    console.log("개인용 주소록 버튼 클릭됨:", contact_seq);

    // DB에 '개인용'(share: n)으로 설정 요청
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "n" })
      .then((res) => {
        console.log("개인용 설정 성공:", res.data);

        // contacts 상태 업데이트 (해당 항목의 contact_group을 "개인"으로 변경)
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "n" } // contact_group을 "개인"으로 변경
              : contact
          )
        );
      })
      .catch((err) => {
        console.error("개인용 설정 실패:", err);
      });
  };

  // '팀용' 설정 핸들러 (UI 즉시 업데이트 + DB 반영)
  const handleTeamContact = (contact_seq) => {
    console.log("팀용 주소록 버튼 클릭됨:", contact_seq);

    // DB에 '팀용'(share: y)으로 설정 요청
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "y" })
      .then((res) => {
        console.log("팀용 설정 성공:", res.data);

        // contacts 상태 업데이트 (해당 항목의 contact_group을 "팀"으로 변경)
        setContacts((prev) =>
          prev.map((contact) =>
            contact.contact_seq === contact_seq
              ? { ...contact, share: "y" } // contact_group을 "팀"으로 변경
              : contact
          )
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
      {/* 디테일 뷰가 선택됐을 때는 그것만 보여주기 / contact가 있을 때만 ContactDetail 렌더링 */}
      {selectedContact ? (
        <ContactDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)} // 뒤로가기
        />
      ) : (
        <>
          {/* 뷰 모드에 따라 컴포넌트 렌더링 */}
          {viewMode === "individual" && <Individual />}
          {viewMode === "teamContact" && <TeamContact />}

          {/* 'all' 모드일 때 전체 주소록 목록 렌더링 */}
          {viewMode === "all" && (
            <>
              {/* 상단 영역 */}
              <div className={styles.header}>
                <div className={styles.title}>주소록</div>
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
                <div className={`${styles.cell} ${styles.company}`}>
                  회사 이름
                </div>
                <div className={`${styles.cell} ${styles.email}`}>이메일</div>
                <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
                <div className={`${styles.cell} ${styles.group}`}>분류</div>
              </div>

              {/* 리스트 데이터 */}
              {filteredContacts?.map((item, index) => (
                <div
                  className={styles.tableRow}
                  key={item.contact_seq}
                  onClick={() => setSelectedContact(item)}
                >
                  {" "}
                  {/* 클릭 시 디테일 이동 */}
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
                      {/* 개인용 버튼: contact_group이 '개인'일 때 active 클래스 적용 */}
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
                      {/* 팀용 버튼: contact_group이 '팀'일 때 active 클래스 적용 */}
                      {/*클릭 이벤트 부모로 안 올리기*/}
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

              {/* 주소록이 없을 경우 */}
              {filteredContacts?.length === 0 && (
                <div className={styles.noContacts}>
                  검색 결과 또는 주소록이 없습니다.
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

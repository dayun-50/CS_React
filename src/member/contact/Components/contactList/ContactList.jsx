import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { IoSearch } from "react-icons/io5";
import { caxios } from "../../../../config/config";
import Individual from "./Individual";
import TeamContact from "./TeamContact";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [viewMode, setViewMode] = useState("all"); // 'all', 'individual', 'team' 같은 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  useEffect(() => {
    caxios
      .get("/contact/list")
      .then((res) => {
        console.log("연락처 로딩 성공:", res.data);
        setContacts(res.data);
      })
      .catch((err) => {
        console.error("연락처 로딩 실패:", err);
      });
  }, []);

  // 개인용을 누를 시
  const handleIndividual = (contact_seq) => {
    console.log("개인용 주소록 버튼 클릭됨");
    // 개인용 주소록 관련 로직 추가
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "n" })
      .then((res) => {
        console.log("개인용 설정 성공:", res.data);
        setViewMode("individual");
        // 필요시 상태 업데이트
      })
      .catch((err) => {
        console.error("개인용 설정 실패:", err);
      });
  };

  // 팀용을 누를 시
  const handleTeamContact = (contact_seq) => {
    console.log("팀용 주소록 버튼 클릭됨");
    // 팀용 주소록 관련 로직 추가
    caxios
      .post(`/contact/share/${contact_seq}`, { share: "y" })
      .then((res) => {
        console.log("팀용 설정 성공:", res.data);
        setViewMode("teamContact");
        // 필요시 상태 업데이트
      })
      .catch((err) => {
        console.error("팀용 설정 실패:", err);
      });
  };

  return (
    <div className={styles.contactList}>
      {viewMode === "individual" && <Individual />}
      {viewMode === "teamContact" && <TeamContact />}
      {/* team 컴포넌트 있으면 추가 가능 */}
      {viewMode === "all" && (
        <>
          {/* 상단 영역 */}
          <div className={styles.header}>
            <div className={styles.title}>주소록</div>
            {/* 검색 */}
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="회사 이름을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <IoSearch size={20} color="#8c8c8c" />
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

          {/* 리스트 데이터 */}
          {contacts?.map((item, index) => (
            <div className={styles.tableRow} key={item.contact_seq}>
              <div className={`${styles.cell} ${styles.number}`}>
                {index + 1}
              </div>
              <div className={`${styles.cell} ${styles.name}`}>{item.name}</div>
              <div className={`${styles.cell} ${styles.company}`}>
                {item.company_name || "N/A"}
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
                    onClick={() => handleIndividual(item.contact_seq)}
                    className={`${styles.button} ${
                      item.contact_group === "개인"
                        ? styles.active
                        : styles.inactive
                    }`}
                  >
                    개인용
                  </button>
                  <button
                    onClick={() => handleTeamContact(item.contact_seq)}
                    className={`${styles.button} ${
                      item.contact_group === "팀"
                        ? styles.active
                        : styles.inactive
                    }`}
                  >
                    팀용
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 주소록이 없을 경우 */}
          {contacts?.length === 0 && (
            <div className={styles.noContacts}>주소록이 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactList;

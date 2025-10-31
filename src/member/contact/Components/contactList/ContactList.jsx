import { useEffect, useState } from "react";
import styles from "./ContactList.module.css";
import { IoSearch } from "react-icons/io5";
import { caxios } from "../../../../config/config";
import ContactDetail from "../contactDetail/ContactDetail";
import addressBook from "./icon/Address Book.svg";
import useAuthStore from "../../../../store/useAuthStore";

const ContactList = () => {
  const { id: userEmail, isLogin } = useAuthStore();

  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  // 연락처 가져오기 함수 (전체 목록)
  const fetchContacts = async () => {
    console.log("로그인 상태:", isLogin);
    console.log("현재 사용자 이메일 (userEmail):", userEmail); // 💡 이 값을 확인!

    if (!isLogin || !userEmail) {
      console.log("API 호출 조건 불만족: userEmail 또는 isLogin이 false임.");
      return setContacts([]);
    }

    try {
      const res = await caxios.get(`/contact/list/${userEmail}`);
      console.log("API 응답 데이터:", res.data); // 응답 데이터 재확인
      setContacts(res.data || []);
    } catch (err) {
      console.error("연락처 로딩 실패:", err);
      setContacts([]);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchContacts();
  }, [isLogin, userEmail]);

  // '개인용' 설정 핸들러 (share: "n")
  const handleIndividual = (contact_seq) => {
    caxios
      .put(`/contact/update`, {
        share: "n",
        contact_seq,
        owner_email: userEmail,
      })
      .then(() => {
        // 전체 목록이므로, share 값만 변경하여 버튼 상태를 즉시 갱신
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

  // '팀용' 설정 핸들러 (share: "y")
  const handleTeamContact = (contact_seq) => {
    caxios
      .put(`/contact/update`, {
        share: "y",
        contact_seq,
        owner_email: userEmail,
      })
      .then(() => {
        // 전체 목록이므로, share 값만 변경하여 버튼 상태를 즉시 갱신
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

  // 수정 후 연락처 데이터 업데이트
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

  // 삭제 후 연락처 데이터 업데이트
  const handleDeleted = (deletedContactSeq) => {
    setContacts((prev) =>
      prev.filter((contact) => contact.contact_seq !== deletedContactSeq)
    );
    setSelectedContact(null);
  };

  // 검색 필터링 로직
  const filteredContacts = contacts?.filter(
    (contact) =>
      contact.contact_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.contactList}>
      {selectedContact ? (
        <ContactDetail
          contact={selectedContact}
          onClose={() => {
            setSelectedContact(null);
          }}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ) : (
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
            <div className={`${styles.cell} ${styles.company}`}>회사 이름</div>
            <div className={`${styles.cell} ${styles.email}`}>이메일</div>
            <div className={`${styles.cell} ${styles.phone}`}>연락처</div>
            <div className={`${styles.cell} ${styles.group}`}>분류</div>
          </div>

          {/* 리스트 데이터 */}
          {filteredContacts?.length > 0 ? (
            filteredContacts.map((item, index) => (
              <div
                className={styles.tableRow}
                key={item.contact_seq}
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
        </>
      )}
    </div>
  );
};

export default ContactList;

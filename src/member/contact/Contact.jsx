import { useEffect, useState } from "react";
import SubSideBar from "../navis/subsidebar/SubSideBar";
import styles from "./Contact.module.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Contact = () => {
  const btnsType = [
    { key: "", name: "전체", path: "/contacts", label: "전체 리스트" },
    {
      key: "individual",
      name: "개인",
      path: "/contacts/individual",
      label: "개인",
    },
    {
      key: "teamContact",
      name: "팀원",
      path: "/contacts/teamContact",
      label: "팀원",
    },
  ];

  const navigate = useNavigate();

  const [subSidebarData, setSubSidebarData] = useState({
    btns: btnsType.map(({ name, path }) => ({ name, path })), // 작성하기 제외 버튼들
    selectedBtn: "",
    text: "주소록 추가", // 작성하기 버튼의 문구
    navigateFunc: () => navigate("/contacts/contactForm"), //작성하기 버튼 경로 이동용 함수
  });

  const location = useLocation();
  const target = location.pathname.split("/")[2] ?? ""; // url에서 경로 추출 /member/approval/approved에서 approved를 가져오게 하는 문구 만약 비어있는 값이라면 전체랑 매핑이 될것

  //3. 타겟이 바뀔때마다 유즈이펙펙트로 감지해주면 된다
  useEffect(() => {
    const currentType = btnsType.find((t) => t.key === target);
    if (currentType) {
      setSubSidebarData((prev) => ({ ...prev, selectedBtn: currentType.name }));
    } else {
      setSubSidebarData((prev) => ({ ...prev, selectedBtn: "전체" }));
    }
  }, [target]);

  return (
    <div className={styles.container}>
      {/* 전체 영역, 부모의 100%를 가지기 */}
      {/* 서브 네비바 영역 */}
      <div className={styles.left}>
        <SubSideBar data={subSidebarData} />
      </div>
      {/* 서브 네비바 제외 우측 영역 */}
      <div className={styles.right}>
        {/* 여기에 라우트에 따라 ContactList, IndividualList, TeamContactList가 바뀜 */}
        {/* 중첩 라우트 내용은 <Outlet />으로 받아야 합니다 */}
        <Outlet />
      </div>
    </div>
  );
};

export default Contact;

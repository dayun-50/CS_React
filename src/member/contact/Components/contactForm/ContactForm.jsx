import styles from "./ContactForm.module.css";

const ContactForm = () => {
  return (
    <div className={styles.frameParent}>
      <div className={styles.wrapper}>
        <div className={styles.div} />
      </div>
      <div className={styles.parent}>
        <div className={styles.div2}>
          <div className={styles.div3}>
            <div className={styles.container}>
              <div className={styles.div4}>뒤로가기</div>
            </div>
            <div className={styles.frame}>
              <div className={styles.div5}>추가</div>
            </div>
          </div>
          <div className={styles.div6}>
            <div className={styles.div7}>주소록 추가</div>
          </div>
          <div className={styles.div8}>
            <div className={styles.rectangleParent}>
              <div className={styles.groupChild} />
              <div className={styles.div9}>회사 이름</div>
            </div>
            <div className={styles.div10}>회사 이름</div>
          </div>
          <div className={styles.div11}>
            <div className={styles.rectangleParent}>
              <div className={styles.groupChild} />
              <div className={styles.div9}>연락처</div>
            </div>
            <div className={styles.div10}>연락처</div>
          </div>
          <div className={styles.div14}>
            <div className={styles.rectangleParent}>
              <div className={styles.groupChild} />
              <div className={styles.div9}>이메일</div>
            </div>
            <div className={styles.div10}>이메일</div>
          </div>
          <div className={styles.div17}>
            <div className={styles.groupDiv}>
              <div className={styles.rectangleDiv} />
              <div className={styles.div18}>메모 내용을 입력하세요</div>
            </div>
            <div className={styles.div10}>메모</div>
          </div>
          <div className={styles.div20}>
            <div className={styles.rectangleParent}>
              <div className={styles.groupChild} />
              <div className={styles.div9}>이름</div>
            </div>
            <div className={styles.div10}>이름</div>
          </div>
          <div className={styles.wrapper2}>
            <div className={styles.div23}>분류 버튼</div>
          </div>
        </div>
        <div className={styles.frameGroup}>
          <div className={styles.frameDiv}>
            <b className={styles.b}>개인용</b>
          </div>
          <div className={styles.wrapper3}>
            <div className={styles.b}>팀용</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactForm;

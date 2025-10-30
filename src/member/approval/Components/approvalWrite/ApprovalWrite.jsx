import { useNavigate } from 'react-router-dom';
import styles from './ApprovalWrite.module.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import { caxios } from '../../../../config/config';
import plusicon from "./icon/plusicon.svg";
function ApprovalWrite() {

    const navigate = useNavigate();

    //파일이름 배열(화면에 뿌리는 용)
    const [fileList, setFileList] = useState([]);
    const handleFileChange = (e) => {
        const filesArr = Array.from(e.target.files);
        setFileList(filesArr);
        setFiles(filesArr);
    };

    //파일보내는용 
    const [files, setFiles] = useState([]);

    //내용 저장
    const contentRef = useRef(null);
    const titleRef = useRef(null);
    const handleSave = () => {
        const title = titleRef.current?.innerText || "";
        const content = contentRef.current?.innerHTML || "";

        // 길이 체크
        // HTML 태그 제거
        const textOnly = content.replace(/<[^>]*>/g, "").trim();
        if (title.trim().length < 1 || textOnly.length < 1) {
            alert("제목과 내용을 입력하세요");
            return;
        }

        const form = new FormData();
        form.append("approval_title", title);
        form.append("approval_content", content);

        // 파일 추가
        for (const file of files) {
            form.append("files", file)
        }

        //axios 로직 추가
        caxios.post(`/approval`, form)
            .then(() => {
                alert("작성이 완료되었습니다");
                navigate("/approval");
            })
            .catch(() => {
                alert("오류가 발생했습니다");
            })
    };


    return (
        <div className={styles.writeBox}>
            <div className={styles.parent}>
                <div className={styles.description}>
                    <div className={styles.type}>전자 결재 신청</div>
                </div>
                <div className={styles.titlebox}>
                    <div ref={titleRef} className={styles.title}
                        contentEditable onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); } }}
                        onInput={(e) => {
                            const text = e.currentTarget.innerText;
                            if (text.length > 15) {
                                alert("제목은 15자까지 입력 가능합니다.");
                                // 초과된 텍스트 제거
                                e.currentTarget.innerText = text.slice(0, 15);
                                // 커서를 맨 끝으로 이동
                                const range = document.createRange();
                                const sel = window.getSelection();
                                range.selectNodeContents(e.currentTarget);
                                range.collapse(false);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }}>

                    </div>
                </div>

                <div className={styles.fileWrapper}>
                    <div className={styles.filebox}>
                        <label htmlFor="fileUpload" className={styles.customFileBtn}>
                            <img src={plusicon} alt="add file" className={styles.icon} />
                            {fileList.length === 0
                                ? (<div className={styles.chooseFileText}>눌러 파일을 첨부해 주세요</div>)
                                : fileList.map((file, idx) => (
                                    <div key={idx} className="fileRow">{file.name}</div>
                                ))
                            }
                        </label>

                        <input
                            type="file"
                            id="fileUpload"
                            className={styles.hiddenFileInput}
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>
                </div>

                <div className={styles.contentbox}>
                    <div
                        ref={contentRef}
                        className={styles.content}
                        contentEditable
                        data-placeholder="보낼 내용을 입력해주세요."
                    ></div>
                </div>
            </div>

            <div className={styles.btns}>
                <button className={styles.btn1} onClick={() => { navigate(-1) }}>뒤로가기</button>
                <button className={styles.btn2} onClick={handleSave}>작성완료</button>
            </div>

        </div>
    );
}

export default ApprovalWrite
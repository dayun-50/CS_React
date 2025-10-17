import axios from "axios";

// IP주소 본인걸로 바꿔서 테스트.
// 모든 테스트 완료시(배포직전) 서버 IP로 바꿔야함
export const caxios = axios.create({
    baseURL : `http://10.5.5.3`
});
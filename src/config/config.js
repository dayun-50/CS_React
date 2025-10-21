import axios from "axios";

export const caxios = axios.create({
    baseURL: `http://10.10.55.80`
});

// // 요청 인터셉터 추가
// caxios.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('authToken');  // 토큰 저장 위치에 따라 다름
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

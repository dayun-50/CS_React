import axios from "axios";

export const caxios = axios.create({
  baseURL: `http://10.5.5.9`,
});

// 이 함수는 MailWrite.jsx에서 호출되며, James Access Token을 수동으로 삽입합니다.
// export const mailRequest = async (method, url, data) => {
//   // 💡 James Access Token (Token B)을 가져옵니다.
//   const jamesToken = sessionStorage.getItem("jamesAccessToken");

//   if (!jamesToken) {
//     throw new Error("James 서버 접근 토큰이 없습니다. 다시 로그인해 주세요.");
//   }

//   return caxios.request({
//     method: method,
//     url: url,
//     data: data,
//     headers: {
//       // 이 헤더가 caxios의 기본 인터셉터가 붙이는 일반 토큰을 덮어씁니다.
//       Authorization: `Bearer ${jamesToken}`,
//       "Content-Type": "application/json",
//     },
//   });
// };

// //모든 일반 api 호출
// caxios.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("token");
//   if (token && !config.headers["Authorization"]) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

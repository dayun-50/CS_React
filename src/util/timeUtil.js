import dayjs from "dayjs";

/**
 * ISO 문자열을 한국 기준 시간이면서 HH:mm 형식으로 포맷
 * @param {string} isoString
 * @returns {string} "HH:mm"
 */
export const timeFormatKST = (isoString) => {
  const date = new Date(isoString);
  const hour = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${min}`;
};

/**
 * 날짜 객체를 YYYY-MM-DD 형식으로 포맷 :백엔드에서 받은내용을 변환
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 오늘로부터 1주일 후 ~ 1년 + 1주일 후 날짜 범위 반환
 * @returns {{ todayAfterWeek: Date, oneYearLater: Date }}
 */
export const getDateRange = () => {
  const todayAfterWeek = new Date();
  todayAfterWeek.setDate(todayAfterWeek.getDate() + 7);
  todayAfterWeek.setHours(0, 0, 0, 0);

  const oneYearLater = new Date(todayAfterWeek);
  oneYearLater.setFullYear(todayAfterWeek.getFullYear() + 1);
  oneYearLater.setDate(oneYearLater.getDate() + 7);

  return { todayAfterWeek, oneYearLater };
};

/**
 * dayjs 기반으로 ISO 날짜에서 날짜와 시간 분리 추출
 * @param {string} isoString
 * @returns {{ date: string, time: string }}
 */
export const extractDateTime = (isoString) => {
  return {
    date: dayjs(isoString).format("YYYY-MM-DD"),
    time: dayjs(isoString).format("HH:mm"),
  };
};

/**
 * 시작일과 종료일, 시작시간, 종료시간이 모두 14:00일 때 종료시간 비활성화 조건
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} startType
 * @param {string} endType
 * @returns {boolean}
 */
export const shouldDisableEnd14 = (startDate, endDate, startType, endType) => {
  return (
    startDate &&
    endDate &&
    startDate === endDate &&
    startType === "14:00" &&
    endType === "14:00"
  );
};

/**
 * Date 객체를 KST 기준 ISO 문자열로 변환
 * @param {Date} date
 * @returns {string} ISO 형식 문자열 (e.g. 2025-10-22T09:00:00+09:00)
 */
export const toKSTISOString = (date) => {
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(date.getTime() + kstOffset);
  return kstDate.toISOString().replace("Z", "+09:00");
};

/**
 * 두 날짜 문자열이 같은 날짜인지 비교
 * @param {string} date1 - YYYY-MM-DD
 * @param {string} date2 - YYYY-MM-DD
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  return date1 === date2;
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string}
 */
export const getToday = () => {
  return formatDate(new Date());
};

/**
 * HH:mm 형식의 시간 문자열 유효성 검사
 * @param {string} time
 * @returns {boolean}
 */
export const isValidTimeFormat = (time) => {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
};
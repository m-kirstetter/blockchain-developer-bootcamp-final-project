export const convertToUTCDate = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  );
};
export const getUTCDate = (year: number, month: number, date: number, hours = 0, minutes = 0, seconds = 0) => {
  return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
};

/**
 * Owner: iron@kupotech.com
 */
export default function dateToChartTimeMinute(date: Date) {
  return (
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      0,
      0,
    ) / 1000
  );
}

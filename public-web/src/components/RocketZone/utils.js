/**
 * Owner: solar@kupotech.com
 */

export function formatTime(milliseconds) {
  if (milliseconds <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

export function chunk(array, size) {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    let chunk = array.slice(index, size + index);
    while (chunk.length < size) {
      chunk.push('');
    }
    chunked_arr.push(chunk);
    index += size;
  }
  return chunked_arr;
}

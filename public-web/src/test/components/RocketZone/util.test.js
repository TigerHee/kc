/**
 * Owner: jessie@kupotech.com
 */

const { formatTime, chunk } = require('src/components/RocketZone/utils.js');

describe('formatTime', () => {
  it('should return 0 days, hours, minutes and seconds when input is 0 or less', () => {
    const result = formatTime(0);

    expect(result).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('should correctly format time when input is greater than 0', () => {
    const result = formatTime(90061000); // This is equivalent to 1 day, 1 hour, 1 minute and 1 second

    expect(result).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
  });
});

describe('chunk function', () => {
  test('chunks an array of 10 elements with size 2', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const size = 2;
    const result = chunk(array, size);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
  });

  test('chunks an array of 3 elements with size 1', () => {
    const array = [1, 2, 3];
    const size = 1;
    const result = chunk(array, size);
    expect(result).toEqual([[1], [2], [3]]);
  });

  test('chunks an array of 5 elements with size 3', () => {
    const array = [1, 2, 3, 4, 5];
    const size = 3;
    const result = chunk(array, size);
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, ''],
    ]);
  });

  test('chunks an empty array', () => {
    const array = [];
    const size = 3;
    const result = chunk(array, size);
    expect(result).toEqual([]);
  });

  test('chunks an array with size larger than array length', () => {
    const array = [1, 2];
    const size = 5;
    const result = chunk(array, size);
    expect(result).toEqual([[1, 2, '', '', '']]);
  });
});

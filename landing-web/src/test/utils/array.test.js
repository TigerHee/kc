/**
 * Owner: terry@kupotech.com
 */
import { setTwoDimensionalArray } from 'src/utils/array.js';


describe('setTwoDimensionalArray', () => {
  it('should split the array into sub-arrays of given length', () => {
    const list = [1, 2, 3, 4, 5, 6, 7];
    const len = 3;
    const result = setTwoDimensionalArray(list, len);
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('should handle case when list length is a multiple of len', () => {
    const list = [1, 2, 3, 4, 5, 6];
    const len = 2;
    const result = setTwoDimensionalArray(list, len);
    expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  it('should handle case when len is greater than list length', () => {
    const list = [1, 2, 3];
    const len = 5;
    const result = setTwoDimensionalArray(list, len);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should handle case when len is equal to list length', () => {
    const list = [1, 2, 3];
    const len = 3;
    const result = setTwoDimensionalArray(list, len);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should handle empty list', () => {
    const list = [];
    const len = 3;
    const result = setTwoDimensionalArray(list, len);
    expect(result).toEqual([]);
  });

});
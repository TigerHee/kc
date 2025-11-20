/**
 * Owner: iron@kupotech.com
 */
import dropZero from './dropZero';
import separateNumber from './separateNumber';
import numberFixed from './numberFixed';

export default (num, precision) => {
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }
  return separateNumber(dropZero(numberFixed(num, precision)));
};

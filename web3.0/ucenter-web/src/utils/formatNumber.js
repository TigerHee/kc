/**
 * Owner: iron@kupotech.com
 */
import dropZero from './dropZero';
import numberFixed from './numberFixed';
import separateNumber from './separateNumber';

export default (num, precision) => {
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }
  return separateNumber(dropZero(numberFixed(num, precision)));
};

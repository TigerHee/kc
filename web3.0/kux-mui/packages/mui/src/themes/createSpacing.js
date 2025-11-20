/**
 * Owner: victor.ren@kupotech.com
 */
export default (spacingInput = 4) => {
  return (num) => {
    if (typeof num !== 'number') {
      throw new Error('num must be number');
    }
    return Number(num * spacingInput);
  };
};

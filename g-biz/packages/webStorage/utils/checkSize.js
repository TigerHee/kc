/**
 * Owner: garuda@kupotech.com
 */
const maxChars = 150 * 1024; // 150KB

const checkStrLength = (value, maxStrSize = maxChars) => {
  if (!value) return true;
  const transformStr = JSON.stringify(value);
  return transformStr?.length >= maxStrSize;
};
export default checkStrLength;

/**
 * Owner: gavin.liu1@kupotech.com
 */

const SPACE_REG = /\s+/g;
const TELEGRAM_ID_REG = /^[a-zA-Z0-9_]+$/;

export const isTelegramIDValid = (val) => {
  if (!val?.length) {
    return false;
  }
  // we can buy 4 length telegram id
  if (val?.length < 4) {
    return false;
  }
  // not allow include space
  if (SPACE_REG.test(val)) {
    return false;
  }
  // must [a-zA-Z0-9_]
  if (!TELEGRAM_ID_REG.test(val)) {
    return false;
  }
  // cannot start with number or _
  if (/^[0-9_]/.test(val)) {
    return false;
  }
  // cannot end with _
  if (/_$/.test(val)) {
    return false;
  }
  return true;
};

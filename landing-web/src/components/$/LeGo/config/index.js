/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 去除文本回车符
 */
export const getText = (key, contents, toArray = false) => {
  if (!key || !contents || !contents[key]) {
    return toArray ? [] : '';
  }
  if (toArray) {
    return contents[key].split('\n');
  }
  return contents[key].replace(/\n/g, '');
};

export const IMG_WIDTH = {
  '100%': '200%',
  '200%': '100%',
};

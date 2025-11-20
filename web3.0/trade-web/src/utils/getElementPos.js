/**
 * Owner: borden@kupotech.com
 */

/** 获取鼠标相对元素位置 */
const getElementPos = (element, event) => {
  let pos;
  if (element) {
    const bounds = element.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    pos = { x, y };
  }
  return pos;
};

export default getElementPos;

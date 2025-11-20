/**
 * Owner: solar@kupotech.com
 */
let accountSet = {};
export function registAnimateItem(ref, type) {
  accountSet[type] = ref;
}

export function exchangeItems() {
  // 两个动画元素相距的距离(px)
  let yDistance = 0;
  // 在上面的那个动画子元素
  let topItem;
  let bottomItem;
  try {
    yDistance = Array.from(Object.values(accountSet)).reduce((acu, ref) => {
      if (acu === 0) {
        topItem = ref;
        const { top, height } = ref.getBoundingClientRect();
        return top + height / 2;
      }
      const { top, height } = ref.getBoundingClientRect();
      const distance = acu - (top + height / 2);
      if (distance < 0) {
        bottomItem = topItem;
        topItem = ref;
      } else {
        bottomItem = ref;
      }
      return Math.abs(distance);
    }, 0);
  } catch (e) {
    yDistance = 60.5;
  }
  topItem.classList.add('transition');
  bottomItem.classList.add('transition');
  topItem.style.transform = `translateY(-${yDistance}px)`;
  bottomItem.style.transform = `translateY(${yDistance}px)`;
  return new Promise((resolve) => {
    const transitionEnd = () => {
      // 在下一个tick移除样式，避免闪屏
      setTimeout(() => {
        // 解绑事件
        topItem.removeEventListener('transitionend', transitionEnd, false);
        topItem.removeEventListener('webkitTransitionEnd', transitionEnd, false);
        topItem.removeEventListener('oTransitionEnd', transitionEnd, false);
        topItem.removeEventListener('otransitionend', transitionEnd, false);

        topItem.classList.remove('transition');
        bottomItem.classList.remove('transition');
        topItem.style.transform = 'none';
        bottomItem.style.transform = 'none';
        accountSet = {};
        resolve();
      }, 0);
    };
    topItem.addEventListener('transitionend', transitionEnd, false);
    topItem.addEventListener('webkitTransitionEnd', transitionEnd, false);
    topItem.addEventListener('oTransitionEnd', transitionEnd, false);
    topItem.addEventListener('otransitionend', transitionEnd, false);
  });
}

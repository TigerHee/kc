/**
 * Owner: harry.lai@kupotech.com
 */

const bubbleUpEvent = () => {
  const simulateEventClick = new MouseEvent('click', {
    bubbles: true, // 事件冒泡
    cancelable: true,
  });
  document.body.dispatchEvent(simulateEventClick);
};

/** iframe下 处理事件冒泡无法传递到根节点 rc-trigger失效情况  */
const triggerBubbleUpEventFromIframe = (iframeContentDocument) => {
  if (!iframeContentDocument) {
    console.error('triggerBubbleUpEventFromIframe fail, iframeContentDocument is undefined');
    return;
  }
  iframeContentDocument.addEventListener('click', bubbleUpEvent);
};

/** 增强TVWidget能力
 *  增强能力如下：
 *  1.代理tv-iframe事件冒泡穿透
 * @param {*} tvWidgetInstance
 */
export const enhanceTVWidget = (tvWidgetInstance) => {
  triggerBubbleUpEventFromIframe(tvWidgetInstance?._iFrame?.contentDocument);
};

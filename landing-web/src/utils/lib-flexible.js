/**
 * Owner: jesse.shao@kupotech.com
 */
(function flexible(window, document) {
  const docEl = document.documentElement;
  const dpr = window.devicePixelRatio || 1;

  function setRemUnit() {
    let width = Math.min(docEl.clientWidth, docEl.clientHeight);
    if (width / dpr > 540) {
      width = 540 * dpr;
    }
    const rem = 12 * (width / 320);
    if (window.location.pathname.includes('/2024-annual-report') && (width > 500)) return;
    if (width > 1040) return;
    docEl.style.fontSize = `${rem}px`;
  }

  setRemUnit();

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit);
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // detect 0.5px supports
  if (dpr >= 2) {
    const fakeBody = document.createElement('body');
    const testElement = document.createElement('div');
    testElement.style.border = '.5px solid transparent';
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines');
    }
    docEl.removeChild(fakeBody);
  }
}(window, document));

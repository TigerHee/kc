/*
 * @owner: borden@kupotech.com
 */
export default function pushTo(jumpUrl) {
  const newWindow = window.open(jumpUrl);
  if (newWindow) newWindow.opener = null;
}

export function setPush(fn) {
  /* eslint-disable-next-line no-func-assign */
  pushTo = fn;
}

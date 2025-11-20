/**
 * Owner: willen@kupotech.com
 */
export default function* waitFor(selector, { select, take }) {
  if (yield select(selector)) {
    return select(selector);
  }
  while (true) {
    yield take('*');
    if (yield select(selector)) {
      return select(selector);
    }
  }
}

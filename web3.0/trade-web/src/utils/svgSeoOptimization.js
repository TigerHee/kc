/**
 * Owner: borden@kupotech.com
 */
// 解决svg sprite中含有的"支银微"文字在google搜索结果中出现的问题
const el = document.createElement('div');
el.setAttribute('data-nosnippet', true);
if (window.__SVG_SPRITE__) {
  document.body.insertBefore(el, document.body.childNodes[0]);
  el.appendChild(window.__SVG_SPRITE__.node);
}

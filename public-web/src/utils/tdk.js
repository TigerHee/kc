/**
 * Owner: ella.wang@kupotech.com
 */

export function getTDKFromHtml() {
  const title = document.title;
  const metaDesNode = document.querySelector('meta[name="description"]');
  const tdk = {
    title: title,
  };
  if (metaDesNode) {
    tdk.description = metaDesNode.getAttribute('content') || '';
  }
  const metaKeywordsNode = document.querySelector('meta[name="keywords"]');
  if (metaKeywordsNode) {
    tdk.keywords = metaKeywordsNode.getAttribute('content') || '';
  }
  return tdk;
}

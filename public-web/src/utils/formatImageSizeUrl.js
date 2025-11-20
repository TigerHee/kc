/**
 * Owner: willen@kupotech.com
 */
// 只处理 kucoin-cms S3 桶的资源
const urlPrefix = 'https://assets.staticimg.com/cms/media/';

const formatImageSizeUrl = (url, size) => {
  // 校验 size
  if (!/\d+x\d+/.test(size)) {
    return url;
  }
  if (url.startsWith(urlPrefix)) {
    return `${url}?d=${size}`;
  }
  return url;
};

export default formatImageSizeUrl;

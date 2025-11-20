/**
 * Owner: Chelsey.Fan@kupotech.com
 */
const { langHandle } = require('../constants');
const { ImgConf } = require('./constants');
const getNotBrandTitle = require('@utils/get-not-brand-title');
const { newToOld } = require('@scripts/langs/new');
/**
 * TDK 获取的信息
 * @typedef {{title: string, description: string, keyword: string}} TDKInfoType
 */

/**
 * 基于TDK的数据，增加 title、description、keywords 标签
 * @param { TDKInfoType } tdkInfo
 */
const addTDKInfo = tdkInfo => {
  const { title, description, keyword } = tdkInfo || {};
  return `<title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${keyword}" />
  `;
};

const twitterConfName = '__twitter';
/**
 * Twitter Meta
 * @param {TDKInfoType} tdkInfo
 * @param {React<any, any>} conf
 */
const addTwitterMeta = (tdkInfo, conf) => {
  const useConf = { ...ImgConf, ...((conf && conf[twitterConfName]) || {}) };
  const { account, img, card } = useConf;
  const { title, description } = tdkInfo;
  return `<meta name="twitter:card" content="${card}">
  <meta name="twitter:site" content="${account}" />
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${img}">
  <meta name="twitter:image:src" content="${img}">
  <meta property="twitter:image:alt" content="${title}">
  `;
};

const canonicalConfName = '__canonical';
/**
 * Canonical Meta
 * @param {TDKInfoType} tdkInfo
 * @param {React<any, any>} conf
 */
const addCanonicalMeta = (tdkInfo, conf) => {
  const { url } = conf || {};
  return `<link rel="canonical" href="${url}" data-react-helmet="true"/>`;
};

const hreflangConfName = '__hreflang';
/**
 * Hreflang Meta
 * @param {TDKInfoType} tdkInfo
 * @param {React<any, any>} conf
 */
const addHreflangMeta = (tdkInfo, conf) => {
  const { url } = conf || {};
  const useConf = { ...ImgConf, ...((conf && conf[hreflangConfName]) || {}) };
  // urls: {url: string, lang: string}[]
  const { urls, defaultUrl = {} } = useConf;
  const urlText = (urls || []).reduce((res, { url: alternateUrl, lang }) => {
    res += `<link rel="alternate" href="${alternateUrl}" hreflang="${langHandle(
      lang
    )}" data-react-helmet="true">\n`;
    return res;
  }, '');
  return `${urlText}<link rel="alternate" href="${
    defaultUrl.url || url
  }" hreflang="x-default" data-react-helmet="true">`;
};

// 添加 loadingCSS样式
const addLoadingCss = () => {
  const tempCSS = `
  <style>
    .loading-lcp-e2eb6a85de39a3d76e5d {
      height: 100%;
      width: 100%;
      position: fixed;
      z-index: 12;
      top: 0;
      left: 0;
      background-color: rgba(18, 18, 18, 1);
    }
    .loading-center-e2eb6a85de39a3d76e5d {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .loading-center-absolute-e2eb6a85de39a3d76e5d {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .loading-center-absolute-e2eb6a85de39a3d76e5d img {
      width: 200px;
      height: 200px;
    }
  </style>
`;
  return tempCSS.replace(/\s+/g, ' ').trim();
};
// og 便签需要对部分标签做一些特殊处理
const ogLangMap = {
  fil_PH: 'tl_PH',
};

const getOgCocaleContent = lang => {
  const fullLang = newToOld[lang];
  return ogLangMap[fullLang] || fullLang;
};

const ogConfName = '__og';
/**
 * Hreflang Meta
 * @param {TDKInfoType} tdkInfo
 * @param {React<any, any>} conf
 * @param {Record<string, string>} middleConf
 */
const addOgMeta = (tdkInfo, conf, middleConf = {}) => {
  const { url, lang, allLangs = [] } = conf || {};
  const useConf = { ...ImgConf, ...((conf && conf[ogConfName]) || {}) };
  const {
    img,
    width,
    height,
    pageType,
    isArticle = false,
    needType = false,
  } = useConf;
  const { title, description } = tdkInfo;
  const { hasOgTitle = false } = middleConf;
  const currentLang = langHandle(lang);
  const ogAlternate = allLangs.reduce((res, langName) => {
    const name = langHandle(langName);
    if (currentLang !== name) {
      res += `\n<meta property="og:locale:alternate" content="${getOgCocaleContent(
        name
      )}" lang="${name}">`;
    }
    return res;
  }, '');
  let articleMeta = '';
  if (isArticle) {
    articleMeta = `\n<meta property="article:author" content="KuCoin">
    <meta property="article:tag" content="Bitcoin">
    <meta property="article:tag" content="Trading">
    `;
  }
  let ogType = '';
  if (needType) {
    ogType = `\n<meta property="og:type" content="${pageType}">`;
  }
  return `<meta property="og:url" content="${url}" data-react-helmet="true">
  <meta property="og:image" content="${img}" >
  ${
  hasOgTitle
    ? ''
    : `<meta property="og:title" content="${getNotBrandTitle(title)}">`
}${ogType}
  <meta property="og:description" content="${description}">${articleMeta}
  <meta property="og:image:secure_url" content="${img}">
  <meta property="og:image:width" content="${width}" >
  <meta property="og:image:height" content="${height}">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:locale" content="${
  newToOld[currentLang]
}" lang="${currentLang}">${ogAlternate}
  `;
};

const allMiddleWare = [
  addTDKInfo,
  addTwitterMeta,
  addLoadingCss,
  addOgMeta,
  addCanonicalMeta,
  addHreflangMeta,
];

module.exports = {
  addTDKInfo,
  allMiddleWare,
  addTwitterMeta,
  twitterConfName,
  addCanonicalMeta,
  canonicalConfName,
  addHreflangMeta,
  hreflangConfName,
  addOgMeta,
  ogConfName,
};

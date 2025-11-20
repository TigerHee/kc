/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const ArticleJson = loadable(() => System.import('@kucoin-biz/seo'), {
  resolveComponent: (module) => module.ArticleJson,
});

export default ArticleJson;

/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const PaginationLink = loadable(() => System.import('@kucoin-biz/seo'), {
  resolveComponent: (module) => module.PaginationLink,
});

export default PaginationLink;

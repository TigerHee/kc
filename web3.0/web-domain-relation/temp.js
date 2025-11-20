/**
 * 域名自解析方案
 *
 *
 * 1、生成的结构中应该包含所有的dev的配置
 * 2、在上述配置中，动态添加当前域名相关的配置
 * 3、暴露到window
 *
 */



const _KCrelation = {
  /** 入口地址，同文件名 */
  MAIN_HOST: 'https://land-sdb.kucoin.{tld}',
  /** 主站地址 */
  MAINSITE_HOST: 'https://sandbox.kucoin.{tldCN}',
}

const _KMrelation = {

}

function _autoParse(_rela) {
  const curConfig = Object.keys(_rela).reduce((result, key) => {
    return {
      ...result,
      [key]: _rela[key].replace(/\{tld\}/g, '').replace(/\{\}/g)
    }
  }, {});
  return curConfig;
}

function _init() {
  // 当前站点的顶级域名
  const kcRelation = _autoParse(_KCrelation);
  const kmRelation = _autoParse(_KMrelation);


  // 判断当前是否是 非生产 环境
  // const isProd = curTopDomain
}

window._WEB_RELATION_ = _init();

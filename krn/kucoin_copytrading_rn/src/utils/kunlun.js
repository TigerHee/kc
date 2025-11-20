import {init} from '@kc/web-kunlun';

export default (host, siteType) => {
  const formatSiteType = t => {
    switch (t) {
      case 'turkey':
        return 'TR';
      case 'thailand':
        return 'TH';
      default:
        return 'KC';
    }
  };

  init({
    host,
    project: 'kucoin_copytrading_rn', // 当前项目名字
    apis: [], // 需要重点关注的 api
    site: formatSiteType(siteType),
  });
};

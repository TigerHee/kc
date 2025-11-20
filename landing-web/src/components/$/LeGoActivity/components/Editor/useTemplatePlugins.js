/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useEffect, useState } from 'react';
import { customizedSlate } from '@lego-page/utils';

// const TEMPLATE_LIST = [
//   {
//     templateName: '交易竞赛活动模板',
//     id: '6362279ac29008aa2c42e20b',
//     templateCode: 'tradeRank',
//     template: Template1,
//   },
//   {
//     templateName: '币种宣发活动模板',
//     id: '6362279ac29008aa2c42e20c',
//     templateCode: 'coinsPromotion',
//     template: Template2,
//   },
//   {
//     templateName: '大转盘抽奖活动模板',
//     id: '6362279ac29008aa2c42e20d',
//     templateCode: 'lottery',
//     template: Template3,
//   },
//   {
//     templateName: '涨跌幅活动模版',
//     id: '63d77bdac4b55000013ff123',
//     templateCode: 'prophet',
//     template: Template5,
//   },
//   {
//     templateName: '知识竞赛活动模版',
//     id: '63d77bdac4b55000013ffdc6',
//     templateCode: 'quiz',
//     template: Template4,
//   },
//   {
//     templateName: '拉新裂变活动模版',
//     id: '63d77bdac4b55000013ffdc7',
//     templateCode: 'newcomer',
//     template: Template6,
//   },
// ];

const useTemplatePlugins = (templateCode) => {
  const [cellPlugins, setCellPlugins] = useState([]);
  useEffect(() => {
    switch (templateCode) {
      case 'tradeRank':
        import(
          /* webpackChunkName: "p__activity___lego2___template-1" */ '@lego-page/plugins-template-1'
        ).then(({ PluginsTemplate1 }) => setCellPlugins([customizedSlate, PluginsTemplate1]));
        break;
      case 'coinsPromotion':
        import(
          /* webpackChunkName: "p__activity___lego2___template-2" */ '@lego-page/plugins-template-2'
        ).then(({ PluginsTemplate2 }) => setCellPlugins([PluginsTemplate2]));
        break;
      case 'lottery':
        import(
          /* webpackChunkName: "p__activity___lego2___template-3" */ '@lego-page/plugins-template-3'
        ).then(({ PluginsTemplate3 }) => setCellPlugins([customizedSlate, PluginsTemplate3]));
        break;
      case 'quiz':
        import(
          /* webpackChunkName: "p__activity___lego2___template-4" */ '@lego-page/plugins-template-4'
        ).then(({ PluginsTemplate4 }) => setCellPlugins([customizedSlate, PluginsTemplate4]));
        break;
      case 'prophet':
        import(
          /* webpackChunkName: "p__activity___lego2___template-5" */ '@lego-page/plugins-template-5'
        ).then(({ PluginsTemplate5 }) => setCellPlugins([customizedSlate, PluginsTemplate5]));
        break;
      case 'newcomer':
        import(
          /* webpackChunkName: "p__activity___lego2___template-6" */ '@lego-page/plugins-template-6'
        ).then(({ PluginsTemplate6 }) => setCellPlugins([customizedSlate, PluginsTemplate6]));
        break;
      default:
        break;
    }
  }, [templateCode]);
  return cellPlugins;
};

export default useTemplatePlugins;

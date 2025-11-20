/**
 * Owner: melon@kupotech.com
 */
import { _t } from 'src/utils/lang';

export const fixLabel = ({ currentLang }) => {
  let firstWidth = 230;
  let positionY_top = 598 + 10;
  let positionY_bottom = 608 + 32;
  let titleX = 60;
  // 现在的扫码区域文案
  // TODO: 文案后面要换
  // 主文案 千万福利，等你领
  // 副文案 立刻扫码参与活动
  switch (currentLang) {
    case 'zh_CN':
    case 'zh_HK':
    case 'en_US':
    case 'ja_JP':
    case 'ko_KR':
    case 'tr_TR':
    case 'hi_IN':
    case 'th_TH':
    case 'bn_BD':
      // 主副标题都是一行文案
      positionY_top = 610 + 10;
      positionY_bottom = 620 + 20;
      break;
    case 'ru_RU':
    case 'nl_NL':
    case 'fr_FR':
    case 'it_IT':
    case 'id_ID':
    case 'pl_PL':
      // 主标题一行文案
      // 副标题两行文案
      positionY_top = 603 + 10;
      positionY_bottom = 613 + 20;
      break;
    case 'vi_VN':
    case 'fil_PH':
      // 主标题两行文案
      // 副标题一行文案
      positionY_top = 603 + 10;
      positionY_bottom = 613 + 32;
      break;
    case 'pt_PT':
    case 'de_DE':
    case 'es_ES':
    case 'ms_MY':
      // 主标题 副标题都是两行文案
      positionY_top = 598 + 10;
      positionY_bottom = 608 + 32;
      break;
    default:
      break;
  }
  return {
    positionY_top,
    positionY_bottom,
    firstWidth,
    titleX,
  };
};

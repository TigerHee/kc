/**
 * Owner: jesse.shao@kupotech.com
 */
import { _t } from "src/utils/lang";


export const fixLabel = ({ currentLang }) => {
  let positionY_top = 583 + 14;
  let positionY_bottom = 605 + 12;
  let firstWidth = 233;
  let titleX = 55;

  switch (currentLang) {
    case 'fil_PH':
      positionY_top = 596;
      positionY_bottom = 614;
      break;
    case 'it_IT':
    case 'pt_PT':
      firstWidth = 256;
      positionY_top = 596;
      positionY_bottom = 616;
      break;
    case 'ru_RU':
    case 'ja_JP':
    case 'nl_NL':
      firstWidth = 256;
      positionY_top = 583 + 14;
      positionY_bottom = 605 + 12;
      break;
    case 'fr_FR':
    case 'es_ES':
      firstWidth = 260
      positionY_top = 596;
      positionY_bottom = 612;
      break;
    case 'tr_TR':
      positionY_top = 595;
      positionY_bottom = 615;
      break;
    case 'de_DE':
      positionY_top = 583 + 10;
      positionY_bottom = 605 + 8;
      break;
    default:
      break;
  }
  return {
    positionY_top,
    positionY_bottom,
    firstWidth,
    titleX,
  }
}


export const fixBrandLabel = ({ currentLang }) => {
  let positionY_top = 583 + 14;
  let positionY_bottom = 605 + 12;
  let firstWidth = 233;
  let titleX = 55;

  switch (currentLang) {
    case 'fr_FR':
    case 'ru_RU':
      firstWidth = 256;
      positionY_top = 576;
      positionY_bottom = 596;
      break;
    case 'pl_PL':
      firstWidth = 256;
      break;
    case 'it_IT':
      firstWidth = 260;
      positionY_top = 578;
      positionY_bottom = 598;
      break;
    case 'es_ES':
      firstWidth = 256;
      positionY_top = 585;
      positionY_bottom = 605;
      break;
    case 'pt_PT':
      firstWidth = 256;
      positionY_top = 586;
      positionY_bottom = 606;
      break;
    case 'nl_NL':
      positionY_top = 595;
      positionY_bottom = 613;
      firstWidth = 256;
      break;
    case 'ja_JP':
      positionY_top = 595;
      positionY_bottom = 602;
      break;
    case 'de_DE':
      positionY_top =583 + 14;
      positionY_bottom= 605 + 12;
      firstWidth= 256;
      break;
    default:
      break;
  }

  return {
    positionY_top,
    positionY_bottom,
    firstWidth,
    titleX,
  }
};

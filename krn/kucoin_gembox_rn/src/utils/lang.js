/**
 * Owner: roger.chen@kupotech.com
 */
import I18n from 'react-native-i18n';
import en_US from 'locales/en-US';
import zh_CN from 'locales/zh-CN';
import zh_HK from 'locales/zh-HK';
import tr_TR from 'locales/tr-TR';
import ru_RU from 'locales/ru-RU';
import de_DE from 'locales/de-DE';
import bn_BD from 'locales/bn-BD';
import es_ES from 'locales/es-ES';
import fil_PH from 'locales/fil-PH';
import fr_FR from 'locales/fr-FR';
import hi_IN from 'locales/hi-IN';
import id_ID from 'locales/id-ID';
import it_IT from 'locales/it-IT';
import ja_JP from 'locales/ja-JP';
import ko_KR from 'locales/ko-KR';
import ms_MY from 'locales/ms-MY';
import nl_NL from 'locales/nl-NL';
import pl_PL from 'locales/pl-PL';
import pt_PT from 'locales/pt-PT';
import th_TH from 'locales/th-TH';
import vi_VN from 'locales/vi-VN';
import ar_AE from 'locales/ar-AE';

import {DEFAULT_LANG} from 'config/index';

I18n.translations = {
  en_US,
  zh_CN,
  zh_HK,
  tr_TR,
  ru_RU,
  de_DE,
  bn_BD,
  es_ES,
  fil_PH,
  fr_FR,
  hi_IN,
  id_ID,
  it_IT,
  ja_JP,
  ko_KR,
  ms_MY,
  nl_NL,
  pl_PL,
  pt_PT,
  th_TH,
  vi_VN,
  ar_AE,
};

I18n.defaultLocale = DEFAULT_LANG;
I18n.defaultSeparator = '_';
I18n.locale = DEFAULT_LANG;

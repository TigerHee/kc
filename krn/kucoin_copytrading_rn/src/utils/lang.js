import I18n from 'react-native-i18n';

import {DEFAULT_LANG} from 'config';
import ar_AE from 'locales/ar-AE';
import bn_BD from 'locales/bn-BD';
import de_DE from 'locales/de-DE';
import en_US from 'locales/en-US';
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
import ru_RU from 'locales/ru-RU';
import th_TH from 'locales/th-TH';
import tr_TR from 'locales/tr-TR';
import uk_UA from 'locales/uk-UA';
import ur_PK from 'locales/ur-PK';
import vi_VN from 'locales/vi-VN';
import zh_CN from 'locales/zh-CN';
import zh_HK from 'locales/zh-HK';
I18n.translations = {
  de_DE,
  en_US,
  es_ES,
  fr_FR,
  ko_KR,
  nl_NL,
  pt_PT,
  ru_RU,
  tr_TR,
  vi_VN,
  zh_CN,
  zh_HK,
  it_IT,
  id_ID,
  ms_MY,
  hi_IN,
  th_TH,
  ja_JP,
  bn_BD,
  pl_PL,
  fil_PH,
  ar_AE,
  ur_PK,
  uk_UA,
};

I18n.defaultLocale = DEFAULT_LANG;
I18n.defaultSeparator = '_';
I18n.locale = DEFAULT_LANG;

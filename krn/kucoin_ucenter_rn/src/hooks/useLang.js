import {useContext} from 'react';
import {BaseLayoutContext} from '../layouts';
import I18n from 'react-native-i18n';
import * as site from '../site';
import {reportIntlMissing} from 'utils/sentry';

export default () => {
  const {lang, setLang} = useContext(BaseLayoutContext);
  return {
    lang,
    setLang,
    _t: (key, params) => {
      I18n.locale = lang;
      const target = I18n.t(key, {
        brandName: site._BRAND_NAME,
        ...params,
      });

      if (
        !target ||
        (target?.startsWith('[missing') && target?.includes(key))
      ) {
        reportIntlMissing(key);
      }

      return target || key;
    },
  };
};

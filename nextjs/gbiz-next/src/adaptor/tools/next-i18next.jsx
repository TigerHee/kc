import { useTranslation as i18nTranslation, Trans as I18nTrans } from 'react-i18next';
import { LocaleProvider } from './i18n';

export const useTranslation = (ns, options) => {
  const { t: _t, ...props } = i18nTranslation(ns, options);
  return {
    ...props,
    t: (key, variables = {}, tOptions = {}) =>
      _t(key, variables, tOptions),
  };
};

export function Trans({ children, tOptions = {}, values = {}, ...props }) {
  const mergedValues = {
    brandName: window._BRAND_NAME_,
    siteBaseCurrency: window._BASE_CURRENCY_ || 'USDT',
    ...values,
  };

  return (
    <I18nTrans
      {...props}
      tOptions={tOptions}
      values={mergedValues}
    >
      {children}
    </I18nTrans>
  );
}

export { LocaleProvider };
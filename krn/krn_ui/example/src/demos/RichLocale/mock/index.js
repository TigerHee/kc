import I18n from 'react-native-i18n';

const lang = 'zh_CN';
I18n.translations = {
  [lang]: {
    'intl.key.test': '{{del}}测试翻译<GET>{{get}}</GET>泰裤辣<POST>{{post}}</POST>测试翻译<TEST>只换标签</TEST><NO>不替换标签</NO>',
  },
};
I18n.defaultLocale = lang;
I18n.defaultSeparator = '_';
I18n.locale = lang;

export const _t = (key, params) => {
  I18n.locale = lang;
  return I18n.t(key, params);
}
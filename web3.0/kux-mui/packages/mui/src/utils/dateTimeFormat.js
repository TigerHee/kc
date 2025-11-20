import { RTL_Langs } from 'config/index';

const defaultOptions = {
  year: 'numeric',
  // month: 'numeric',
  // day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
  day: '2-digit',
  month: '2-digit',
};

// RTL替换代替语种
export default function DateTimeFormat({ lang = 'en_US', date, options = {} }) {
  try {
    const _options = { ...defaultOptions, ...options };
    const datestring = new Date(date).valueOf();
    const _lang = (RTL_Langs.includes(lang) ? 'ar_AE' : lang).replace('_', '-');
    const dateTimeFormat = new Intl.DateTimeFormat(_lang, _options);
    const _datestring = dateTimeFormat.format(datestring);
    if (lang === 'en_US' || RTL_Langs.includes(lang)) {
      return _datestring.replace(',', '');
    }
    return _datestring;
  } catch (e) {
    return date;
  }
}

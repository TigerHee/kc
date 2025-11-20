/**
 * Owner: odan.ou@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { replace } from 'lodash';
import { _t } from 'tools/i18n';

const CouponTypeList = [
  {
    label: _t('2fLZJiX1dXqdzDMJUuHZ17'), // '全部',
    value: '',
  },
  {
    label: _t('assets.margin.bonus.inuse'), // '使用中',
    value: 'USING',
  },
  {
    label: _t('assets.margin.bonus.state.willuse'), // '待使用',
    value: 'UNUSE',
    filter: ['UNUSE', 'INIT'],
  },
  {
    label: _t('assets.margin.bonus.state.willuse'), // '待使用',
    value: 'INIT',
    show: false,
  },
  {
    label: _t('assets.margin.bonus.state.allused'), // 已用完
    value: 'FINISH',
  },
  {
    label: _t('marginBonus.status.expired'), // 已过期
    value: 'EXPIRED',
    filter: ['EXPIRED', 'INVALID'],
  },
  {
    label: _t('marginBonus.status.expired'), // 已过期
    value: 'INVALID',
    show: false,
  },
];

export const CouponTypes = CouponTypeList.filter((item) => item.show !== false);

export const CouponTypesHash = CouponTypeList.reduce((res, item) => {
  res[item.value] = item;
  return res;
}, {});

export const getLabel = (value) => {
  return {
    title: CouponTypesHash[value]?.label || '',
    isUsing: value === 'USING',
  };
};

export const orderTypes = ['using', 'unuse', 'finish', 'expired', 'invalid'];

export const DayTimeFormatOptions = {
  second: undefined,
};

export const formatDateTime = ({ time, currentLang, options = {} }) => {
  const lang = replace(currentLang, '_', '-');

  const dateTimeFormat = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h24',
    ...options,
  });
  return dateTimeFormat.format(time);
};

export function DateTimeFormat({ children, options = {} }) {
  const { currentLang } = useLocale();
  return formatDateTime({
    options,
    currentLang,
    time: children,
  });
}

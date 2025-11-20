/**
 * Owner: ella.wang@kupotech.com
 */
import { _t } from 'tools/i18n';

export const anchors = {
  question1: {
    id: 1,
    key: 'question1',
    title: _t('udJj913B6M8q9zhB6cE9kU'),
  },
  question2: {
    id: 2,
    key: 'question2',
    title: _t('2wByYhPh84KesE11fLPytf'),
  },
  types: {
    id: 3,
    key: 'types',
    title: _t('bZiN55gBNjbhbvxMzPfcDY'),
  },
  question3: {
    id: 4,
    key: 'question3',
    title: _t('rZPWXETmzDK9GA95XDPv86'),
  },
  question4: {
    id: 5,
    key: 'question4',
    title: _t('6jTHmtHwECLmTZQ2tHn6ry'),
  },
  FAQ: {
    id: 6,
    key: 'FAQ',
    title: _t('sow4Ru9Z2LtQUKcMUrh2LA'),
  },
  read: {
    id: 7,
    key: 'read',
    title: _t('aNrYQDGvVJuSAUQgyKy5eQ'),
  },
};

export const getAnchorList = () => {
  const anchorlist = Object.entries(anchors).map(([key, val]) => val);
  anchorlist.sort((a, b) => {
    return a.id - b.id;
  });
  return anchorlist;
};

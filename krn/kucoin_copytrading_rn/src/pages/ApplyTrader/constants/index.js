import descFirstIc from 'assets/applyTrade/desc-first-ic.png';
import descFirstDarkIc from 'assets/applyTrade/desc-first-ic-dark.png';
import descSecondIc from 'assets/applyTrade/desc-second-ic.png';
import descSecondDarkIc from 'assets/applyTrade/desc-second-ic-dark.png';
import descThirdIc from 'assets/applyTrade/desc-third-ic.png';
import descThirdDarkIc from 'assets/applyTrade/desc-third-ic-dark.png';
export * from './reducer';

export const makePrivilegeDescList = ({_t, isDark}) => [
  {
    title: _t('a59dead408044000a9e3'),
    contentList: [
      _t('4844b69bdd7c4000a508', {min: 10, max: 15}),
      _t('9f70351599484000ad1a'),
    ],
    iconSource: !isDark ? descFirstIc : descFirstDarkIc,
  },

  {
    title: _t('72122f6c9a434000a757'),
    contentList: [_t('50715eb07b3a4000ac46'), _t('7295bc0c36ff4000a7d6')],
    iconSource: !isDark ? descSecondIc : descSecondDarkIc,
  },
  {
    title: _t('365f5c6698354000ac27'),
    contentList: [_t('319b5e383c754000adc5'), _t('5c0d60bd1ecb4000abe6')],
    iconSource: !isDark ? descThirdIc : descThirdDarkIc,
  },
];

export const GroupAccountType = {
  Telegram: 'telegram',
  Twitter: 'twitter',
};

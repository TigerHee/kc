export const ShowPnlSwitchType = {
  yield: 'yield',
  profit: 'profit',
};

export const makeShowPnlSwitchList = ({_t}) => [
  {
    label: _t('8ebf0d84dd0a4000ac2d'),
    value: ShowPnlSwitchType.yield,
  },
  {
    label: _t('d4844714affd4000abca'),
    value: ShowPnlSwitchType.profit,
  },
];

export const makeOverViewDatePeriodOptions = ({_t}) => [
  {
    label: _t('36d4dfb1e9454000a4a7', {
      num: 7,
    }),
    value: '7d',
  },
  {
    label: _t('36d4dfb1e9454000a4a7', {
      num: 30,
    }),
    value: '30d',
  },

  {
    label: _t('36d4dfb1e9454000a4a7', {
      num: 90,
    }),
    value: '90d',
  },
];

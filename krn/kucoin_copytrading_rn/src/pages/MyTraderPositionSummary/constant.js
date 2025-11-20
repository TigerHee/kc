export const RANGE_LIST_TYPE = {
  current: 'current',
  history: 'history',
};

export const makeTraderPositionSummaryTabList = ({_t}) => [
  {
    label: _t('7a4ee5e1edd54000afd4'),
    itemKey: RANGE_LIST_TYPE.current,
  },
  {
    label: _t('d27b1a66b7194000ab90'),
    itemKey: RANGE_LIST_TYPE.history,
  },
];

export const MATCH_URL_PARAMS = 'true';

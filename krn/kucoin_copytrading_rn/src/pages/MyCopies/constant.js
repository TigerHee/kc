export const MY_COPY_RENDER_ITEM_TYPE = {
  myTradeCurrent: 'myCopingTradeCurrent', //
  myTradeHistory: 'myCopingTradeHistory', //
  myPositionCurrent: 'myCopingPositionCurrent', //
  myPositionHistory: 'myCopingPositionHistory', //
  myAttention: 'myCopingAttention', //
};

export const RANGE_LIST_TYPE = {
  current: 'current',
  history: 'history',
};

export const MY_COPY_LIST_TYPE = {
  myAttention: 'myAttention',
  myTrader: 'myTrader',
  myPosition: 'myPosition',
};

export const makeMyCopyTabList = ({_t}) => [
  {
    label: _t('8b6015f3209a4000a7ad'),
    itemKey: MY_COPY_LIST_TYPE.myPosition,
    //   children: <CopyTraderList />,
  },
  {
    label: _t('d528d37546a24000a565'),
    itemKey: MY_COPY_LIST_TYPE.myTrader,
    //   children: <Home />,
  },
  {
    label: _t('3a4d4b29a22e4000a8d8'),
    itemKey: MY_COPY_LIST_TYPE.myAttention,
    //   children: <CopyTraderList />,
  },
];

export const makeRangeTabList = ({_t}) => [
  {
    label: _t('7442b2de55fa4000a35d'),
    itemKey: RANGE_LIST_TYPE.current,
  },
  {
    label: _t('84b7de25c70c4000aeb5'),
    itemKey: RANGE_LIST_TYPE.history,
  },
];

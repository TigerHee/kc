export const MY_EARN_LIST_TYPE = {
  historySharing: 'HISTORY_SHARING', // 历史分润
  estimatedPending: 'ESTIMATED_PENDING', // 预计待分润
};

export const makeMyEarnTabList = ({_t}) => [
  {
    label: _t('e01c4f20d8e24000a637'),
    itemKey: MY_EARN_LIST_TYPE.estimatedPending,
  },
  {
    label: _t('53ced8af4e724000aee1'),
    itemKey: MY_EARN_LIST_TYPE.historySharing,
  },
];

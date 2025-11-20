export const RANGE_LIST_TYPE = {
  current: 'current',
  history: 'history',
};

export const makeRangeTabList = _t => [
  {
    label: _t('bc9b32f96dc14000a40f'),
    itemKey: RANGE_LIST_TYPE.current,
  },
  {
    label: _t('5e3a106471e64000a746'),
    itemKey: RANGE_LIST_TYPE.history,
  },
];

export const ProfileTabIdx2TrackIdMap = {
  1: 'overview',
  2: 'position',
  3: 'follower',
};

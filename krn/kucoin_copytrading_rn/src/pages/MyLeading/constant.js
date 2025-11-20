/** 我的带单列表渲染 Item 类型 包含我的当前仓位，我的历史仓位，我的跟单者 */
export const MY_LEADING_RENDER_ITEM_TYPE = {
  myPositionCurrent: 'myLeadPositionCurrent', //
  myPositionHistory: 'myLeadPositionHistory', //
  myFollower: 'myLeadFollowerList', //
};

/** 二级 Tab 当前/历史筛选类型 */
export const RANGE_LIST_TYPE = {
  current: 'current',
  history: 'history',
};

/** 我的带单 一级 Tab 栏类型 */
export const MY_LEADING_LIST_TYPE = {
  myFollower: 'myFollower',
  myPosition: 'myPosition',
};

export const makeMyLeadTabList = ({_t}) => [
  {
    label: _t('eee93a1d48aa4000a9cf'),
    itemKey: MY_LEADING_LIST_TYPE.myPosition,
  },
  {
    label: _t('80091451bf1e4000abff'),
    itemKey: MY_LEADING_LIST_TYPE.myFollower,
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

/** 我的带单 一级 Tab 栏类型 到 埋点参数映射 */
export const MyLeadListType2TrackPayloadMap = {
  [MY_LEADING_LIST_TYPE.myPosition]: {
    blockId: 'myPosition',
    locationId: 'myPositionTab',
  },
  [MY_LEADING_LIST_TYPE.myFollower]: {
    blockId: 'myFollower',
    locationId: 'myFollowerTab',
  },
};

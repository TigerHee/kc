import {MAIN_TAB_KEYS} from 'pages/Main/constant';

import {eventBus, GlobalEventBusType} from 'utils/event-bus';

export const gotoMyCopies = () => {
  eventBus.emit(GlobalEventBusType.SwitchMainTab, MAIN_TAB_KEYS.myCopies);
};

export const gotoMyLead = () => {
  eventBus.emit(GlobalEventBusType.SwitchMainTab, MAIN_TAB_KEYS.myLeading);
};

export const convertTodayList2TotalPnlDate = totalPnlDateList =>
  totalPnlDateList?.map(i => i.totalPnl) || [];

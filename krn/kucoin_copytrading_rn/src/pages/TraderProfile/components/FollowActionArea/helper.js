import {getBaseCurrency} from 'site/tenant';

export const convertProfileInfo2SharePayload = ({
  thirtyDayProfitDetail,
  userAvatarUrl,
  userName,
}) => {
  const {
    totalPnlDate = {},
    thirtyDayPnlRatio,
    thirtyDayPnl,
  } = thirtyDayProfitDetail || {};
  return {
    userAvatarUrl: userAvatarUrl,
    userName: userName,
    lead30DayPnl: thirtyDayPnlRatio,
    lead30DayValue: thirtyDayPnl,
    lead30DayData: totalPnlDate || [],
    tradeSettleCurrency: getBaseCurrency(),
  };
};

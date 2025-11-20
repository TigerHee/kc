import React, {memo} from 'react';

import UserAndAmountCard from 'components/copyTradeComponents/UserAndAmountCard';
import useLang from 'hooks/useLang';

const MyFollowerItem = ({data, isShowCumulativeProfit = false}) => {
  const {_t} = useLang();
  const {
    no,
    nickName,
    avatar,
    copyDays,
    copyPrincipal,
    cumulativeProfitSharingAmount,
    unrealizedProfitSharingAmount,
  } = data || {};

  return (
    <UserAndAmountCard
      no={no}
      firstLineAmount={
        isShowCumulativeProfit
          ? cumulativeProfitSharingAmount
          : unrealizedProfitSharingAmount
      }
      avatar={avatar}
      userName={nickName}
      time={_t('65f3d97895944000aec3', {num: copyDays < 1 ? '<1' : copyDays})}
      copyPrincipal={copyPrincipal}
    />
  );
};

export default memo(MyFollowerItem);

import React, {memo} from 'react';

import UserAndAmountCard from 'components/copyTradeComponents/UserAndAmountCard';
import useLang from 'hooks/useLang';

const MyFollowerItem = ({info = {}}) => {
  const {_t} = useLang();
  const {
    no,
    key,
    nickName,
    avatar,
    copyDays,
    cumulativeProfitSharingAmount,
    copyPrincipal,
  } = info;
  return (
    <UserAndAmountCard
      no={no}
      avatar={avatar}
      firstLineAmount={cumulativeProfitSharingAmount}
      userName={nickName}
      time={_t('65f3d97895944000aec3', {num: copyDays < 1 ? '<1' : copyDays})}
      key={key}
      copyPrincipal={copyPrincipal}
    />
  );
};

export default memo(MyFollowerItem);

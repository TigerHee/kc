import {usePullFollowedTraderBasicList} from 'pages/MyCopies/hooks/usePullFollowedTraderBasicList';
import React, {memo} from 'react';

import {Select} from 'components/Common/Select';
import {PickLeaderAllIcon} from 'components/Common/SvgIcon';
import UserInfoBar from 'components/copyTradeComponents/UserInfo/UserInfoBar';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {safeArray} from 'utils/helper';
import {PickLeaderAllText, userInfoStyles} from './styles';

const makeAllOptionItem = _t => ({
  value: '',
  label: (
    <RowWrap>
      <PickLeaderAllIcon />
      <PickLeaderAllText>{_t('5227efd43a314000a682')}</PickLeaderAllText>
    </RowWrap>
  ),
});

const renderTraderInfoItem = traderInfoItem => {
  const userInfo = {
    nickName: traderInfoItem.nickName,
    avatarUrl: traderInfoItem.avatarUrl,
  };
  return <UserInfoBar userInfo={userInfo} styles={userInfoStyles} />;
};

const LeadTraderPicker = ({rangeValue, style, onChange, value}) => {
  const {list, loading} = usePullFollowedTraderBasicList({rangeValue});
  const {_t} = useLang();

  const options = [makeAllOptionItem(_t)].concat(
    safeArray(list).map(i => ({
      ...i,
      value: i.leadConfigId,
      label: renderTraderInfoItem(i),
    })) || [],
  );

  const renderActiveLabel = activeItem =>
    activeItem?.nickName || activeItem?.value
      ? activeItem?.nickName
      : _t('5227efd43a314000a682');

  return (
    <Select
      style={style}
      loading={loading}
      options={options}
      defaultValue={''}
      value={value}
      onChange={onChange}
      renderActiveLabel={renderActiveLabel}
    />
  );
};

export default memo(LeadTraderPicker);

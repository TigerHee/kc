import React, {memo} from 'react';

import useLang from 'hooks/useLang';
import {formatNumberShow} from 'utils/helper';
import {
  FollowerInfoBox,
  FollowerInfoLabel,
  FollowerInfoValue,
  FollowerInfoWrap,
} from './styles';

const FOLLOW_INFO_LIST = [
  {labelTextKey: 'edf5f34651304000a0d6', key: 'followersSum'},
  {labelTextKey: '1b7bad09e43f4000a792', key: 'followingSum'},
  {labelTextKey: '269e1f2383204000adaf', key: 'alreadyCopyTraders'},
];

const FollowerInfoCard = props => {
  const {_t} = useLang();
  return (
    <FollowerInfoWrap>
      {FOLLOW_INFO_LIST.map((item, idx) => {
        const isLast = idx === FOLLOW_INFO_LIST.length - 1;

        return (
          <FollowerInfoBox key={item.key} isFirst={idx === 0} isLast={isLast}>
            <FollowerInfoLabel>{_t(item.labelTextKey)}</FollowerInfoLabel>
            <FollowerInfoValue>
              {!props[item.key] ? '0' : formatNumberShow(props[item.key], 1)}
            </FollowerInfoValue>
          </FollowerInfoBox>
        );
      })}
    </FollowerInfoWrap>
  );
};

export default memo(FollowerInfoCard);

import React from 'react';
import {TouchableOpacity} from 'react-native';

import {ShareIcon} from 'components/Common/SvgIcon';
import {largeHitSlop} from 'constants/index';
import {useShareTrader} from '../hooks/useShareTrader';

const TraderShare = ({info}) => {
  const {onShare} = useShareTrader({info});

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onShare}
      hitSlop={largeHitSlop}>
      <ShareIcon />
    </TouchableOpacity>
  );
};

export default TraderShare;

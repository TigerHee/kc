import {MY_EARN_LIST_TYPE} from 'pages/MyEarnProfit/constant';
import React from 'react';
import {useTheme} from '@krn/ui';

import {ExclamationIcon} from 'components/Common/SvgIcon';
import useLang from 'hooks/useLang';
import {BannerWrap, TipText} from './styles';

const EarnTipTransKeyByTabValue = {
  [MY_EARN_LIST_TYPE.historySharing]: 'cdd08d72db424000a578',
  [MY_EARN_LIST_TYPE.estimatedPending]: '4d8cc64fef994000aa31',
};

export const EarnTipBanner = ({tabValue}) => {
  const {_t} = useLang();
  const {colorV2} = useTheme();

  const key = EarnTipTransKeyByTabValue[tabValue];

  if (!key) {
    return null;
  }

  return (
    <BannerWrap>
      <ExclamationIcon color={colorV2.primary} />
      <TipText>{_t(key)}</TipText>
    </BannerWrap>
  );
};

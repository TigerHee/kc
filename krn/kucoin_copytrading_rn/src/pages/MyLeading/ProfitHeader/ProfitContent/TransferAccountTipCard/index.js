import {useMemoizedFn} from 'ahooks';
import React from 'react';
import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import walletDarkIcon from 'assets/home/mylead-wallet-dark-ic.png';
import walletIcon from 'assets/home/mylead-wallet-ic.png';
import {LongArrowRightIcon} from 'components/Common/SvgIcon';
import {RouterNameMap} from 'constants/router-name-map';
import {RowWrap} from 'constants/styles';
import {useQuery} from 'hooks/react-query';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {queryLeadAccountBalance} from 'services/copy-trade';
import {ActivityCard, BarWrapper, ContentTitle, LeftIcon} from './styles';

const TransferAccountTipCard = ({hidden}) => {
  const {push} = usePush();
  const {colorV2} = useTheme();
  const {uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  const {_t} = useLang();
  const isLight = useIsLight();
  const {onClickTrackInMainMyLeadPage} = useTracker();
  const {data: leadAccountBalanceResp, isFetched} = useQuery({
    queryFn: async () => await queryLeadAccountBalance(subUID),
    queryKey: [subUID],
    refetchOnMount: true,
    enabled: !!subUID,
  });
  const {minInitAmount} = leadAccountBalanceResp?.data || {};

  const gotoApplyTrader = useMemoizedFn(() => {
    onClickTrackInMainMyLeadPage({
      blockId: 'head',
      locationId: 'transfer',
    });

    push(RouterNameMap.AccountTransfer, {subUID});
  });

  if (hidden || !isFetched) {
    return null;
  }

  return (
    <BarWrapper>
      <ActivityCard onPress={gotoApplyTrader}>
        <RowWrap
          style={css`
            margin-right: 8px;
            flex: 1;
          `}>
          <LeftIcon
            autoRotateDisable
            source={isLight ? walletIcon : walletDarkIcon}
          />

          <ContentTitle numberOfLines={2}>
            {_t('293eceb4db7a4000aec8', {
              amount: minInitAmount,
              symbol: getBaseCurrency(),
            })}
          </ContentTitle>
        </RowWrap>
        <LongArrowRightIcon opacity={1} color={colorV2.text} />
      </ActivityCard>
    </BarWrapper>
  );
};

export default TransferAccountTipCard;

import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {Empty} from '@krn/ui';

import emptyDarkBg from 'assets/home/lead-pos-empty-dark-bg.png';
import emptyBg from 'assets/home/lead-pos-empty-light-bg.png';
import leadPosDarkIc from 'assets/home/lead-position-empty-dark-ic.png';
import leadPosIc from 'assets/home/lead-position-empty-ic.png';
import Button from 'components/Common/Button';
import {ListEmptyContent} from 'components/FlatList/ListEmptyContent';
import {validateLeaderConfigHelper} from 'constants/businessType';
import {RowWrap} from 'constants/styles';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {MY_LEADING_RENDER_ITEM_TYPE} from '../constant';
import {useGotoTransfer} from '../hooks/useGotoTransfer';
import {useLaunchLeadOrder} from '../hooks/useLaunchLeadOrder';
import {usePullLeadConfig} from '../hooks/usePullLeadConfig';
import {usePullMyLeadPnlSummary} from '../hooks/usePullMyLeadPnlSummary';
import {useStore} from '../hooks/useStore';
import {EmptyImg, PositionEmptyCard, TipText} from './styles';

const MyLeadListEmpty = memo(props => {
  const {loading, size} = props;
  const {state} = useStore();
  const {renderCardType} = state;
  const {_t} = useLang();
  const isLight = useIsLight();
  const sufficientInitAmount = useSelector(
    state => state.leadInfo.sufficientInitAmount,
  );
  const {onClickTrackInMainMyLeadPage} = useTracker();
  const gotoTransfer = useGotoTransfer();

  const {launchLeadOrder} = useLaunchLeadOrder();
  const {data} = usePullMyLeadPnlSummary();
  const {minInitAmount, isFetched} = usePullLeadConfig();
  const isUndoing = validateLeaderConfigHelper.isUndoing(data?.leadStatus);

  const launchLeadOrderWithTrack = useMemoizedFn(() => {
    onClickTrackInMainMyLeadPage({
      blockId: 'list',
      locationId: 'goLead',
    });
    launchLeadOrder();
  });
  const gotoTransferWithTrack = useMemoizedFn(() => {
    onClickTrackInMainMyLeadPage({
      blockId: 'list',
      locationId: 'transfer',
    });
    gotoTransfer();
  });

  const isPositionListTab = [
    MY_LEADING_RENDER_ITEM_TYPE.myPositionCurrent,
  ].includes(renderCardType);

  // 仓位列表为空 且不为加载中时
  if (isFetched && isPositionListTab && !loading && size === 0 && !isUndoing) {
    // 是否最低初始资金要求，sufficientInitAmount为 null表示未拉取，此处需全等 false
    if (sufficientInitAmount === false) {
      return (
        <PositionEmptyCard
          source={isLight ? emptyBg : emptyDarkBg}
          imageStyle={{borderRadius: 20}}>
          <EmptyImg
            autoRotateDisable
            source={isLight ? leadPosIc : leadPosDarkIc}
          />
          <TipText>
            {/* //未拉取到minInitAmount 或者minInitAmount为 0 时展示 兜底文案 */}
            {minInitAmount
              ? _t('a135d73107da4000aba6', {
                  amount: minInitAmount,
                  symbol: getBaseCurrency(),
                })
              : _t('10252ea9ce2d4000a220', {symbol: getBaseCurrency()})}
          </TipText>

          <Button type="secondary" size="small" onPress={gotoTransferWithTrack}>
            {_t('3788a94ec8964000a2e8')}
          </Button>
        </PositionEmptyCard>
      );
    }

    return (
      <View
        style={css`
          align-items: center;
          margin: 24px 0 32px;
          flex: 1;
        `}>
        <Empty
          style={css`
            padding-bottom: 16px;
          `}
          text={_t('98c6a11fa8854000a013')}
        />
        <RowWrap>
          <Button onPress={launchLeadOrderWithTrack}>
            {_t('e112fe43b1194000a36a')}
          </Button>
        </RowWrap>
      </View>
    );
  }

  return <ListEmptyContent loading={loading} size={size} />;
});

export default memo(MyLeadListEmpty);

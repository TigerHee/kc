import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {Pressable, View} from 'react-native';
import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {Button} from '@krn/ui';

import clockIc from 'assets/common/ic-clock.png';
import EllipsisText from 'components/Common/EllipsisText';
import {TraderCardUserIc} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import {UserAvatar} from 'components/copyTradeComponents/UserInfo';
import {commonStyles} from 'constants/styles';
import {useGotoProfit} from 'hooks/copyTrade/useGotoProfit';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {FooterProfitAsset} from './components/FooterProfitAsset';
import LineChart from './LineChart';
import {
  AllPersonText,
  ExistPersonText,
  FirstLineWrapper,
  GapLine,
  PnLNumberFormat,
  PnLPercentNumberFormat,
  styles,
  TimeIcon,
  TraderDescAndProfitWrap,
  TraderInfoCardWrap,
  TraderInfoUserIconWrap,
  TraderIntroRowWrap,
  TraderName,
  TraderNameAndUsersWrap,
  userInfoStyles,
} from './styles';

const TraderInfoCard = props => {
  const {
    // hideFollowerProfitAndAssetSize = false,
    /** showLeadAmount 排行榜时需展示带单规模 */
    showLeadAmount = false,
    style,
    info,
    pageId,
    homeNewUI = false,
  } = props;
  const {
    nickName,
    leadConfigId,
    avatarUrl,
    copying,
    maxCopyUserCount,
    currentCopyUserCount,
    thirtyDayPnlRatio,
    thirtyDayPnl,
    followerAum,
    followerPnl,
    totalPnlDate,
    leadAmount,
    daysAsLeader,
  } = info || {};

  const {gotoProfit} = useGotoProfit();
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const {configId: myLeadConfigId} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const isShowViewBtn = leadConfigId === myLeadConfigId || copying;

  const onPressToProfit = useMemoizedFn(() => {
    onClickTrack({
      pageId,
      blockId: 'copyButton',
      locationId: isShowViewBtn ? 'view' : 'copy',
    });
    gotoProfit(info);
  });

  return (
    <TraderInfoCardWrap
      style={style}
      onPress={onPressToProfit}
      homeNewUI={homeNewUI}>
      <FirstLineWrapper homeNewUI={homeNewUI}>
        <UserAvatar
          styles={userInfoStyles}
          userInfo={{
            avatarUrl,
            nickName,
          }}
        />
        <TraderNameAndUsersWrap>
          <EllipsisText
            style={css`
              margin-right: 10px;
            `}>
            <TraderName>{nickName}</TraderName>
          </EllipsisText>
          <TraderIntroRowWrap homeNewUI={homeNewUI}>
            <TraderInfoUserIconWrap>
              <TraderCardUserIc />
            </TraderInfoUserIconWrap>

            <ExistPersonText>{currentCopyUserCount}</ExistPersonText>
            <AllPersonText>/</AllPersonText>
            <AllPersonText>{maxCopyUserCount}</AllPersonText>
            <GapLine />

            <TimeIcon source={clockIc} />
            <AllPersonText>
              {_t('65f3d97895944000aec3', {
                num: daysAsLeader < 1 ? '<1' : daysAsLeader,
              })}
            </AllPersonText>
          </TraderIntroRowWrap>
        </TraderNameAndUsersWrap>

        <Button
          size="mini"
          onPress={onPressToProfit}
          type={isShowViewBtn ? 'secondary' : 'primary'}
          style={styles.copyBtn}>
          {isShowViewBtn
            ? _t('5bd65cbe230b4000a537')
            : _t('a55636e80a484000af90')}
        </Button>
      </FirstLineWrapper>

      <View
        style={[
          commonStyles.flexRowCenter,
          css`
            height: 62px;
            justify-content: space-between;
          `,
        ]}>
        <TraderDescAndProfitWrap>
          <View>
            <TipTrigger
              textStyle={css`
                font-size: 12px;
                font-weight: 400;
              `}
              showUnderLine
              showIcon={false}
              text={`${_t('68a7b4d03da84000a037')} (${getBaseCurrency()})`}
              message={_t('6503d455fe164000aadf')}
            />
          </View>
          <PnLPercentNumberFormat>{thirtyDayPnlRatio}</PnLPercentNumberFormat>
          <PnLNumberFormat isProfitNumber isPositive>
            {thirtyDayPnl}
          </PnLNumberFormat>
        </TraderDescAndProfitWrap>
        <View
          style={css`
            position: relative;
          `}>
          <Pressable
            onPress={onPressToProfit}
            style={css`
              opacity: 0;
              width: 120px;
              z-index: 2;
              height: 50px;
              position: absolute;
            `}
          />
          <LineChart totalPnlDate={totalPnlDate} />
        </View>
      </View>
      <FooterProfitAsset
        showLeadAmount={showLeadAmount}
        leadAmount={leadAmount}
        followerPnl={followerPnl}
        followerAum={followerAum}
        homeNewUI={homeNewUI}
      />
    </TraderInfoCardWrap>
  );
};
export default memo(TraderInfoCard);

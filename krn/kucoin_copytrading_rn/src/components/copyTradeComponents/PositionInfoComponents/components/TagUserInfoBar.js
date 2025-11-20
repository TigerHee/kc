import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {ArrowRightIcon} from 'components/Common/SvgIcon';
import {UserAvatar} from 'components/copyTradeComponents/UserInfo';
import {PositionSideMap} from 'constants/future';
import {useGotoProfit} from 'hooks/copyTrade/useGotoProfit';
import {useGetFuturesInfoBySymbol} from 'hooks/useGetFuturesInfoBySymbol';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {convertPxToReal} from 'utils/computedPx';
import {numberFixed} from 'utils/helper';
import {gotoSymbolKumexMarket} from 'utils/native-router-helper';
import {generateShowMarginModeAndPositionSide} from '../helper';
import {
  RowWrap,
  TagChartColorText,
  TagGap,
  TagText,
  TagUserInfoWrap,
  Title,
  TitleWrap,
  userInfoStyles,
} from '../styles';
import PositionShare from './PositionShare';
import {TagUserBarWrap} from './styles';

const TagUserInfoBar = ({
  blockId,
  info,
  positionLeadUserInfo,
  isMyFollowPosition,
  isHistory = false,
  // 头像不可点击 进入详情页 （用于交易员详情页面仓位展示不需要点击）
  avatarNotPress = false,
  //分享海报场景，用于分享海报时的场景区分 需求底部按钮文案
  sharePostScene,
}) => {
  const {symbol, positionSide, marginMode, leverage, startTime} = info;
  const {showSymbolText} = useGetFuturesInfoBySymbol(symbol) || {};
  const {dateTimeFormat} = useLang();
  const {colorV2} = useTheme();
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const {gotoProfit} = useGotoProfit();

  const gotoSymbolPage = useMemoizedFn(() => {
    onClickTrack({
      blockId,
      locationId: 'symbol',
    });
    gotoSymbolKumexMarket(symbol);
  });

  const {showPositionSide, showMarginMode} =
    generateShowMarginModeAndPositionSide(_t, {
      positionSide,
      marginMode,
    });

  const gotoTraderProfit = () => {
    if (avatarNotPress || !positionLeadUserInfo?.leadConfigId) return;

    gotoProfit({
      leadConfigId: positionLeadUserInfo?.leadConfigId,
    });
  };

  // unicode强制交易对不反转
  const symbolNameText = `\u202D${showSymbolText}\u202C`;

  return (
    <View>
      <TitleWrap>
        <TouchableOpacity activeOpacity={0.8} onPress={gotoSymbolPage}>
          <RowWrap>
            <Title>{symbolNameText}</Title>
            <ArrowRightIcon sizeNumber={16} opacity={1} color={colorV2.text} />
          </RowWrap>
        </TouchableOpacity>
        <PositionShare
          info={info}
          positionLeadUserInfo={positionLeadUserInfo}
          isMyFollowPosition={isMyFollowPosition}
          blockId={blockId}
          sharePostScene={sharePostScene}
        />
      </TitleWrap>
      <TagUserInfoWrap>
        <TagChartColorText
          style={css`
            max-width: ${convertPxToReal(40)};
          `}
          isLong={positionSide === PositionSideMap.Long}>
          {showPositionSide}
        </TagChartColorText>
        <TagGap />
        <TagText
          style={css`
            max-width: ${convertPxToReal(90)};
          `}
          numberOfLines={2}>
          {showMarginMode}
          {leverage ? ` ${numberFixed(leverage, 2)}X` : ''}
        </TagText>

        <TagGap />
        {!isHistory ? (
          <>
            <TagText
              style={css`
                max-width: ${convertPxToReal(70)};
              `}
              numberOfLines={1}>
              {dateTimeFormat(startTime, {
                options: {
                  year: undefined,
                  second: undefined,
                },
              })}
            </TagText>
            <TagGap />
          </>
        ) : null}
        <TagUserBarWrap
          style={css`
            width: auto;
            max-width: ${convertPxToReal(90)};
            margin-right: ${convertPxToReal(4)};
          `}
          onPress={gotoTraderProfit}>
          <TagText
            style={css`
              width: auto;
              max-width: ${convertPxToReal(76)};
              margin-right: ${convertPxToReal(4)};
            `}
            numberOfLines={1}>
            {positionLeadUserInfo.nickName}
          </TagText>
          <View>
            <UserAvatar
              styles={userInfoStyles}
              userInfo={positionLeadUserInfo}
            />
          </View>
        </TagUserBarWrap>
      </TagUserInfoWrap>
    </View>
  );
};

export default memo(TagUserInfoBar);

import {useMemoizedFn} from 'ahooks';
import {useSelector} from 'react-redux';

import {SUPPORT_SHARE_V2_MIN_APP_VERSION} from 'constants/version';
import {useShare} from 'hooks/copyTrade/useShare';
import {useGetFuturesInfoBySymbol} from 'hooks/useGetFuturesInfoBySymbol';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import {useIsVersionGreater} from 'hooks/useIsVersionGreater';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {getDigit} from 'utils/helper';
import {getUserShowFullName} from 'utils/user';
import {convertPositionInfo2SharePayload} from '../helper';
export const useMakePositionSharePayload = ({
  info,
  positionLeadUserInfo,
  blockId,
  isMyFollowPosition,
  //分享海报场景，用于分享海报时的场景区分 需求底部按钮文案
  sharePostScene,
}) => {
  const {numberFormat, _t} = useLang();
  const {symbol} = info;
  const {displayPrecision} = useGetUSDTCurrencyInfo();
  const {tickSize, showSymbolText} = useGetFuturesInfoBySymbol(symbol);
  const {handlePositionShare} = useShare({sharePostScene});
  const symbolPrecision = getDigit(tickSize);
  const {onClickTrack} = useTracker();
  const checkVersionGreater = useIsVersionGreater();

  const userInfo = useSelector(state => state.app.userInfo);

  const {nickName} = positionLeadUserInfo || {};

  const shareLaunchUserInfo = {
    avatarUrl: !isMyFollowPosition
      ? positionLeadUserInfo?.avatarUrl
      : userInfo?.avatar,
    nickName: !isMyFollowPosition
      ? positionLeadUserInfo?.nickName
      : getUserShowFullName(userInfo),
  };

  const onSharePosition = useMemoizedFn(() => {
    onClickTrack({
      blockId,
      locationId: 'positionShare',
    });
    // 我是跟单员分享仓位时 userDesc为带单员名字 否则为空
    const userDesc = isMyFollowPosition
      ? checkVersionGreater(SUPPORT_SHARE_V2_MIN_APP_VERSION)
        ? nickName
        : _t('0f02de8266a64000a500')
      : undefined;

    handlePositionShare(
      convertPositionInfo2SharePayload(
        {info, userDesc, shareLaunchUserInfo, showSymbolText},
        {numberFormat, symbolPrecision, displayPrecision},
      ),
    );
  });

  return {
    onSharePosition,
  };
};

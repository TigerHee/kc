/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-07 11:57:26
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 20:20:44
 */
import styled from '@emotion/styled';
import { memo, useMemo } from 'react';

import LottieProvider from 'src/components/LottieProvider';
import { useIsH5 } from 'src/hooks/useDeviceHelper';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';

import { cx } from '@emotion/css';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';
import {
  GainPrizeTitle,
  PrizeImgWrapper,
  SharedRewardDescWrap,
  sharedRewardItemScaleFadeAnimation,
  SharedRewardItemWrap,
  SharedRewardListWrap,
  SharedRewardSizeDescWrap,
  TaskContentWrapper,
} from './styled';

const PrizeLightAnimation = styled(LottieProvider)`
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 140px;
`;

const PrizeItem = memo(({ prizeInfo, isMockScene = false }) => {
  const coinCategories = useSelector((state) => state.categories);
  const { currency, earnedPoints, amount } = prizeInfo || {};
  const fallbackEntity = isMockScene ? coinCategories?.['BTC'] || {} : {};
  const { iconUrl, currencyName } = coinCategories?.[currency] || fallbackEntity;

  return (
    <SharedRewardItemWrap
      className={cx('prize-item-wrap', !isMockScene && sharedRewardItemScaleFadeAnimation)}
    >
      <PrizeImgWrapper className="mr-16">
        <img src={iconUrl} alt="coin" className="coin-img" />
        {!isMockScene && (
          <PrizeLightAnimation iconName="slothub_prize_popup_bubble_bg_light" speed={1} loop={1} />
        )}
      </PrizeImgWrapper>
      <section className="reward-info">
        <SharedRewardDescWrap>
          <p className="symbol">{currencyName}</p>
          <p>
            {_t('aeed5463558f4000af49')}
            <span className="amount">
              <NumberFormat> {earnedPoints}</NumberFormat>
            </span>
          </p>
        </SharedRewardDescWrap>
        <SharedRewardSizeDescWrap>
          <p className="coin-amount">
            <NumberFormat>{amount}</NumberFormat>
          </p>
          <p>{_t('d6d7d8b319514000a88c', { coin: currencyName })}</p>
        </SharedRewardSizeDescWrap>
      </section>
    </SharedRewardItemWrap>
  );
});

export const SharedPrizeList = ({ prizes, className, isMockScene = false }) => {
  const isH5 = useIsH5();

  const enableScroll = useMemo(() => {
    if (isH5 && prizes.length > 4) return true;
    return prizes.length > 8;
  }, [prizes, isH5]);

  const isSinglePrize = prizes.length === 1;

  return (
    <SharedRewardListWrap
      isSinglePrize={isSinglePrize}
      enableScroll={enableScroll}
      className={className}
      isMockScene={isMockScene}
    >
      {prizes.map((info, index) => {
        return (
          <PrizeItem prizeInfo={info} isMockScene={isMockScene} key={`projectIcon_${index}`} />
        );
      })}
    </SharedRewardListWrap>
  );
};
/** 瓜分奖励内容容器 */
const SharedRewardContent = ({ prizes }) => {
  return (
    <TaskContentWrapper>
      <GainPrizeTitle>{_t('97d965ca48344000a78f')}</GainPrizeTitle>
      <GainPrizeTitle>{_t('4d724a54df814000aad4')}</GainPrizeTitle>

      <SharedPrizeList prizes={prizes} />
    </TaskContentWrapper>
  );
};

export default SharedRewardContent;

/*
 * @Author: harry.lai harry.lai@kupotech.com
 * @Date: 2024-05-13 10:29:59
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-14 18:25:48
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/TWAPDetailModal/components/TwapRunStatusHeader.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Owner: harry.lai@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { _t } from 'utils/lang';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import { TWAP_PROCESS_STATUS } from '@/pages/Orders/Common/OrderConfig';
import { TIP_TEXT_STATUS_MAP } from '../../OrderListCommon/TwapProcessTip/constants';
import { AnimationPoint } from '../../OrderListCommon/TwapProcessTip/index.styles';
import { convertSecondsToHMS } from '../../presenter/time-util';
import {
  PauseLabel,
  TimeTextWrap,
  TimeText,
  Wrap,
  SymbolTextWrap,
  SymbolIcon,
} from './TwapRunStatusHeader.style';

export const TwapRunStatusHeader = ({ symbol, status, usedDurationSec, className }) => {
  const coinCategories = useSelector((state) => state.categories);
  const coin = symbol?.split('-')?.[0];
  const { iconUrl } = coinCategories?.[coin] || {};
  const isPaused = status === TWAP_PROCESS_STATUS.PAUSED;
  const isFinish = [TWAP_PROCESS_STATUS.CANCELLED, TWAP_PROCESS_STATUS.COMPLETED].includes(status);

  const [hour, min, sec] = convertSecondsToHMS(usedDurationSec);

  if ([usedDurationSec, status, symbol].includes(undefined)) return null;

  return (
    <Wrap className={className}>
      <section className="flex-center">
        <SymbolIcon src={iconUrl} alt="coin-icon" />

        <SymbolTextWrap>
          <SymbolCodeToName code={symbol} />
        </SymbolTextWrap>
        {isPaused && <PauseLabel>{TIP_TEXT_STATUS_MAP.PAUSED}</PauseLabel>}
      </section>

      <TimeTextWrap>
        <AnimationPoint isPaused={isPaused} isDisabled={isFinish} />
        <TimeText isDisabled={isFinish} isPaused={isPaused}>
          {_t('3HEkUnPpKiTvCeRLyECuAF', {
            hour,
            min,
            sec,
          })}
        </TimeText>
      </TimeTextWrap>
    </Wrap>
  );
};

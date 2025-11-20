/*
 * @Author: harry.lai harry.lai@kupotech.com
 * @Date: 2024-05-13 10:29:59
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-14 18:24:35
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/OrderListCommon/TwapProcessTip/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Owner: harry.lai@kupotech.com
 */
import React, { useCallback, memo } from 'react';
import { _t } from 'utils/lang';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';
import { TIP_TEXT_STATUS_MAP, TWAP_INPROGRESS_STATUS } from './constants';
import { LIVE_TIME_SCENE, useTwapLiveTimeHelper } from '../../hooks/useTwapLiveTimeHelper';
import {
  AnimationPoint,
  InfoIcon,
  StyledTooltip,
  RunStatusWrap,
  TipTitle,
  TipText,
} from './index.styles';
import { useToggle } from 'ahooks';
import TwapProcessTipDialog from './TwapProcessTipDialog';
import { convertSecondsToHMS } from '../../presenter/time-util';

const TooltipContent = ({ usedDurationSec, status, isPaused }) => {
  const [hour, min, sec] = convertSecondsToHMS(usedDurationSec);

  return (
    <div className="fs-12">
      <RunStatusWrap>
        <AnimationPoint isPaused={isPaused} />

        <TipTitle isPaused={isPaused}>{TIP_TEXT_STATUS_MAP[status]}</TipTitle>
      </RunStatusWrap>
      <TipText>
        {_t('8JsG3EXdtVjxEiSpw9LcCh', {
          hour,
          min,
          sec,
        })}
      </TipText>
    </div>
  );
};

const TwapProcessTip = ({ status, usedDurationSec }) => {
  const isShowTip = [TWAP_INPROGRESS_STATUS.PENDING, TWAP_INPROGRESS_STATUS.PAUSED].includes(
    status,
  );
  const isPaused = status === TWAP_INPROGRESS_STATUS.PAUSED;

  const isMobile = useIsH5();

  const [visible, { toggle }] = useToggle();

  const handleOpenTipDialog = useCallback(() => isMobile && toggle(), [isMobile, toggle]);

  if (!isShowTip) return null;

  return (
    <>
      <StyledTooltip
        open={isMobile ? false : undefined}
        title={
          <TooltipContent
            usedDurationSec={usedDurationSec}
            status={status}
            isPaused={isPaused}
          />
        }
        maxWidth={172}
      >
        <InfoIcon onClick={handleOpenTipDialog} isPaused={isPaused} />
      </StyledTooltip>
      {isMobile && (
        <TwapProcessTipDialog
          visible={visible}
          toggle={toggle}
          usedDurationSec={usedDurationSec}
          status={status}
        />
      )}
    </>
  );
};

export default memo(TwapProcessTip);

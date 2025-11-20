/**
 * Owner: garuda@kupotech.com
 */
import React, { Fragment, useCallback } from 'react';

import { QuestionTooltipWrapper, TooltipTextWrapper, IconWrapper } from './style';

import { _t, trackClick, FUTURES_ORDER_EXPLAIN } from '../../builtinCommon';

import { useIntroduceProps } from '../../hooks/useIntroduceProps';

const IntroTips = React.memo(({ defaultKey = 'advancedLimit' }) => {
  const { openIntroduce } = useIntroduceProps();

  const handleOpenIntroduce = useCallback(() => {
    openIntroduce(defaultKey);
    // 埋点
    trackClick([FUTURES_ORDER_EXPLAIN, '1']);
  }, [defaultKey, openIntroduce]);

  return (
    <Fragment>
      <QuestionTooltipWrapper
        disabledOnMobile
        title={
          <TooltipTextWrapper onClick={handleOpenIntroduce}>
            {_t('uRTwhTVDwDn1eZSe4vXomS')}
          </TooltipTextWrapper>
        }
      >
        <IconWrapper
          size={14}
          onClick={handleOpenIntroduce}
          className="horizontal-flip-in-arabic"
        />
      </QuestionTooltipWrapper>
    </Fragment>
  );
});

export default IntroTips;

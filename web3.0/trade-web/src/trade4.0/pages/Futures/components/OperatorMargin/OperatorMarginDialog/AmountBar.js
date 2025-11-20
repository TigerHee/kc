/**
 * Owner: garuda@kupotech.com
 * 最大可提/最大可追加 金额展示
 */
import React, { useCallback } from 'react';

import { styled } from '@/style/emotion';
import { ICQuestionOutlined } from '@kux/icons';

import { trackClick } from 'src/utils/ga';
import { ADJUST_MARGIN, SK_REDUCER_KEY } from '@/meta/futuresSensors/withdraw';

import { useIsRTL } from '@/hooks/common/useLang';

import Tooltip from '@mui/Tooltip';
import PrettyCurrency from '@/components/PrettyCurrency';

const AmountWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .pretty-currency  {
    font-size: 14px;
    font-weight: 500;
    line-height: 130%;
    color: ${(props) => props.theme.colors.text};
  }
`;

const TooltipBox = styled.div`
  display: flex;
  align-items: center;
  > span {
    height: 14px;
  }
  .operator-tips {
    margin-right: 2px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
    height: unset;
    color: ${(props) => props.theme.colors.text40};
  }
  svg {
    font-size: 14px;
    color: ${(props) => props.theme.colors.icon60};
    cursor: help;
    transform: ${(props) => (props.isRtl ? 'scaleX(-1)' : 'unset')};
  }
`;

const AmountBar = ({ currency, amount, tooltip, modalTitle, children }) => {
  const isRtl = useIsRTL();
  // 埋点
  const handleClose = useCallback(() => {
    trackClick([ADJUST_MARGIN, '4'], { MarginDirection: SK_REDUCER_KEY });
  }, []);

  return (
    <>
      <AmountWrapper>
        <TooltipBox isRtl={isRtl}>
          {children}
          {tooltip ? (
            <Tooltip
              placement="top"
              title={tooltip}
              modalTitle={modalTitle}
              onClose={handleClose}
            >
              <ICQuestionOutlined />
            </Tooltip>
          ) : null}
        </TooltipBox>
        <PrettyCurrency currency={currency} value={amount} />
      </AmountWrapper>
    </>
  );
};

export default React.memo(AmountBar);

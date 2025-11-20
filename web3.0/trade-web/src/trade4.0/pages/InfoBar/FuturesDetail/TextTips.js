/**
 * Owner: clyne@kupotech.com
 */
import React, { Fragment } from 'react';
import Tooltip from '@/components/mui/Tooltip';
import clsx from 'clsx';
import { map, isArray } from 'lodash';

import { styled } from '@/style/emotion';

import { useIsRTL } from '@/hooks/common/useLang';

const TextTipBox = styled.div`
  &.bigNumberRTLWrapper {
    display: flex;
    .pretty-currency {
      display: inherit;
    }
  }
`;

const Line = () => <div className="line">/</div>;

export const Tips = ({ header, tips = null }) => {
  const tipsArr = isArray(tips) ? tips : [tips];
  const headers = isArray(header) ? header : [header];
  return (
    <div className="header-box">
      {map(headers, (item, index) => {
        const tip = tipsArr[index];
        const isLast = index === headers.length - 1;
        if (tip) {
          const overlay = <div className="text-overlay">{tip}</div>;
          return (
            <Fragment key={index}>
              <Tooltip placement="top" title={overlay}>
                <div className="text-header">{item}</div>
              </Tooltip>
              {isLast ? null : <Line />}
            </Fragment>
          );
        } else {
          return (
            <Fragment key={index}>
              <div className="text-header noTips">{item}</div>
              {isLast ? null : <Line />}
            </Fragment>
          );
        }
      })}
    </div>
  );
};

const TextTips = ({ header, tips, value, className }) => {
  const isRTL = useIsRTL();

  return (
    <div className={'text-tips ticker-item'}>
      <Tips tips={tips} header={header} />
      <TextTipBox isRTL={isRTL} className={clsx("text-value", className)}>{value}</TextTipBox>
    </div>
  );
};

export default TextTips;

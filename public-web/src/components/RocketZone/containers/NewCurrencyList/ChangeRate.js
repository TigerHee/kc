/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat, styled } from '@kux/mui';
import SvgIcon from 'components/common/KCSvgIcon';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

const STATUS = {
  UP: 'up',
  DOWN: 'down',
};

const SIZES = {
  sssm: `{
    font-size: 10px !important;
  }`,
  ssm: `{
    font-size: 12px;
  }`,
  sm: `{
    font-size: 12px;
    >svg {
      width: 6px;
    }
  }`,
  s2m: `{
    font-size: 12px;
  }`,
  md: `{
    font-size: 14px;
  }`,
  m2d: `{
    font-size: 16px;
  }`,
  lg: `{
    font-size: 18px;
  }`,
  xl: `{
    font-size: 20px;
  }`,
  x2l: `{
    font-size: 24px;
  }`,
};

const ChangeRateBG = styled.div`
  display: flex;
  align-items: center;
  height: 15px;
  border-radius: 4px;
  padding: 1px 2px;
  background: #1d1d1d0a;
  &[data-status='up'] {
    background: #01bc8d14;
  }
  &[data-status='down'] {
    background: #f6545414;
  }
`;

const ChangeRateSpan = styled.span`
  font-size: 16px !important;
  font-weight: 500;
  &.is14px {
    font-weight: 600;
    font-size: 14px !important;
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px !important;
  }
  color: ${({ theme }) => theme.colors.text60};
  &[data-status='up'] {
    color: ${({ theme }) => theme.colors.primary};
  }
  &[data-status='down'] {
    // color: ${({ theme }) => theme.colors.secondary};
    color: #f65454;
  }
  > svg {
    margin-left: 4px;
    vertical-align: 2px;
    [dir='rtl'] & {
      margin-right: 4px;
    }
  }
  > span {
  }
  ${(() => {
    const sizes = [];
    _.each(SIZES, (tpl, key) => {
      sizes.push(`
  &[data-size="${key}"] ${tpl}
      `);
    });
    return sizes.join('\n');
  })()};
`;

// 防止 Warning: Invalid prop `data-status`
const DummyContainer = React.memo(({ children }) => <>{children}</>);

/**
 * @description: 涨跌幅显示  0 显示0.00%
 * @return {*}
 */
const ChangeRate = ({
  value,
  decimal = 2,
  color,
  size = 'md',
  style,
  isShowArrawIcon = false,
  is14px,
  needBg = false,
  ...restProps
}) => {
  const [status, setStatus] = useState(null);
  const { currentLang } = useLocale();

  useEffect(() => {
    if (color) {
      setStatus(null);
      return;
    }
    let status;
    if (0 < +value) {
      status = STATUS.UP;
    } else if (0 > +value) {
      status = STATUS.DOWN;
    }
    setStatus(status);
  }, [value, color]);

  const mergedStyle = useMemo(() => {
    return color
      ? {
          ...style,
          color,
        }
      : style;
  }, [color, style]);

  let calcPerValue;
  if (Number(value) === 0) {
    calcPerValue = '0.00';
  } else {
    calcPerValue = value && value !== null ? value : '--';
  }

  const showArrawIcon = isShowArrawIcon && [STATUS.UP, STATUS.DOWN].includes(status);
  const SPAN = showArrawIcon ? 'span' : React.Fragment;
  const Container = needBg ? ChangeRateBG : DummyContainer;
  return (
    <Container data-status={status}>
      <ChangeRateSpan
        data-status={status}
        data-size={size}
        style={mergedStyle}
        {...restProps}
        className={is14px ? 'is14px' : ''}
      >
        <SPAN>
          <NumberFormat
            options={{
              style: 'percent',
              minimumFractionDigits: decimal,
              maximumFractionDigits: decimal,
            }}
            lang={currentLang}
            isPositive={+calcPerValue !== 0}
          >
            {calcPerValue}
          </NumberFormat>
        </SPAN>
        {showArrawIcon && <SvgIcon iconId={`change_rate_${status}`} width="8" height="6.67" />}
      </ChangeRateSpan>
    </Container>
  );
};

export default ChangeRate;

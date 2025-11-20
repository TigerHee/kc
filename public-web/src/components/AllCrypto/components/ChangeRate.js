/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled } from '@kufox/mui';
import { NumberFormat } from '@kux/mui';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

const STATUS = {
  UP: 'up',
  DOWN: 'down',
};

const SIZES = {
  ssm: `{
    font-size: 12px;
    line-height: 10px;
  }`,
  sm: `{
    font-size: 12px;
    line-height: 12px;
  }`,
  s2m: `{
    font-size: 12px;
    line-height: 22px;
  }`,
  md: `{
    font-size: 14px;
    line-height: 22px;
  }`,
  m2d: `{
    font-size: 16px;
    line-height: 24px;
  }`,
  lg: `{
    font-size: 18px;
    line-height: 18px;
  }`,
  xl: `{
    font-size: 20px;
    line-height: 28px;
  }`,
  x2l: `{
    font-size: 24px;
    line-height: 36px;
  }`,
};

const ChangeRateSpan = styled.span`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text40};
  &[data-status='up'] {
    color: ${({ theme }) => theme.colors.primary};
  }
  &[data-status='down'] {
    color: ${({ theme }) => theme.colors.secondary};
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

const ChangeRate = ({ value, decimal = 2, color, size = 'md', style, ...restProps }) => {
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

  const calcPerValue =
    (value || +value === 0) && value !== null ? (
      <NumberFormat
        options={{
          style: 'percent',
          minimumFractionDigits: decimal,
          maximumFractionDigits: decimal,
        }}
        lang={currentLang}
        isPositive={+value !== 0}
      >
        {value}
      </NumberFormat>
    ) : (
      '--'
    );

  return (
    <ChangeRateSpan data-status={status} data-size={size} style={mergedStyle} {...restProps}>
      {calcPerValue}
    </ChangeRateSpan>
  );
};

export default ChangeRate;

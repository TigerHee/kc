/**
 * Owner: odan.ou@kupotech.com
 */
// 从4.0复制

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { styled } from '@/style/emotion';
import { dropZero, separateNumber } from 'helper';
import { eTheme } from '@/utils/theme';

const ItemLine = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  margin-bottom: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const ItemLabel = styled.div`
  color: ${eTheme('text40')};
  font-weight: 400;
  padding-right: 24px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const ItemValue = styled.div`
  color: ${eTheme('text')};
  word-break: break-all;
  text-align: right;
  min-width: 1px;
`;

const MarginItem = ({
  label,
  value = '-',
  unit,
  formatNumber = false,
}) => {

  const ref = useRef(null);

  const formattedValue = useMemo(() => {
    if (!formatNumber) {
      return value;
    }
    if (value === '-' || !value) {
      return value || '-';
    }
    if (isNaN(value)) return value;
    return separateNumber(dropZero(value));
  }, [value, formatNumber]);

  useLayoutEffect(() => {
    // 如果 ref 超过一行，则将字体变成 12px
    if (ref.current) {
      const { clientHeight } = ref.current;
      if (clientHeight > 20) {
        ref.current.style.fontSize = '12px';
      }
    }
  }, []);

  return (
    <ItemLine>
      <ItemLabel>{label}</ItemLabel>
      <ItemValue ref={ref}>{formattedValue}{unit ? ` ${unit}` : ''}</ItemValue>
    </ItemLine>
  );
};

export default MarginItem;

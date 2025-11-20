/**
 * Owner: roger@kupotech.com
 */

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@kux/mui';
import { PREFIX } from '../../common/constants';
import { MARGIN_TABS_MAP } from './config';

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  height: 15px;
  padding: 0 3px;
  border-radius: 4px;
  background: rgba(1, 188, 141, 0.08);
  font-weight: 500;
  font-size: 10px;
  color: ${(props) => props.theme.colors.primary};
  margin-left: 4px;
  [dir='rtl'] & {
    margin-left: unset;
    margin-right: 4px;
  }
`;

export const namespace = `${PREFIX}_header`;

export default React.memo(
  // type 是杠杆类型
  ({ symbol, className, type = MARGIN_TABS_MAP.ALL.value, ...restProps }) => {
    const { configs, marginSymbolsMap } = useSelector((state) => state[namespace]);

    const { isMarginEnabled, isolatedMaxLeverage } = marginSymbolsMap[symbol] || {};
    const marginMaxLeverage = isMarginEnabled ? (configs || {}).maxLeverage : 0;

    const { getMaxLeverage = () => 0 } = MARGIN_TABS_MAP[type] || {};

    const maxLeverage = useMemo(() => {
      // 比较拿最大的显示
      return getMaxLeverage({ marginMaxLeverage, isolatedMaxLeverage });
    }, [getMaxLeverage, marginMaxLeverage, isolatedMaxLeverage]);

    const flag = useMemo(() => {
      return maxLeverage ? `${maxLeverage}X` : '';
    }, [maxLeverage]);

    return flag ? <Wrapper {...restProps}>{flag}</Wrapper> : null;
  },
);

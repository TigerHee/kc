/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect, useCallback, useRef } from 'react';
import useStateRef from '@/hooks/common/useStateRef';
import { getLayoutCoin } from 'SmartTrade/services';
import styled from '@emotion/styled';
import { times100 } from 'Bot/helper';
import { debounce } from 'lodash';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Flex } from 'Bot/components/Widgets';

const Box = styled(Flex)`
  overflow-x: auto;
`;
const matchModeValue = ['0', '1', '2'];
const matchModeKey = ['INTELLIGENT', 'MARKET_CAP', 'AVERAGE'];
const matchModeMap = {
  FIX: '-1', // 取消选择
  [matchModeKey[0]]: matchModeValue[0], // 智能配比
  [matchModeKey[1]]: matchModeValue[1], // 按市值配比
  [matchModeKey[2]]: matchModeValue[2], // 均分配比
};

export const getMatchMode = (type) => {
  return matchModeMap[type] ?? matchModeMap.FIX;
};

const RoundButton = styled.div`
  white-space: nowrap;
  border-radius: 80px;
  background-color: ${({ theme, active }) => (active ? theme.colors.primary8 : 'transparent')};
  color: ${({ theme, active }) => theme.colors[active ? 'primary' : 'text40']};
  font-size: 12px;
  padding: 4px 10px;
  font-weight: 500;
  line-height: 130%;
  border: 0.5px solid ${({ theme, active }) => (active ? theme.colors.primary12 : 'transparent')};
  cursor: pointer;
  margin-right: 4px;
  transition: all 0.3s linear;
  &:hover,
  &:active {
    color: ${(props) => props.theme.colors.primary};
  }
`;
export const matchMode = (percentType) => matchModeMap[percentType] || '-1';

/**
 * @description: 配平模式组件
 * @params coins Array  当前选择的币种
 * @params fillType String  配比模式
 * @params onFillCoinChange Function 回调函数
 * @params onFillTypeChange Function 配比模式变化函数
 * @return {*}
 */
const AutoFill = ({
  className,
  coins = [],
  fillType,
  onFillCoinChange,
  onFillTypeChange,
  ...rest
}) => {
  const useDataRef = useStateRef({
    onFillTypeChange,
    onFillCoinChange,
    coins,
    fillType,
  });
  const getFillCoinsByType = useRef(
    debounce((index) => {
      const { onFillCoinChange: onFillChange, coins: mcoins } = useDataRef.current;
      index = Number(index);
      const type = matchModeKey[index];
      if (!mcoins.length || !type) return;

      const currencies = mcoins.map((el) => el.currency).join(',');
      // 处理接口数据还没有回来， 但又添加了新的币种， 导致发起的coins和现有的coins数量对不上
      getLayoutCoin(type, currencies).then(({ data }) => {
        // 采用当前最新的coins遍历数据
        const newCoins = useDataRef.current.coins.map((item) => {
          const res = { ...item };
          res.value = times100(data[item.currency] ?? 0);
          res.disabled = false;
          return res;
        });
        onFillChange(newCoins);
      });
    }, 800),
  );
  //  币种数量、配比模式发生变化重新发起请求
  const currencies = coins.map((el) => el.currency).join(',');
  useEffect(() => {
    if (matchModeValue.includes(fillType) && currencies) {
      getFillCoinsByType.current(fillType);
    }
  }, [fillType, currencies]);

  const clickJack = useCallback((e) => {
    const { fillType: type, onFillTypeChange: onTypeChange } = useDataRef.current;
    let index = e.currentTarget.dataset.index;
    // 取消选择
    if (type === index) {
      index = matchModeMap.FIX;
    }
    onTypeChange(index);
  }, []);

  return (
    <Box vc mb={12} {...rest}>
      <RoundButton data-index="0" value="0" active={fillType === '0'} onClick={clickJack}>
        {_t('smart.intelligentratio')}
      </RoundButton>
      <RoundButton data-index="2" value="2" active={fillType === '2'} onClick={clickJack}>
        {_t('smart.junfen')}
      </RoundButton>
      <RoundButton data-index="1" value="1" active={fillType === '1'} onClick={clickJack}>
        {_t('smart.anshizhi')}
      </RoundButton>
    </Box>
  );
};

export default AutoFill;

/**
 * Owner: mike@kupotech.com
 */
import React, { useImperativeHandle, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import InputNumber from 'Bot/components/Common/InputNumber';
import AutoFill from './AutoFill';
import { getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
import ShowSpotKlineBySymbol from 'Bot/components/Common/ShowSpotKlineBySymbol';
import { useDispatch, useSelector } from 'dva';
import useDeepCompareEffect from 'Bot/hooks/useDeepCompareEffect';
import _, { groupBy, debounce } from 'lodash';
import { calcMinInverstment } from 'SmartTrade/config';
import { getHoldCoins } from 'SmartTrade/services';
import { floatText } from 'Bot/helper';
import Decimal from 'decimal.js';
import { _t, _tHTML } from 'Bot/utils/lang';
import { useSnackbar } from '@kux/mui';
import { MIcons } from 'Bot/components/Common/Icon';
import { Text, Flex } from 'Bot/components/Widgets';
import PickerCoinLayer from '../PickerCoinLayer';
import { useMediaQuery } from '@kux/mui/hooks';

const Cover = styled.div`
  text-align: center;
  margin-top: ${({ hasAdd }) => (hasAdd ? 16 : 8)}px;
`;
const BtnBox = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 7px 20px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.cover8};
  transition: all 0.3s linear;
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover12};
  }
`;

const AddBtn = ({ hasAdd, reducerName }) => {
  const controlRef = useRef();
  return (
    <>
      <Cover hasAdd={hasAdd}>
        <BtnBox onClick={() => controlRef.current.show()}>
          <MIcons.Add size={16} color="text" />
          <Text fs={12} fw={500} color="text" ml={4}>
            {_t('coinadd')}
          </Text>
        </BtnBox>
      </Cover>
      <PickerCoinLayer controlRef={controlRef} reducerName={reducerName} />
    </>
  );
};

const Table = styled.table`
  width: 100%;
  font-size: 12px;
  thead td {
    padding-bottom: 8px;
    color: ${({ theme }) => theme.colors.text40};
    /* font-weight: 500; */
  }
  tr {
    td {
      padding-right: 8px;
      &:last-child {
        padding-right: 0;
      }
    }
  }
`;

/**
 * @description: 币种配比每一行
 * @param {Enum} mode {create, update}
 * @param {Object} data
 * @param {Object} index
 * @param {Function} onDelete
 * @param {Function} onChange
 * @param {Number} maxInput 输入框能输入的最大值
 * @return {*}
 */
const InputTR = ({ mode, index, data, onDelete, onChange, maxInput }) => {
  // 处理不要显示科学计数法
  const triggerPrice = data.triggerPrice ? Decimal(data.triggerPrice).toFixed() : '';
  return (
    <tr>
      <td>
        <span className="inlineflex vc ">
          <Text fs={12} color="text40">
            {index + 1}
          </Text>
          <MIcons.Delete
            size={16}
            color="icon40"
            cursor
            className="mr-8 ml-8"
            onClick={() => onDelete(index)}
          />
          <ShowSpotKlineBySymbol symbolCode={data.currency}>
            <Text color="text" fs={12} fw={500}>
              {getCurrencyName(data.currency)}
            </Text>
          </ShowSpotKlineBySymbol>
        </span>
      </td>
      {mode === 'update' && (
        <>
          <td className="right">{triggerPrice}</td>

          <td className="center">{data.percent}</td>
        </>
      )}
      <td className="pb-6">
        <InputNumber
          min={0}
          max={maxInput}
          size="small"
          maxPrecision={0}
          value={data.value}
          onChange={(val) => onChange(val, index)}
        />
      </td>
    </tr>
  );
};
/**
 * @description: 币种配比table头部
 * @param {Enum} mode {Create, Update}
 * @return {*}
 */
const InputHD = ({ mode }) => {
  return (
    <thead>
      <tr>
        <td>{_t('smart.coin')}</td>
        {mode === 'update' && (
          <>
            <td className="right">{_t('openprice')}</td>
            <td className="center">{_t('smart.adjustbefore')}(%)</td>
          </>
        )}

        <td className="right coin-ratio-input" style={{ width: 120 }}>
          {_t(mode === 'Create' ? 'smart.zhanbi' : 'smart.adjustafter')}(%)
        </td>
      </tr>
    </thead>
  );
};
const limitCoinNum = 1;
const getTotal = (items) => {
  return items.reduce((p, n) => {
    return p + Number(n.value || 0);
  }, 0);
};
const isFull = (items) => {
  return getTotal(items) - 100;
};
const checker = (coins, effectiveCoins, message) => {
  // 校验提示
  const isNotFitLimit = effectiveCoins.length < limitCoinNum; // 至少1个币种提示
  if (isNotFitLimit) {
    // 您必须至少选择 {rest}个币种
    message.error(_t('smart.lesttwocoin2', { rest: limitCoinNum }));
    return {
      okStatus: -2,
      rest: limitCoinNum,
    };
  }

  // 是否100%配比提示
  const rest = isFull(coins);
  if (rest < 0) {
    // 100%配比才能运行，还剩{rest}%
    message.error(_t('smart.allcanrun3', { rest: Math.abs(rest) }));
    return {
      okStatus: 0,
      rest: Math.abs(rest),
    };
  }
  // 默认成功100%配比提示
  return {
    okStatus: 1,
  };
};
const validate = (coins, effectiveCoins, message) => {
  return new Promise((r, j) => {
    const { okStatus, rest } = checker(coins, effectiveCoins, message);
    if (okStatus === 1) {
      r(effectiveCoins);
    } else {
      j({
        okStatus,
        rest,
      });
    }
  });
};
/**
 * @description: 获取除了currentIndex原素之外的所有value和
 * @param {Array} coins
 * @param {Number} currentIndex
 * @return {Number}
 */
const getMaxInput = (coins, currentIndex) => {
  coins = coins.slice(0);
  coins.splice(currentIndex, 1);
  return 100 - getTotal(coins);
};

/**
 * @description: 将两个合并
 * @param {Array<Currency>} createTargetCoins
 * @param {Array<Coin>} coins
 * @return {Array<Coin>}
 */
const mergeCoins = (createTargetCoins, coins) => {
  const currencyMap = groupBy(coins, 'currency');
  const nowCoins = createTargetCoins.map((currency) => {
    if (currencyMap[currency]) {
      return currencyMap[currency][0];
    }
    // 增加
    return {
      currency,
    };
  });
  return nowCoins;
};
// interface Coin {
//   currency: String, // 币种code
//   value: Number, // 百分比
//   triggerPrice: String // 触发价
// }
/**
 * @description: 币种配比table
 * @param {Array<Coin>} coins
 * @param {*} onCoinsChange
 * @param {String} reducerName 修改model的字段名字
 * @return {*}
 */
const InputTable = React.forwardRef(
  ({ mode, className, coins = [], onCoinsChange, reducerName }, ref) => {
    const createTargetCoins = useSelector((state) => state.smarttrade[reducerName]);
    const dispatch = useDispatch();
    const { message } = useSnackbar();
    useImperativeHandle(
      ref,
      () => {
        // 只要大于0
        const effectiveCoins = coins.map((el) => {
          el = { ...el };
          // 为空，补为0
          el.value = el.value || 0;
          return el;
        });
        return {
          validate: () => validate(coins, effectiveCoins, message),
        };
      },
      [coins],
    );
    // createTargetCoins变化需要同步到组件内部的coins
    // createTargetCoins变化只有增删
    // 初始化的时候coins 先更新，createTargetCoins后更新
    // 只在mounted后开始处理
    const isMounted = React.useRef(false);
    useDeepCompareEffect(() => {
      if (isMounted.current) {
        // 向上抛出， 上层state变化
        const nowCoins = mergeCoins(createTargetCoins, coins);
        onCoinsChange(nowCoins);
      }
      isMounted.current = true;
    }, [createTargetCoins]);

    const onDelete = (index) => {
      const newCoins = coins.slice(0);
      const droper = newCoins.splice(index, 1);
      onCoinsChange(newCoins);
      // 同步model
      dispatch({
        type: 'smarttrade/deleteCoinPosition',
        payload: {
          currency: droper[0].currency,
          reducerName,
        },
      });
    };
    // 比例变化 不需要同步到model，model->createTargetCoins里面只记录currency的增删
    const onRowChange = (val, index) => {
      coins[index].value = val;
      onCoinsChange(coins.slice(0));
    };

    const rest = Math.abs(isFull(coins));
    const isH5 = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
      <>
        <Table className={className}>
          <InputHD mode={mode} />
          <tbody>
            {coins.map((coin, index) => (
              <InputTR
                mode={mode}
                index={index}
                key={coin.currency}
                data={coin}
                maxInput={getMaxInput(coins, index)}
                onDelete={onDelete}
                onChange={onRowChange}
              />
            ))}
          </tbody>
        </Table>
        {(mode === 'update' ? isH5 : true) && coins.length < 12 && (
          <AddBtn hasAdd={coins.length > 0} reducerName={reducerName} />
        )}
        {/* 还剩余xx配平 */}
        {coins.length > 0 && (
          <Flex fe fs={12} mt={12} mb={12}>
            {rest > 0 && (
              <Text color="primary">
                {_t('j9uzrGQDFnLNfW3ATzTd1i', { percent: floatText(rest) })}
              </Text>
            )}
          </Flex>
        )}
      </>
    );
  },
);
const getMinInvest = debounce(({ coinTextStr, selectedCoinsNum, callback }) => {
  // TODO：  这个地方需要改造， 是用交易对的数据，直接获取，不用每次都拉接口
  getHoldCoins(coinTextStr).then(({ data: coins }) => {
    const { minInvestment, baseMinSizeArr } = calcMinInverstment(selectedCoinsNum, coins);
    callback({ minInvestment, baseMinSizeArr });
  });
}, 800);

const useGetMinInvest = ({ coins, onMinInvestment }) => {
  const coinTextStr = coins.map((el) => el.currency).join(',');
  useEffect(() => {
    if (!coinTextStr) return undefined;
    getMinInvest({
      selectedCoinsNum: coins.length,
      coinTextStr,
      callback: ({ minInvestment, baseMinSizeArr }) => {
        onMinInvestment && onMinInvestment({ minInvestment, baseMinSizeArr });
      },
    });
  }, [coinTextStr]);
};

const Box = styled.div`
  margin-top: 12px;
  .hint-text {
    max-width: 50%;
  }
`;

const CoinRatio = ({
  coinRatioRef,
  coins = [],
  onCoinsChange,
  onMinInvestment,
  mode,
  className,
  reducerName,
  fillType,
  setFillType,
}) => {
  // 币种变化需要重新获取最小投资额
  useGetMinInvest({ coins, onMinInvestment });

  return (
    <Box className={className}>
      <AutoFill
        fillType={fillType}
        coins={coins}
        onFillTypeChange={setFillType}
        onFillCoinChange={onCoinsChange}
      />
      <InputTable
        mode={mode}
        ref={coinRatioRef}
        coins={coins}
        onCoinsChange={onCoinsChange}
        reducerName={reducerName}
      />
    </Box>
  );
};
export { CoinRatio };

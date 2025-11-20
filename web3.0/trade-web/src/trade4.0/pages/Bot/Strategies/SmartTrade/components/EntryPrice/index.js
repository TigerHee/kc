/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import styled from '@emotion/styled';
import { Price } from 'Bot/components/ColorText';
import InputNumber from 'Bot/components/Common/InputNumber';
import { getSymbolInfo, getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
import { getHoldCoins, UpdateBotParams } from 'SmartTrade/services';
import useTicker from 'Bot/hooks/useTicker';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { dropZero } from 'Bot/helper';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { _t, _tHTML } from 'Bot/utils/lang';
import { EditRow } from 'Bot/components/Common/Row';
import CoinIcon from '@/components/CoinIcon';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import { useSnackbar } from '@kux/mui';
import { Text, Flex } from 'Bot/components/Widgets';

/**
 * @description: 格式化显示设置的触发开档价格
 * @param {*} coins
 * @return {*}
 */
const ShowText = ({ coins, disabled }) => {
  const effectiveEntryPrice = coins
    .filter((row) => Number(row.triggerPrice) > 0)
    .map((row) => getCurrencyName(row.currency));
  const TextHere = Text;
  let showText = (
    <TextHere disabled={disabled} color="text40">
      {_t('robotparams7')}
    </TextHere>
  );
  if (effectiveEntryPrice.length === 0) {
    showText = (
      <TextHere disabled={disabled} color="text40">
        {_t('robotparams7')}
      </TextHere>
    );
  } else if (effectiveEntryPrice.length <= 3) {
    showText = (
      <TextHere color="text" disabled={disabled}>
        {effectiveEntryPrice.join(' ')}
      </TextHere>
    );
  } else if (effectiveEntryPrice.length > 3) {
    showText = (
      <TextHere color="text" disabled={disabled}>{`${effectiveEntryPrice
        .slice(0, 3)
        .join(' ')}... (${effectiveEntryPrice.length})`}</TextHere>
    );
  }
  return showText;
};
// interface updateParams {
// id: Number,
// targets: Coin []
// onFresh()
// }
/**
 * @description: 创建、参数修改页面使用
 * @params {Enum} mode {create-page, params-setting}  create-page: 创建页面使用, params-setting参数设置页面用
 * @params {Object} updateParams 更新模式下必传
 * @return {*}
 */
export const EntryPriceRowWhenCreate = ({
  stopped,
  coins,
  updateParams = {},
  setCoins,
  mode,
  className,
  classLabelName,
}) => {
  const actionSheetRef = useRef();
  const showEntryPrice = () => {
    if (isEmpty(coins) || stopped) return;
    actionSheetRef.current.toggle();
  };
  // 只有一个u不显示入口
  if (isEmpty(coins) || (coins.length === 1 && coins[0].currency === 'USDT')) {
    return null;
  }

  return (
    <>
      <EditRow
        className={className}
        onClick={showEntryPrice}
        label={_t('openprice')}
        valueSlot={<ShowText coins={coins} mode={mode} disabled={stopped} />}
        hasArrow={!stopped}
      />
      {!stopped && (
        <EntryPriceSheet
          actionSheetRef={actionSheetRef}
          coins={coins}
          updateParams={updateParams}
          onConfirm={setCoins}
          mode={mode}
        />
      )}
    </>
  );
};

const Box = styled(Form)`
  font-size: 14px;
  tr td {
    &:first-of-type {
      width: 25%;
    }
    &:nth-of-type(2) {
      width: 30%;
      padding: 0 6px;
      text-align: right;
      > span {
        display: inline-flex;
      }
    }
    &:last-of-type {
      width: 45%;
      padding: 3px 0 3px 8px;
      text-align: center;
    }
  }
`;
const MCoinIcon = styled(CoinIcon)`
  width: 20px;
  height: 20px;
`;
/**
 * @description: 每一行设置触发开档价格
 * @param {*} data
 * @param {*} priceMap
 * @param {*} form
 * @return {*}
 */
const EntryPriceRow = ({ data, priceMap = {}, form }) => {
  const code = data.currency;
  const symbolCode = `${code}-USDT`;
  // 处理后端直接返回了科学计算法问题
  const oldEntryPrice = data.triggerPrice ? Decimal(data.triggerPrice).toFixed() : '';
  //   先使用props中的价格， 待接口回来使用接口的数据
  const changeRate = priceMap[code]?.percentChange24h || data.percentChange24h || 0;
  const price = priceMap[code]?.usdtPrice || data.usdtPrice || 0;
  const { pricePrecision, priceIncrement } = getSymbolInfo(symbolCode);
  const fillPrice = (mprice) => {
    mprice &&
      form.setFieldsValue({
        [code]: dropZero(Decimal(mprice).toFixed(pricePrecision, Decimal.ROUND_DOWN)),
      });
  };
  const fillHandler = () => {
    fillPrice(price);
  };
  useEffect(() => {
    fillPrice(oldEntryPrice);
  }, []);
  return (
    <tr>
      <td>
        <MCoinIcon currency={code} />
      </td>
      <td>
        <Price
          onClick={fillHandler}
          value={price}
          changeRate={changeRate}
          precision={pricePrecision}
          className="cursor-pointer"
        />
      </td>
      <td>
        <FormItem noStyle name={code}>
          <InputNumber
            controls
            fullWidth
            maxPrecision={pricePrecision}
            placeholder={price}
            min={priceIncrement}
            max={price}
            step={priceIncrement}
          />
        </FormItem>
      </td>
    </tr>
  );
};
/**
 * @description: 在原来的targets上添加triggerPrice字段， 返回给后端
 * @param {Array} data 新的触发开单价
 * @param {Array} targets 老数据
 * @return {Array}
 */
const addEntryPriceWithOldTargets = (data, targets) => {
  const currencyMap = _.groupBy(data, 'currency');
  return targets.map((el) => {
    // 保留以下字段 返回
    const temp = {
      percent: el.percent,
      currency: el.currency,
    };
    if (currencyMap[el.currency]?.[0]?.triggerPrice) {
      temp.triggerPrice = currencyMap[el.currency][0].triggerPrice;
    }
    return temp;
  });
};
/**
 * @description: 触发开单价格整体组件
 * @param {*} Form
 * @param {*} form
 * @param {*} onConfirm
 * @param {*} coins
 * @param {*} mode
 * @param {Object} updateParams  更新模式比传
 * @return {*}
 */
const EntryPrice = ({ actionSheetRef, onConfirm, coins = [], updateParams = {}, mode }) => {
  const [form] = Form.useForm();
  const results = Form.useWatch([], form) ?? {};
  const [loading, setLoading] = useState(false);
  const { message } = useSnackbar();
  const onOk = () => {
    form.validateFields().then(async (values) => {
      const Coins = coins.map((row) => {
        row = { ...row };
        if (values[row.currency]) {
          row.triggerPrice = dropZero(values[row.currency]);
          row.isTriggered = false;
        } else {
          // 清空
          delete row.triggerPrice;
          delete row.isTriggered;
        }
        return row;
      });
      // 创建页面直接向上抛出
      if (mode === 'create-page') {
        onConfirm(Coins);
      } else if (mode === 'params-setting') {
        // 更新模式 通过接口提交
        const newTargets = addEntryPriceWithOldTargets(Coins, updateParams.targets);
        if (loading) return;
        setLoading(true);
        await UpdateBotParams({
          taskId: updateParams.id,
          targets: newTargets,
        })
          .then(() => {
            updateParams.onFresh();
            message.success(_t('runningdetail'));
          })
          .finally(() => {
            setLoading(false);
          });
      }

      actionSheetRef.current.close();
    });
  };

  const [priceMap, setPriceMap] = useState({});
  const currencyTexts = coins.map((row) => row.currency).join(',');
  const FetchInvestComposeDetail = useCallback(() => {
    currencyTexts &&
      getHoldCoins(currencyTexts).then(({ data }) => {
        const priceObj = {};
        data.forEach((el) => {
          priceObj[el.code] = el;
        });
        setPriceMap(priceObj);
      });
  }, [currencyTexts]);
  useTicker(FetchInvestComposeDetail, { isTrigger: !!currencyTexts });

  useBindDialogButton(actionSheetRef, onOk);

  if (!currencyTexts) return null;
  return (
    <Box form={form}>
      <table className="fullWidth">
        <thead>
          <Text as="tr" color="text" fs={12} fw={500}>
            <td>{_t('smart.coin')}</td>
            <td>{_t('gridwidget13')}</td>
            <td>{_t('br77e4Kr96KFgbNQQYjqs9')}</td>
          </Text>
        </thead>
        <tbody>
          {map(coins, (row) => {
            // USDT,比例为0，不能设置开单价
            if (row.currency === 'USDT' || row.value === 0) {
              return null;
            }
            return <EntryPriceRow form={form} priceMap={priceMap} data={row} key={row.currency} />;
          })}
        </tbody>
      </table>
      <Text as="p" color="text60" mt={12}>
        {_t('rzBZxyisY6scu1ACGz76vo')}
      </Text>
    </Box>
  );
};
/**
 * @description: 触发开档价格弹窗包装器
 * @param {*} props
 * @return {*}
 */
export const EntryPriceSheet = (props) => {
  return (
    <DialogRef
      ref={props.actionSheetRef}
      onCancel={() => props.actionSheetRef.current.close()}
      onOk={() => props.actionSheetRef.current.confirm()}
      title={_t('openprice')}
      cancelText={_t('cancel')}
      okText={_t('confirm')}
      size="medium"
    >
      <EntryPrice {...props} />
    </DialogRef>
  );
};

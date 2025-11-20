/**
 * Owner: mike@kupotech.com
 */
/* eslint-disable */
import React, { useCallback, useRef, useEffect } from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import { Text } from 'Bot/components/Widgets';
import { dropZero, numberFixed, formatNumber, times100, isNull, testDecimalIsOk } from 'Bot/helper';
import { useDispatch, useSelector } from 'dva';
import Empty from '@mui/Empty';
import { Spin } from '@kux/mui';
import _ from 'lodash';
import { minTransfer, mostCoinNum } from 'SmartTrade/config';
import { diffChange } from 'SmartTrade/util';
import Decimal from 'decimal.js';
import { UpdateBotParams, toOrderSure } from 'SmartTrade/services';
import { getCurrencyName, getSymbolInfo } from 'Bot/hooks/useSpotSymbolInfo';
import useStateRef from '@/hooks/common/useStateRef';
import styled from '@emotion/styled';
import { useSnackbar } from '@kux/mui';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import { _t, _tHTML } from 'Bot/utils/lang';
import { withForm } from 'Bot/components/Common/CForm';

const tran = (value, price, p) => {
  return Number(
    Decimal(value || 0)
      .times(price ?? 1)
      .toFixed(p, Decimal.ROUND_DOWN),
  );
};
const UDecimal = 3;
const getPrecision = (currency) => {
  // u 特殊处理为3位小数
  if (currency === 'USDT') {
    return {
      basePrecision: UDecimal,
      quotaPrecision: UDecimal,
      pricePrecision: UDecimal,
    };
  }
  // 其余走kc
  const symbol = `${currency}-USDT`;
  return getSymbolInfo(symbol);
};

/**
 * @description: 表单每行
 * @param {*} item
 * @param {*} form
 * @return {*}
 */
export const TransferItem = ({ item, form }) => {
  const formField = item.currency;
  const { basePrecision } = getPrecision(item.currency);
  const useDataRef = useStateRef({
    form,
    item,
    basePrecision,
    formField,
  });
  const onAll = useCallback((e) => {
    const { form, item, basePrecision, formField } = useDataRef.current;
    form.setFieldsValue({
      [formField]: dropZero(numberFixed(item.available, basePrecision)),
    });
  }, []);

  const inputValue = form.getFieldValue(formField);
  const tranUsdtNow = tran(inputValue, item.price, UDecimal);

  const tranMInInverstByU = Decimal(minTransfer)
    .div(item.price)
    .toFixed(basePrecision, Decimal.ROUND_UP);

  return (
    <tr>
      <td>
        <Text color="text" as="div" lh="130%">
          {getCurrencyName(item.currency)}
        </Text>
        <Text color="text40">{item.available ? formatNumber(item.available, basePrecision) : '--'}</Text>
      </td>
      <td>
        <FormItem
          name={formField}
          rules={[
            {
              validator: (rule, value, cb) => {
                if (!isNull(value)) {
                  value = Number(value);
                  if (value < tranMInInverstByU) {
                    cb(
                      _t('traninnumhint', {
                        num: `${tranMInInverstByU} ${item.currency}`,
                      }),
                    );
                  }
                  if (isNaN(value)) {
                    cb(_t('gridform7'));
                  }
                  if (!testDecimalIsOk(basePrecision, value)) {
                    return cb(_t('gridform9', { num: basePrecision }));
                  }
                  if (value > Number(item.available)) {
                    return cb(_t('gridform31'));
                  }
                }

                cb();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            controls={false}
            unit={
              <Text color="primary" pr={16} cursor onClick={onAll} className="uppercase">
                {_t('allsymbol')}
              </Text>
            }
            placeholder={`>= ${`${tranMInInverstByU} ${item.currency}`}`}
            maxPrecision={basePrecision}
          />
        </FormItem>
        <Text color="text40" fs={12} as="div">
          ≈ {tranUsdtNow} USDT
        </Text>
      </td>
    </tr>
  );
};

/**
 * @description: 按U累加
 * @param {Array} chooseCoins 当前已选
 * @param {Array} assetsLists 用户资产
 * @return {*}
 */
export const tranToSubmit = (chooseCoins, assetsLists) => {
  const investments = [];
  let totalInvestmentUsdt = 0;

  const assetsListsMap = {};
  assetsLists.forEach((coin) => {
    assetsListsMap[coin.currency] = coin;
  });

  for (const coin in chooseCoins) {
    if (chooseCoins.hasOwnProperty(coin) && chooseCoins[coin]) {
      // 累加u
      totalInvestmentUsdt = Decimal(tran(chooseCoins[coin], assetsListsMap[coin].price)).add(
        totalInvestmentUsdt,
      );
      investments.push({
        currency: coin,
        balance: chooseCoins[coin],
      });
    }
  }
  return {
    investments,
    totalInvestmentUsdt: Decimal(totalInvestmentUsdt).toFixed(3, Decimal.ROUND_DOWN),
  };
};

const getEffective = (values) => {
  const obj = {};
  for (const coin in values) {
    if (Number(values[coin]) > 0) {
      obj[coin] = values[coin];
    }
  }
  return obj;
};
const TBody = styled.tbody`
  td {
    padding: 2px 0;
  }
  div.KuxForm-itemHelp {
    min-height: 0;
  }
`;
/**
 * @description: 导入表单组件主体
 * @param {*} Form
 * @param {*} next
 * @param {*} bot
 * @return {*}
 */
const TransferIn = withForm()(({ form, next, bot, actionSheetRef }) => {
  const dispatch = useDispatch();
  const assetsLists = useSelector((state) => state.smarttrade.assetsLists);
  const apiLoading = useSelector((state) => state.loading.effects['smarttrade/getAssetsLists']);
  const { message } = useSnackbar();
  const useDataRef = useStateRef({
    form,
    next,
    bot,
    assetsLists,
  });
  // 点击按钮事件
  const onConfirm = useCallback(() => {
    const { form, next, bot, assetsLists } = useDataRef.current;
    form.validateFields().then((values) => {
      // 过滤出大于0有效的
      values = getEffective(values);
      // 检查币种数量
      const effectiveCoins = Object.keys(values);
      if (!effectiveCoins.length) return;
      const nowCoinNum = [
        ...new Set([...effectiveCoins, ...bot.snapshots.map((el) => el.currency)]),
      ].length;
      if (nowCoinNum > mostCoinNum) {
        return message.info(_t('coinnumtolimit'));
      }

      actionSheetRef.current.updateBtnProps({
        okButtonProps: {
          loading: true,
        },
      });
      const submitData = {
        ...tranToSubmit(values, assetsLists),
        autoPercentType: 'REAL',
        taskId: bot.id,
      };

      toOrderSure(submitData)
        .then(({ data: dataSure }) => {
          if (dataSure) {
            next({ dataSure, submitData });
          }
        })
        .finally(() => {
          actionSheetRef.current.updateBtnProps({
            okButtonProps: {
              loading: false,
            },
          });
        });
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'smarttrade/getAssetsLists@polling',
    });
    return () => {
      dispatch({
        type: 'smarttrade/getAssetsLists@polling:cancel',
      });
    };
  }, []);

  useBindDialogButton(actionSheetRef, {
    onConfirm,
  });
  return (
    <div>
      {apiLoading && _.isEmpty(assetsLists) && (
        <div className="Flex vc hc" style={{ minHeight: 200, marginTop: '25%' }}>
          <Spin />
        </div>
      )}
      {_.isEmpty(assetsLists) && !apiLoading && (
        <Empty style={{ minHeight: 200, marginTop: '25%' }} description={_t('notfittranlist')} />
      )}

      {!!assetsLists.length && (
        <>
          <table className="fullWidth fs-14">
            <thead>
              <Text as="tr" color="text40">
                <td style={{ width: '33%' }}>
                  {_t('cointype')}/{_t('fu2ePZGCX9fcS7BFSqrFkX')}
                </td>
                <td>{_t('6BNtqPysxFwYkcqfRj5JBG')}</td>
              </Text>
            </thead>

            <TBody>
              {assetsLists.map((item) => {
                return <TransferItem key={item.currency} form={form} item={item} />;
              })}
            </TBody>
          </table>
          <Text as="div" fs={12} mt={16}>
            {_tHTML('cantransfterin')}
          </Text>
          <Text as="div" color="complementary" fs={12}>
            {_t('traninhelphint')}
          </Text>
        </>
      )}
    </div>
  );
});

const formatPercent = (tran) => {
  return tran.map((el) => {
    el = { ...el };
    el.percent = times100(el.percent || 0);
    return el;
  });
};
/**
 * @description: 获得变化前后对比数据
 * @param {*} dataSureRef
 * @param {*} bot
 * @return {*}
 */
const getChange = ({ dataSureRef, bot }) => {
  let transferBefore = bot.snapshots;
  let {
    beforeOverview: { snapshots: transferAfter },
  } = dataSureRef.current.dataSure;
  transferBefore = formatPercent(transferBefore);
  transferAfter = formatPercent(transferAfter);
  const { change = [] } = diffChange(transferBefore, transferAfter, 'percent');
  return change;
};

const Grid = styled(Text)`
  display: grid;
  grid-template-columns: 20% 40% 40%;
  color: ${({ theme }) => theme.colors.text};
`;
/**
 * @description: 导入二次确认
 * @param {*} dataSureRef
 * @param {*} bot
 * @param {*} onFinalConfirm
 * @return {*}
 */
const SubmitSure = ({ actionSheetRef, dataSureRef, bot, onFinalConfirm }) => {
  const { message } = useSnackbar();
  const onConfirm = useCallback(() => {
    actionSheetRef.current.updateBtnProps({
      okButtonProps: {
        loading: true,
      },
    });
    UpdateBotParams(dataSureRef.current.submitData)
      .then(() => {
        onFinalConfirm?.();
        message.success(_t('runningdetail'));
      })
      .finally(() => {
        actionSheetRef.current.updateBtnProps({
          okButtonProps: {
            loading: false,
          },
        });
      });
  }, []);
  const { totalInvestmentUsdt, investments } = dataSureRef.current.submitData;
  const change = getChange({ dataSureRef, bot });
  useBindDialogButton(actionSheetRef, {
    onConfirm,
  });
  return (
    <>
      <Text className="mb-12 pb-12 fs-14" as="div">
        {_tHTML('traninsurehint', {
          cointext: `${formatNumber(totalInvestmentUsdt)} USDT`,
          num: investments.length,
        })}
      </Text>

      <Grid className="fs-12">
        <span className="tc-hd lh-20 mb-8">{_t('smart.coin')}</span>
        <span className="tc-hd lh-20 mb-8 right">{_t('smart.transferbefore')}</span>
        <span className="tc-hd lh-20 mb-8 right">{_t('smart.transferafter')}</span>
      </Grid>
      <Grid className="fs-12">
        {change.map((coin) => {
          const { basePrecision } = getPrecision(coin.base);
          return (
            <React.Fragment key={coin.base}>
              <Text color="text" className="tc-bd lh-22 mb-4">
                {getCurrencyName(coin.base)}
              </Text>
              <span className="tc-bd lh-22 mb-4 right pr-4">
                <Text type="text60" as="span">
                  {coin.beforeBalance ? formatNumber(coin.beforeBalance, basePrecision) : 0}
                </Text>
                <Text className="pl-4" as="span">
                  {coin.before ? dropZero(coin.before) : 0}%
                </Text>
              </span>
              <span className="tc-bd lh-22 mb-4 right">
                <Text color="text60">
                  {coin.afterBalance ? formatNumber(coin.afterBalance, basePrecision) : 0}
                </Text>
                <Text color="text" className="pl-4">
                  {coin.after ? dropZero(coin.after) : 0}%
                </Text>
              </span>
            </React.Fragment>
          );
        })}
      </Grid>
    </>
  );
};

/**
 * @description: 资产导入：表单，二次确认wrap
 * @param {*} actionSheetRef
 * @param {*} item
 * @param {*} onFresh
 * @return {*}
 */
const ActionSheetWrap = ({ actionSheetRef, item, onFresh }) => {
  const sureRef = useRef(); // 二次确认ref
  const dataSureRef = useRef(); // 数据传递ref
  // 表单确认后
  const next = useCallback((dataSure) => {
    dataSureRef.current = dataSure;
    // 打开
    sureRef.current.toggle();
  }, []);
  // 二次确认后
  const onFinalConfirm = useCallback(() => {
    // 关闭所有
    actionSheetRef.current.toggle();
    sureRef.current.toggle();
    onFresh?.();
  }, []);
  return (
    <>
      <TransferIn next={next} bot={item} actionSheetRef={actionSheetRef} />
      <DialogRef
        title={_t('traninsure')}
        ref={sureRef}
        size="medium"
        maskClosable
        okText={_t('gridwidget6')}
        cancelText={null}
        onCancel={() => sureRef.current.close()}
        onOk={() => sureRef.current.confirm()}
      >
        <SubmitSure
          actionSheetRef={sureRef}
          dataSureRef={dataSureRef}
          bot={item}
          onFinalConfirm={onFinalConfirm}
        />
      </DialogRef>
    </>
  );
};

export default ActionSheetWrap;

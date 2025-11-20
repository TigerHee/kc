/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { jump, floatToPercent, getAvailLang, getLang, formatNumber } from 'Bot/helper';
import CloseDataRef from 'Bot/components/Common/CloseDataRef';
import Row from 'Bot/components/Common/Row';
import HintText from 'Bot/components/Common/HintText';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import useStateRef from '@/hooks/common/useStateRef';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import useBalance from 'Bot/hooks/useBalance';
import Investment from 'InfinityGrid/Create/Investment';
import { tipConfig } from 'InfinityGrid/config';
import { calcBuySellNum, calcBuyNum } from 'InfinityGrid/util';
import { getAppendMinInvestment, appendInvestment } from 'InfinityGrid/services';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import { useSnackbar } from '@kux/mui';
import { withForm } from 'Bot/components/Common/CForm';

const templateId = 5;
const AddInvestment = withForm({
  initialValues: { useBaseCurrency: 0 },
})(
  ({
    optionsRef, // 参数传递ref
    actionSheetRef, // 当前弹窗控制ref
    sureActionSheetRef, // 下一步弹窗控制ref
    form,
    item, //  运行列表数据
    symbolInfo, // 交易对信息
  }) => {
    const { symbol, id: taskId, gridProfitRatio } = item;
    let { price: lastTradedPrice, down } = item;
    lastTradedPrice = +lastTradedPrice;
    down = +down;
    const [minInverst, setMinInverst] = useState(0);
    useEffect(() => {
      symbol &&
        getAppendMinInvestment(symbol).then(({ data }) => {
          setMinInverst(data);
        });
    }, [symbol]);

    const { limitAsset, useBaseCurrency } = form.getFieldsValue();
    const balance = useBalance(symbolInfo, lastTradedPrice, useBaseCurrency);
    // 汇集所有参数
    const allParams = {
      useBaseCurrency,
      symbol,
      limitAsset,
      lastTradedPrice,
      down,
      symbolInfo,
      templateId,
      taskId,
      balance,
      gridProfitRatio,
    };

    // 计算需要购买的base数量
    const buyNum = calcBuyNum(allParams);
    // 计算实际需要划转的数量
    const realInverst = calcBuySellNum({ ...allParams, buyNum });

    optionsRef.current = {
      ...allParams,
      realInverst,
    };
    const onConfirm = useCallback(() => {
      form.validateFields().then(() => {
        actionSheetRef.current.toggle();
        sureActionSheetRef.current.toggle();
      });
    }, []);
    useBindDialogButton(actionSheetRef, {
      onConfirm,
    });
    return (
      <div className="bot-update-form">
        <Investment
          inverstLabel=""
          symbolInfo={symbolInfo}
          balance={balance}
          form={form}
          buySellNum={realInverst}
          minInvest={minInverst}
        />
      </div>
    );
  },
);

const OrderSure = ({ symbolInfo, optionsRef, sureActionSheetRef, onFresh }) => {
  const options = optionsRef.current;
  const { base, quota, symbolNameText } = symbolInfo;
  const { message } = useSnackbar();
  const realInverst = options.realInverst;
  const useDataRef = useStateRef({
    options,
    onFresh,
  });
  // 二次确定终极提交
  const onConfirm = useCallback(() => {
    const { options: moptions, onFresh: monFresh } = useDataRef.current;

    sureActionSheetRef.current.updateBtnProps({
      okButtonProps: { loading: true },
    });
    const submitData = {
      addAmount: +moptions.limitAsset,
      baseAmount: +moptions.realInverst.needInverstBase,
      quoteAmount: +moptions.realInverst.needInverstQuota,
      taskId: moptions.taskId,
    };
    try {
      appendInvestment(submitData)
        .then(({ data }) => {
          if (data) {
            sureActionSheetRef.current.toggle();
            message.success(_t('runningdetail'));
            monFresh && monFresh();
          }
        })
        .finally(() => {
          sureActionSheetRef.current.updateBtnProps({
            okButtonProps: { loading: false },
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const comma = options.useBaseCurrency ? (getLang() === 'zh_CN' ? '。' : '. ') : '';

  const jumpHandler = (e) => {
    if (e.target.classList.contains('learnmore')) {
      jump(tipConfig().entryPrice.moreLinks[getAvailLang()]);
    }
  };
  useBindDialogButton(sureActionSheetRef, {
    onConfirm,
  });
  return (
    <>
      <Text as="div" fs={14} color="text" mb={12} lh="130%">
        {_tHTML('clsgrid.appenddesc', {
          num: `${formatNumber(options.limitAsset, symbolInfo.quotaPrecision)} ${quota}`,
        })}
      </Text>

      <Text as="div" fs={14} mb={12} color="text60" lh="130%">
        {options.useBaseCurrency &&
          _tHTML('clsgrid.ordersecondsurelayout', {
            base,
            quota,
            baseAmount: formatNumber(realInverst.needInverstBase, symbolInfo.basePrecision),
            quotaAmount: formatNumber(realInverst.needInverstQuota, symbolInfo.quotaPrecision),
          })}

        {realInverst.deelBaseNum !== 0 && (
          <>
            {comma}
            {_tHTML('infnty.transactionhint', {
              deal: realInverst.deelBaseNum > 0 ? _t('buyin') : _t('sellout'),
              amount: formatNumber(Math.abs(realInverst.deelBaseNum), symbolInfo.basePrecision),
              base,
              quota,
            })}
          </>
        )}
      </Text>

      <Row label={_t('share5')} value={symbolNameText} />
      <Row
        label={_t('minprice')}
        unit={quota}
        value={formatNumber(options.down, symbolInfo.pricePrecision)}
      />
      <Row label={_t('pergridpr')} value={floatToPercent(options.gridProfitRatio ?? 0)} />
      <HintText onClick={jumpHandler}>{_tHTML(`addinverstrangehint`, { base, quota })}</HintText>
    </>
  );
};

const AddInvert = ({ actionSheetRef, item, onFresh }) => {
  const optionsRef = useRef();
  const sureActionSheetRef = useRef();
  const symbolInfo = useSpotSymbolInfo(item.symbol);
  return (
    <>
      <DialogRef
        ref={actionSheetRef}
        title={_t('smart.addinverst')}
        cancelText={null}
        okText={_t('gridwidget6')}
        onCancel={() => actionSheetRef.current.toggle()}
        onOk={() => actionSheetRef.current.confirm()}
        size="medium"
        maskClosable
      >
        <AddInvestment
          optionsRef={optionsRef}
          actionSheetRef={actionSheetRef}
          sureActionSheetRef={sureActionSheetRef}
          item={item}
          symbolInfo={symbolInfo}
        />
      </DialogRef>
      {/* 二次确认提示 */}
      <DialogRef
        ref={sureActionSheetRef}
        title={_t('gridwidget5')}
        cancelText={null}
        okText={_t('gridwidget6')}
        onCancel={() => sureActionSheetRef.current.toggle()}
        onOk={() => sureActionSheetRef.current.confirm()}
        size="medium"
        maskClosable
      >
        <OrderSure
          optionsRef={optionsRef}
          symbolInfo={symbolInfo}
          sureActionSheetRef={sureActionSheetRef}
          onFresh={onFresh}
        />
      </DialogRef>
    </>
  );
};

const defaultProps = { item: {} };

export default CloseDataRef(AddInvert, defaultProps);

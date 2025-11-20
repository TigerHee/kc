/**
 * Owner: mike@kupotech.com
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatNumber, jump, getAvailLang, getLang } from 'Bot/helper';
import { calcBuySellNum } from 'ClassicGrid/util';
import Row from 'Bot/components/Common/Row';
import HintText from 'Bot/components/Common/HintText';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { getAppendMinInvestment, appendInvestment } from 'ClassicGrid/services';
import useStateRef from '@/hooks/common/useStateRef';
import useBalance from 'Bot/hooks/useBalance';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import Investment from 'ClassicGrid/Create/Investment';
import { tipConfig } from 'ClassicGrid/config';
import { _t, _tHTML } from 'Bot/utils/lang';
import CloseDataRef from 'Bot/components/Common/CloseDataRef';
import { useSnackbar } from '@kux/mui';
import { withForm } from 'Bot/components/Common/CForm';
import { Text } from 'Bot/components/Widgets';

const templateId = 1;
const AddInvestment = withForm({
  initialValues: { useBaseCurrency: 0 },
})(({ optionsRef, actionSheetRef, sureActionSheetRef, form, item, symbolInfo }) => {
  let { depth: gridNum, price: lastTradedPrice, down: min, up: max } = item;
  const { symbol, id: taskId } = item;

  gridNum = +gridNum;
  lastTradedPrice = +lastTradedPrice;
  min = +min;
  max = +max;
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
    isUseBase: useBaseCurrency,
    symbol,
    inverst: limitAsset,
    lastTradedPrice,
    max,
    min,
    gridNum,
    precision: symbolInfo,
    targetMin: symbolInfo,
    templateId,
    taskId,
    symbolAccount: balance.quoteAmount,
    baseAccount: balance.baseAmount,
  };

  const setInProp = {
    options: {
      ...allParams,
      ...calcBuySellNum(allParams),
    },
  };
  optionsRef.current = setInProp.options;
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
        buySellNum={setInProp.options}
        minInvest={minInverst}
      />
    </div>
  );
});

const OrderSure = ({ partSuccRef, symbolInfo, optionsRef, sureActionSheetRef, onFresh }) => {
  const options = optionsRef.current;
  const { quotaPrecision, basePrecision, pricePrecision, base, quota, symbolNameText } = symbolInfo;
  const { message } = useSnackbar();
  const useDataRef = useStateRef({
    options,
  });
  // 二次确定终极提交
  const onConfirm = useCallback(() => {
    const { options: moptions } = useDataRef.current;

    sureActionSheetRef.current.updateBtnProps({
      okButtonProps: { loading: true },
    });
    const submitData = {
      addAmount: +moptions.inverst,
      baseAmount: +moptions.needInverstBase,
      quoteAmount: +moptions.needInverstQuota,
      taskId: moptions.taskId,
    };
    try {
      appendInvestment(submitData)
        .then(({ data }) => {
          if (data) {
            sureActionSheetRef.current.toggle();
            // 部分成功
            if (!data?.isAllSuccess) {
              optionsRef.current.inverstformat =
                formatNumber(moptions.inverst, quotaPrecision) + quota;
              optionsRef.current.quoteAmountformat =
                formatNumber(data.quoteAmount ?? 0, quotaPrecision) + quota;
              partSuccRef.current.toggle();
            } else {
              message.success(_t('runningdetail'));
              onFresh && onFresh();
            }
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
  const comma = options.isUseBase ? (getLang() === 'zh_CN' ? '。' : '. ') : '';

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
          num: `${formatNumber(options.inverst, quotaPrecision)} ${quota}`,
        })}
      </Text>
      <Text as="div" fs={14} mb={12} color="text60" lh="130%">
        {!!options.isUseBase &&
          _tHTML('clsgrid.ordersecondsurelayout', {
            base,
            quota,
            baseAmount: formatNumber(options.needInverstBase, basePrecision),
            quotaAmount: formatNumber(options.needInverstQuota, quotaPrecision),
          })}
        {options.deelBaseNum !== 0 && (
          <>
            {comma}
            {_tHTML(`clsgrid.transactionhint1`, {
              deal: options.deelBaseNum > 0 ? _t('buyin') : _t('sellout'),
              amount: formatNumber(Math.abs(options.deelBaseNum), basePrecision),
              base,
              quota,
            })}
          </>
        )}
      </Text>

      <Row label={_t('share5')} value={symbolNameText} />
      <Row
        label={_t('card13')}
        unit={quota}
        value={`${formatNumber(options.min, pricePrecision)}～${formatNumber(
          options.max,
          pricePrecision,
        )}`}
      />
      <Row label={_t('robotparams10')} unit={_t('unit')} value={options.gridNum - 1} />

      <HintText onClick={jumpHandler}>{_tHTML(`addinverstrangehint`, { base, quota })}</HintText>
    </>
  );
};

const AddInvert = ({ actionSheetRef, item, onFresh, noNeedProgressAnimation }) => {
  const optionsRef = useRef();
  const sureActionSheetRef = useRef();
  const partSuccRef = useRef();
  const symbolInfo = useSpotSymbolInfo(item.symbol);
  const options = optionsRef.current;
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
          partSuccRef={partSuccRef}
          optionsRef={optionsRef}
          symbolInfo={symbolInfo}
          sureActionSheetRef={sureActionSheetRef}
          onFresh={onFresh}
          noNeedProgressAnimation={noNeedProgressAnimation}
        />
      </DialogRef>
      {/* 部分成功提示 */}
      <DialogRef
        ref={partSuccRef}
        okText={_t('gridform24')}
        cancelText={null}
        title={_t('smart.addinverst')}
        onOk={() => partSuccRef.current.toggle()}
        onCancel={() => partSuccRef.current.toggle()}
        maskClosable
      >
        <Text color="text" fs={14}>
          {_tHTML('clsgrid.zhuijianotperfect', {
            value: options?.inverstformat ?? 0,
            realValue: options?.quoteAmountformat ?? 0,
          })}
        </Text>
      </DialogRef>
    </>
  );
};

const defaultProps = { item: {} };

export default CloseDataRef(AddInvert, defaultProps);

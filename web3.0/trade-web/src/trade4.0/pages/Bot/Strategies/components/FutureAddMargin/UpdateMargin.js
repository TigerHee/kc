/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import InputNumber from 'Bot/components/Common/InputNumber';
import FutureTag from 'Bot/components/Common/FutureTag';
import useBalance from 'Bot/hooks/useBalance';
import AccountBalance from 'Bot/components/Common/Investment/AccountBalance';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { _t } from 'Bot/utils/lang';
import { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { formatNumber, getFormErr } from 'Bot/helper';
import { Flex, Text } from 'Bot/components/Widgets';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import styled from '@emotion/styled';

const Box = styled.div`
  font-size: 12px;
  line-height: 130%;
  margin: 12px 0;
  display: flex;
  .add-row {
    margin-top: 6px;
    margin-bottom: 6px;
  }
  .flex1 {
    flex: 1;
  }
  .flex {
    display: flex;
  }
  .sb {
    justify-content: space-between;
  }
  .flexwrap {
    flex-wrap: wrap;
  }
  .text-color {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Table = React.memo(({ deposit, blowUpPrice, newDeposit, newBlowUpPrice, precision }) => {
  return (
    <Box>
      <div className="flex1 mr-30">
        <Text color="text">{_t('futrgrid.nowmarginlayout')}</Text>
        <div className="Flex sb flexwrap add-row">
          <Text color="text40">{_t('futrgrid.marginnum')}</Text>
          <span className="text-color">{formatNumber(deposit, precision)}</span>
        </div>
        <div className="Flex sb flexwrap">
          <Text color="text40">{_t('futrgrid.blowupprice')}</Text>
          <span className="text-color">{formatNumber(blowUpPrice, precision)}</span>
        </div>
      </div>
      <div className="flex1">
        <Text color="primary">{_t('futrgrid.afteradd')}</Text>
        <div className="Flex sb flexwrap add-row">
          <Text color="text40">{_t('futrgrid.marginnum')}</Text>
          <span className="text-color">{formatNumber(newDeposit, precision)}</span>
        </div>
        <div className="Flex sb flexwrap">
          <Text color="text40">{_t('futrgrid.blowupprice')}</Text>
          <span className="text-color">{formatNumber(newBlowUpPrice, precision)}</span>
        </div>
      </div>
    </Box>
  );
});
/**
 * @description: 获取追加后的保证金
 * @param {*} amount
 * @param {*} amountHasErr
 * @param {*} deposit
 * @param {*} precision
 * @return {*}
 */
const getNewDeposit = ({ amount, amountHasErr, deposit, precision }) => {
  let newDeposit = 0;
  if (amountHasErr) {
    return (newDeposit = 0);
  }
  if (amount !== undefined && amount) {
    newDeposit = Decimal(deposit).add(amount).toFixed(precision, Decimal.ROUND_DOWN);
  }
  return newDeposit;
};

const Layer = ({
  symbolInfo,
  item,
  onFresh,
  actionSheetRef,
  apiConfig,
  hasPreCalcBlowUpPrice = true,
}) => {
  const { submit, calcBlowUp } = apiConfig;
  const [form] = Form.useForm();
  Form.useWatch([], form);

  const { quotaPrecision, symbolNameText, quota, symbolCode } = symbolInfo;

  const [newBlowUpPrice, setNewBlowUpPrice] = useState(0);

  let { totalCost: deposit, blowUpPrice } = item;
  const { direction, leverage, id: taskId } = item;
  deposit = deposit || 0;
  blowUpPrice = blowUpPrice || 0;

  const balance = useBalance(symbolInfo, 0, false);
  const { quoteAmount } = balance;
  const canInputMax = Math.floor(quoteAmount);

  // 提交
  const onSubmit = useCallback(() => {
    form.validateFields().then(async (values) => {
      actionSheetRef.current.updateBtnProps({
        okButtonProps: {
          loading: true,
        },
      });
      try {
        await submit({
          taskId,
          amount: Number(values.amount),
        });
        actionSheetRef.current.toggle();
        onFresh && onFresh();
      } catch (error) {
        console.log(error);
      } finally {
        actionSheetRef.current.updateBtnProps({
          okButtonProps: {
            loading: false,
          },
        });
      }
    });
  }, [form, taskId, onFresh]);

  const amount = form.getFieldValue('amount');
  const amountHasErr = getFormErr(form.getFieldError('amount'));

  const newDeposit = getNewDeposit({ amount, amountHasErr, deposit, precision: quotaPrecision });

  // 处理实时输入，并且没有报错，防抖，就发起请求
  const calcBlowUpPriceThrottle = useRef(
    _.throttle((addAmount) => {
      if (typeof calcBlowUp === 'function') {
        calcBlowUp({ taskId, addAmount }).then(({ data }) => {
          setNewBlowUpPrice(data);
        });
      }
    }, 1000),
  );

  useEffect(() => {
    if (hasPreCalcBlowUpPrice) {
      if (!amountHasErr && Number(amount) > 0) {
        calcBlowUpPriceThrottle.current(amount);
      } else {
        setNewBlowUpPrice('');
      }
    }
  }, [amount, amountHasErr]);
  // 处理实时输入，并且没有报错，防抖，就发起请求

  const validator = useCallback(
    (rule, value, cb) => {
      value = +value;
      if (!value) {
        return cb(_t('futrgrid.inputmargin'));
      }
      if (value > canInputMax) {
        cb(_t('auto.needtotransfer'));
      }
      cb();
    },
    [canInputMax],
  );

  // 账户金额变化，重新校验
  useEffect(() => {
    if (form.getFieldValue('amount')) {
      form.validateFields(['amount'], { force: true });
    }
  }, [quoteAmount]);

  useBindDialogButton(actionSheetRef, {
    onConfirm: onSubmit,
  });

  return (
    <Form form={form}>
      <Flex vc mb={12}>
        <Text color="text" fs={16} mr={6}>
          {symbolNameText}
        </Text>
        <FutureTag direction={direction} leverage={leverage} />
      </Flex>

      <FormItem
        name="amount"
        rules={[
          {
            required: true,
            validator,
          },
        ]}
      >
        <InputNumber
          maxPrecision={quotaPrecision}
          unit={quota}
          min={0}
          placeholder={_t('fortip')}
          label={_t('fortip')}
        />
      </FormItem>

      <AccountBalance symbolCode={symbolCode} mt={0} />

      {hasPreCalcBlowUpPrice && (
        <Table
          precision={symbolInfo.quotaPrecision}
          deposit={deposit}
          blowUpPrice={blowUpPrice}
          newDeposit={newDeposit}
          newBlowUpPrice={newBlowUpPrice}
        />
      )}

      <Text color="complementary" fs={12} lh="130%" as="div">
        {_t('tomore')}
      </Text>
    </Form>
  );
};
export default Layer;

/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import { getInverstMax } from 'AutomaticInverst/config';
import { useSelector } from 'dva';
import Row from 'Bot/components/Common/Row';
import { _t } from 'Bot/utils/lang';
import { formatNumber } from 'Bot/helper';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import { Text } from 'Bot/components/Widgets';

/**
 * @description: 修改每次投资额度
 * @return {*}
 */
const InvestEvery = ({ dialogRef, onConfirmRef, dataRef }) => {
  const [form] = Form.useForm();
  Form.useWatch([], form);
  const isLoading = useSelector(
    (state) => state.loading.effects['automaticinverst/updateBotParams'],
  );
  const { open, symbolInfo, balance, disableUpdateInvestEvery, params } = dataRef.current;
  const { quota, base, basePrecision, pricePrecision, symbolCode } = symbolInfo;

  // 距离下次投资时间已不足2分钟，您暂时无法修改投资额
  const warn = disableUpdateInvestEvery ? _t('auto.cannotupdateinverst') : null;
  const canInputMax = getInverstMax(symbolCode);

  const onConfirm = () => {
    if (disableUpdateInvestEvery || isLoading) return;
    form.validateFields().then((values) => {
      onConfirmRef.current(values).then(dialogRef.current.close);
    });
  };
  useBindDialogButton(dialogRef, {
    onConfirm,
  });
  return (
    <>
      <Text color="text60" fs={14} as="div">
        <Form
          form={form}
          initialValues={{
            amount: params.amount,
          }}
        >
          <Text color="text" as="div" mb={12}>
            {_t('auto.perinvertmuch')}
          </Text>
          <FormItem
            name="amount"
            rules={[
              {
                required: true,
                validator: (rule, value, cb) => {
                  value = Number(value);
                  if (!value) {
                    return cb(_t('auto.inputinverst'));
                  }
                  if (value > Number(balance.quoteAmount)) {
                    cb(_t('auto.needtotransfer'));
                  }
                  if (value > canInputMax) {
                    cb(
                      _t('auto.maxinverst', {
                        num: formatNumber(canInputMax) + quota,
                      }),
                    );
                  }
                  if (value < 1) {
                    cb(_t('auto.mininverst'));
                  }
                  cb();
                },
              },
            ]}
            error={warn}
          >
            <InputNumber unit={quota} min={1} maxPrecision={0} controls={false} />
          </FormItem>
        </Form>

        <Row
          label={_t('auto.hasinvertnum2')}
          value={formatNumber(open.totalSize, basePrecision)}
          unit={base}
        />
        <Row
          label={_t('auto.currentprice')}
          value={formatNumber(open.symbolCurrentPrice, pricePrecision)}
          unit={quota}
        />
        <Row
          label={_t('auto.commonpricehold')}
          value={formatNumber(open.avgBuyPrice, pricePrecision)}
          unit={quota}
        />
      </Text>
    </>
  );
};

const InvestEveryWrap = React.memo(({ dialogRef, onConfirmRef, dataRef }) => {
  return (
    <DialogRef
      cancelText={null}
      okText={_t('gridwidget6')}
      onCancel={() => dialogRef.current.close()}
      onOk={() => dialogRef.current.confirm()}
      ref={dialogRef}
      title={_t('auto.updateinverstmuch')}
      size="medium"
      maskClosable
    >
      <InvestEvery dialogRef={dialogRef} onConfirmRef={onConfirmRef} dataRef={dataRef} />
    </DialogRef>
  );
});

export default InvestEveryWrap;

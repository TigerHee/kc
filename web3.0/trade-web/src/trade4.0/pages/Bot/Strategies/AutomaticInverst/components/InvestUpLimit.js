/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import Decimal from 'decimal.js';
import { useSelector } from 'dva';
import { _t } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import { formatNumber } from 'Bot/helper';
import { Form } from 'Bot/components/Common/CForm';
import Row from 'Bot/components/Common/Row';

const maxTotalCostLimit = 50000000;
const getHadCost = (params, totalCost) => {
  return Decimal.max(
    params.maxTotalCost || 0,
    Decimal(params.amount || 0).add(totalCost || 0),
  ).toNumber();
};

/**
 * @description: 策略参数修改定投上限
 * @return {*}
 */
const UpLimit = ({ dataRef, dialogRef, onConfirmRef }) => {
  const [form] = Form.useForm();
  Form.useWatch([], form);
  const isLoading = useSelector(
    (state) => state.loading.effects['automaticinverst/updateBotParams'],
  );
  const { open, symbolInfo, params, id, onFresh } = dataRef.current;
  const { quota, pricePrecision } = symbolInfo;
  // 提交修改ref
  const onConfirm = () => {
    if (isLoading) return;
    form.validateFields().then((values) => {
      onConfirmRef.current(values).then(dialogRef.current.close);
    });
  };
  const hadCost = getHadCost(params, open.totalCost);
  const placeholder =
    hadCost > 0 ? _t('futrgrid.gridwidget2', { min: hadCost }) : _t('auto.useaccountassets');
  const restInverst = params.maxTotalCost
    ? Decimal(params.maxTotalCost || 0)
        .sub(open.totalCost || 0)
        .toNumber()
    : 0;

  useBindDialogButton(dialogRef, {
    onConfirm,
  });
  return (
    <>
      <Text color="text60" fs={14} as="div">
        <Form form={form}>
          <Text color="text" mb={12} as="div">
            {_t('auto.upistlmtamout')}
          </Text>
          <Form.FormItem
            name="maxTotalCost"
            rules={[
              {
                required: true,
                validator: (rule, value, cb) => {
                  value = +value;
                  if (!value) {
                    return cb(_t('auto.enteruplimit'));
                  }
                  if (value > maxTotalCostLimit) {
                    cb(_t('auto.ivstuplmitshouldless'));
                  }
                  if (value < hadCost) {
                    cb(_t('auto.ivstuplmitshouldmore', { num: hadCost }));
                  }

                  cb();
                },
              },
            ]}
          >
            <InputNumber
              unit={quota}
              max={maxTotalCostLimit}
              maxPrecision={0}
              controls={false}
              placeholder={placeholder}
            />
          </Form.FormItem>
        </Form>
        <Row
          label={_t('auto.hasinverstnum')}
          value={formatNumber(open.totalCost, pricePrecision)}
          unit={quota}
        />

        {!!restInverst && (
          <Row
            label={_t('auto.restistlmtamout')}
            value={formatNumber(restInverst, pricePrecision)}
            unit={quota}
          />
        )}
      </Text>
      <Text as="div" color="complementary" mt={12} fs={14}>
        {_t('auto.upistlmtamouthint')}
      </Text>
    </>
  );
};

/**
 * @description: 运行中修改定投上限，运行中没有相关参数，需要单独处理获取
 * @param {*} dialogRef
 * @param {*} id
 * @param {*} symbolInfo
 * @param {*} onFresh
 * @param {Number} totalCost 总投资额度
 * @return {*}
 */
// const UpLimitOnRunning = ({ dialogRef, dataRef: dataRefProps }) => {
//   const params = useSelector((state) => state.automaticinverst.runParams);
//   const dispatch = useDispatch();
//   useLayoutEffect(() => {
//     dispatch({
//       type: 'automaticinverst/getParameter',
//       payload: {
//         id,
//       },
//     });
//   }, []);
//   const { id, symbolInfo, onFresh, totalCost } = dataRefProps.current;
//   const dataRef = useStateRef({
//     id,
//     onFresh,
//     symbolInfo,
//     params,
//     open: {
//       totalCost,
//     },
//   });

//   return <UpLimit dialogRef={dialogRef} dataRef={dataRef} />;
// };

/**
 * @description: 修改定投上限dialog包装
 * @prop {ReactRef} dialogRef 弹窗Ref
 * @prop {ReactRef} dataRef 数据Ref
 * @prop {String} type [Paramater | Running]
 * @return {*}
 */
export default ({ dialogRef, dataRef, onConfirmRef, type = 'Paramater' }) => {
  return (
    <DialogRef
      cancelText={null}
      okText={_t('gridwidget6')}
      onCancel={() => dialogRef.current.close()}
      onOk={() => dialogRef.current.confirm()}
      ref={dialogRef}
      title={_t('auto.upinvestuplimit')}
      size="medium"
      maskClosable
    >
      {/* 策略参数使用 */}
      {type === 'Paramater' && (
        <UpLimit dialogRef={dialogRef} dataRef={dataRef} onConfirmRef={onConfirmRef} />
      )}
      {/* 运行中修改 */}
      {/* {type === 'Running' && (
        <UpLimitOnRunning dialogRef={dialogRef} dataRef={dataRef} />
      )} */}
    </DialogRef>
  );
};

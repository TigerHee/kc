/**
 * Owner: odan.ou@kupotech.com
 */
// 手续费详情
import React, { memo, useMemo, Fragment } from 'react';
import { useResponsive } from '@kux/mui';
import { _t } from 'utils/lang';
import isNil from 'lodash/isNil';
// import Dialog from '@mui/Dialog';
import { add, sub } from 'helper';
import { numberFixed } from 'utils/tools';
import { dataEmptyFormat } from 'src/utils/data';
import { formatNumber } from '@/utils/format';
import { FeeContainer, FeeDetail, FeeDivider, DialogWrapper } from './style';

/**
 * 手续费详情
 * @param {{
 *  data: Record<string, any>,
 *  onChange: React.Dispatch<(prevState: undefined | Record<string, any>) => undefined | Record<string, any>>
 * }} props
 */
const FeeModal = (props) => {
  const { data, onChange } = props;
  const { sm } = useResponsive();
  const { deductionContext, feeCurrency, fee, coupanDeductFee } = data;
  // KCS 抵扣费用
  const hasKCSFee = !!deductionContext;
  // 抵扣券费率
  const hasCouponFee = !!coupanDeductFee && Number(coupanDeductFee) !== 0;
  const { deductionCurrency, refundAmount, exchangeAmount } = hasKCSFee
    ? JSON.parse(deductionContext)
    : {};
  const onClick = () => onChange();
  const KCSUnit = deductionCurrency || 'KCS';
  const list = useMemo(() => {
    return [
      {
        // 应扣手续费
        tKey: 'orders.c.order.detail.fee.total', // 翻译key
        val: hasCouponFee ? add(fee, coupanDeductFee).toFixed() : fee,
      },
      {
        // 手续费抵扣券
        tKey: 'orders.c.order.detail.fee.coupon',
        val: `-${coupanDeductFee}`,
        show: hasCouponFee,
      },
      {
        // 手续费预扣除
        tKey: 'orders.c.order.detail.fee.prev', // 翻译key
        val: fee,
        show: hasKCSFee,
      },
      {
        // 手续费退还
        tKey: 'orders.c.order.detail.fee.back',
        val: `-${refundAmount}`,
        show: hasKCSFee,
        prefix: <FeeDivider borderStyle="dashed" />,
      },
      {
        // KCS手续费扣除
        tKey: 'orders.c.order.detail.fee.actual',
        val: exchangeAmount,
        unit: KCSUnit,
        show: hasKCSFee,
      },
      {
        // 实际手续费
        tKey: 'orders.c.order.detail.fee.actual.pay',
        val: hasKCSFee ? exchangeAmount : fee,
        unit: hasKCSFee ? KCSUnit : feeCurrency,
        valClassName: 'red',
        prefix: <FeeDivider />,
      },
    ]
      .filter((item) => item.show !== false)
      .map((item, i) => {
        const itemConf = {
          valClassName: 'grey',
          unit: feeCurrency,
          ...item,
        };
        if (item.unit === 'KCS') {
          return {
            ...itemConf,
            val: numberFixed(item.val, 8),
          };
        }
        return itemConf;
      });
  }, [fee, feeCurrency, deductionCurrency, refundAmount, exchangeAmount, KCSUnit]);
  return (
    <DialogWrapper
      open
      back={false}
      onCancel={onClick}
      onOk={onClick}
      title={_t('orders.c.order.detail.fee.title.kcs')}
      okText={_t('confirm')}
      cancelText={null}
      maxWidth="sm"
    >
      <FeeContainer className={!sm ? 'xs' : ''}>
        {list.map(({ tKey, val, valClassName, unit, prefix }) => (
          <Fragment key={tKey}>
            {prefix}
            <FeeDetail>
              <span className="text">{_t(tKey)}</span>
              <span className={valClassName}>
                <span>{dataEmptyFormat(formatNumber(val))}</span>
                <div className="unit">{unit}</div>
              </span>
            </FeeDetail>
          </Fragment>
        ))}
      </FeeContainer>
    </DialogWrapper>
  );
};

export default memo(FeeModal);

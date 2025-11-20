/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2022-04-12 15:24:27
 * @Description: 逐仓杠杆增金领取弹窗
 */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { filter } from 'lodash';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { Dialog, Form } from '@kux/mui';
import { _t } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';
import MarginSymbolSelector from 'components/Margin/NewMarginSymbolSelector/kuxIndex';
import styles from './style.less';

const { FormItem, withForm } = Form;

export default withForm()(
  React.memo((props) => {
    useLocale();
    const dispatch = useDispatch();
    const { isolatedSymbols } = useSelector((state) => state.market);
    const { form, onCancel, open, currency, id, onKyc, ...otherProps } = props;
    const { setFieldsValue, validateFields } = form;

    const [loading, setLoading] = useState(false);

    const symbols = useMemo(() => {
      return currency
        ? filter(isolatedSymbols, (v) => v.symbol.split('-').includes(currency))
        : isolatedSymbols;
    }, [isolatedSymbols, currency]);

    useEffect(() => {
      if (open) {
        setFieldsValue({ tag: symbols[0]?.symbol });
      }
    }, [open, symbols]);

    const handleSubmit = useCallback(
      (e) => {
        validateFields().then((values) => {
          setLoading(true);
          dispatch({
            type: 'bonus/receiveMarginBonus',
            payload: {
              id,
              ...values,
            },
          })
            .then((res) => {
              if (res && res.success && onCancel) {
                onCancel(true);
              }
            })
            .catch((e) => {
              // 210023 —领取处理中
              // 210024 —赠金已过期
              // 210025 —当前的状态不能领取
              if (e && [210023, 210024, 210025].includes(+e.code) && onCancel) {
                onCancel(true);
              }
              // 210028 —KYC 不是 lv3 等级
              if (e && [210028].includes(+e.code)) {
                onCancel();
                onKyc && onKyc();
              }
            })
            .finally(() => {
              setLoading(false);
            });
        });
      },
      [id, onCancel],
    );

    return (
      <Dialog
        open={!!open}
        onCancel={onCancel}
        onOk={handleSubmit}
        className={styles.root}
        cancelText={_t('cancel')}
        okButtonProps={{ loading }}
        title={_t('4g66DmzuERxTrcBs7yFFEQ')}
        okText={_t('fiXJ6r1RRjfH5Vwfe4iLcR')}
        {...otherProps}
      >
        <FormItem label={_t('gVu4J1oCNgu7MvU9Q5DAXs')} name="tag">
          <MarginSymbolSelector symbols={symbols} />
        </FormItem>
      </Dialog>
    );
  }),
);

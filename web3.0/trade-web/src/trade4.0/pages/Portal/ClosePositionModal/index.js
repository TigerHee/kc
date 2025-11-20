/* eslint-disable react-hooks/exhaustive-deps */
/*
  * owner: borden@kupotech.com
 */
import React, { useMemo, useState, useEffect, useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'dva';
import { useSnackbar, useTheme, useResponsive } from '@kux/mui';
import Form from '@mui/Form';
import Alert from '@mui/Alert';
import Dialog from '@mui/Dialog';
import Select from '@mui/Select';
import usePair from '@/hooks/common/usePair';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import PositionStatus from '@/components/Margin/PositionStatus';
import { getIsolatedPositionSide } from '@/utils/stateGetter';
import { event } from '@/utils/event';
import { _t, _tHTML } from 'src/utils/lang';
import { format } from './utils';
import {
  Row,
  Tag,
  Text,
  Label,
  Value,
  Block,
  LinkFlag,
  Position,
  SymbolBox,
  PositionRow,
} from './style';

const { FormItem, useForm } = Form;

const ClosePositionModal = React.memo(() => {
  const [form] = useForm();
  const { colors } = useTheme();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const closePositionModalConfig = useSelector(
    state => state.isolated.closePositionModalConfig,
  );
  const confirmLoading = useSelector(
    state => state.loading.effects['isolated/oneClickLiquidation'],
  );

  const {
    tag,
    status,
    visible,
    baseAsset,
    quoteAsset,
    liabilityRate,
  } = closePositionModalConfig;

  const {
    baseInfo: { currencyName: baseName },
    quoteInfo: { currencyName: quoteName },
  } = usePair(tag);

  const {
    liability: baseLiability,
    availableBalance: baseAvailableBalance,
  } = baseAsset || {};
  const {
    liability: quoteLiability,
    availableBalance: quoteAvailableBalance,
  } = quoteAsset || {};
  // 存在负债的币种信息
  const liabilityInfo = [
    { currencyName: baseName, amount: baseLiability },
    { currencyName: quoteName, amount: quoteLiability },
  ].filter(v => (+v.amount > 0));
  // 存在负债的币种拼接成一个字符串
  const liabilityCurrenciesStr = liabilityInfo.map(v => v.currencyName).join(' + ');
  // 存在可用的币种信息
  const availableBalanceInfo = [
    { currencyName: baseName, amount: baseAvailableBalance },
    { currencyName: quoteName, amount: quoteAvailableBalance },
  ].filter(v => (+v.amount > 0));
  // 仓位多空方向配置
  const POSITION_SIDE = {
    long: {
      label: _t('7cunSACfoqG3XRhmmGBAJS'),
      bg: colors.primary,
    },
    short: {
      label: _t('nEuymt4xM5qYHNhXjLBvZe'),
      bg: colors.secondary,
    },
  };
  // 平仓模式配置
  const { list: MODELS, listMap: MODELS_MAP } = useMemo(() => {
    const list = [
      {
        value: 'liquidationLiability',
        label: _t('ds9vh64n6BDiEQz5KpupKq', {
          a: liabilityCurrenciesStr,
        }),
        describe: _t('iarMtr1aAtrtw2fCmPd6hY'),
      },
      {
        value: 'retainBase',
        label: _t('fMaATrqSynVCgfMBwrpQZn', { a: baseName }),
        describe: _t('oVGc1dLrVRaYfYgM2YGmSM', { a: baseName }),
      },
      {
        value: 'retainQuote',
        label: _t('fMaATrqSynVCgfMBwrpQZn', { a: quoteName }),
        describe: _t('oVGc1dLrVRaYfYgM2YGmSM', { a: quoteName }),
      },
    ];
    const listMap = {};
    list.forEach((item) => {
      listMap[item.value] = item;
    });
    return { list, listMap };
  }, [baseName, quoteName, liabilityCurrenciesStr]);

  const [model, setModel] = useState(MODELS[0].value);
  const [positionSide, setPositionSide] = useState('long');

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const nextPositionSide = getIsolatedPositionSide(closePositionModalConfig);
      setPositionSide(nextPositionSide);
    }
  }, [closePositionModalConfig]);

  const handleChangeModel = useCallback((v) => {
    setModel(v);
  }, []);

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'isolated/updateClosePositionModalConfig',
      payload: {
        visible: false,
      },
    });
  }, []);

  const handleOk = useCallback(() => {
    const values = form.getFieldsValue(true);
    dispatch({
      type: 'isolated/oneClickLiquidation',
      payload: {
        ...values,
        symbol: tag,
      },
    }).then((res) => {
      if (res?.success) {
        message.success(_t('operation.succeed'));
        event.emit('closePosition.success', { tag });
        handleCancel();
      }
    });
  }, [tag]);

  return (
    <Dialog
      size="medium"
      destroyOnClose
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={_t('confirm')}
      title={_t('vgzWfdsGbtgNLJrDpz1v4P')}
      cancelText={sm ? _t('cancel') : null}
      okButtonProps={{
        loading: confirmLoading,
      }}
    >
      <Row>
        <SymbolBox>
          {Boolean(POSITION_SIDE[positionSide]) && (
            <Tag bg={POSITION_SIDE[positionSide].bg}>
              {POSITION_SIDE[positionSide].label}
            </Tag>
          )}
          <SymbolCodeToName code={tag} />
        </SymbolBox>
        <PositionStatus
          disabled
          symbol={tag}
          status={status}
          showDashboard={false}
          liabilityRate={liabilityRate}
        />
      </Row>
      <Position>
        <PositionRow>
          <Label>{_t('192aSr8iuJPjs2fviG8dvg')}</Label>
          {liabilityInfo.length > 0 && (
            <Value>
              {format(liabilityInfo[0].amount)} {liabilityInfo[0].currencyName}
              {liabilityInfo.length > 1 && (
                <Fragment>
                  <LinkFlag>+</LinkFlag>
                  {format(liabilityInfo[1].amount)} {liabilityInfo[1].currencyName}
                </Fragment>
              )}
            </Value>
          )}
        </PositionRow>
        <PositionRow>
          <Label>{_t('bv4u5WW4GNncSY7BfkJmus')}</Label>
          {availableBalanceInfo.length > 0 && (
            <Value>
              {format(availableBalanceInfo[0].amount)} {availableBalanceInfo[0].currencyName}
              {availableBalanceInfo.length > 1 && (
                <Fragment>
                  <LinkFlag>+</LinkFlag>
                  {format(availableBalanceInfo[1].amount)} {availableBalanceInfo[1].currencyName}
                </Fragment>
              )}
            </Value>
          )}
        </PositionRow>
      </Position>
      <Block>
        <Form form={form}>
          <Text>{_t('dcVez5KYGQkhGQCRAiT45z')}</Text>
          <FormItem noStyle name="model" initialValue={MODELS?.[0]?.value}>
            <Select options={MODELS} onChange={handleChangeModel} />
          </FormItem>
          <Text>{MODELS_MAP?.[model]?.describe}</Text>
        </Form>
      </Block>
      <Block>
        <Alert
          showIcon
          type="warning"
          title={_tHTML('ftSJtRic8tEuRxjYUq86Fh')}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </Block>
    </Dialog>
  );
});

export default ClosePositionModal;

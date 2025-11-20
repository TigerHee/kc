/**
 * Owner: solar@kupotech.com
 */
// 所有数据变化都收口在这里。
// form-fields -> store(state) 的映射逻辑
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'tools/i18n';
import isNil from 'lodash-es/isNil';
import { useForceFormFieldChange } from '@transfer/hooks/fields';
import { useFormField } from './fields';
import { useFormInstance } from '../containers/Form/form';
import { useProps } from './props';
import { useGetConfigByAccount, useAccounts } from './accounts';
import { useTransferDispatch, useTransferSelector } from '../utils/redux';
import { setNumToPrecision } from '../utils/number';

export function useStateFieldsDeps() {
  const dispatchTransfer = useTransferDispatch();
  const supportAccounts = useAccounts();
  const getConfigByAccount = useGetConfigByAccount();
  const form = useFormInstance();
  const payAccountType = useFormField('payAccountType');
  const recAccountType = useFormField('recAccountType');
  const amount = useFormField('amount');
  const payTag = useFormField('payTag');
  const recTag = useFormField('recTag');
  const currency = useFormField('currency');
  const isBatchEnable = useTransferSelector(state => state.isBatchEnable);

  const { t: _t } = useTranslation('transfer');
  const forceFormUpdate = useForceFormFieldChange();

  const payConfig = useMemo(() => getConfigByAccount(payAccountType), [getConfigByAccount, payAccountType]);
  const recConfig = useMemo(() => getConfigByAccount(recAccountType), [getConfigByAccount, recAccountType]);

  const _payAccountType = useTransferSelector(state => state._payAccountType);
  const _recAccountType = useTransferSelector(state => state._recAccountType);
  const _payConfig = useMemo(() => getConfigByAccount(_payAccountType), [getConfigByAccount, _payAccountType]);
  const _recConfig = useMemo(() => getConfigByAccount(_recAccountType), [getConfigByAccount, _recAccountType]);
  const currencies = useTransferSelector(state => state.currencies);

  const total = useTransferSelector(state => state.total);

  const { baseLegalCurrency } = useProps(state => state.extInfo);
  const multiAccounts = useTransferSelector(state => state.multiAccounts);

  const allOptions = useMemo(
    () =>
      supportAccounts.map(item => ({
        value: item.account,
        label: item.getLabel(),
        icon: item.icon,
        topGap: item.topGap,
      })),
    [supportAccounts]
  );

  // 初始化payAccountOptions
  useEffect(() => {
    if (payConfig) {
      dispatchTransfer({
        type: 'update',
        payload: {
          payAccountOptions: payConfig.getOptions({
            oppositeAccount: recAccountType,
            supportOptions: allOptions,
            direction: 'pay',
          }),
        },
      });
    }
  }, [recAccountType, dispatchTransfer, payConfig, allOptions]);

  // 初始化recAccountOptions
  useEffect(() => {
    if (recConfig) {
      dispatchTransfer({
        type: 'update',
        payload: {
          recAccountOptions: recConfig.getOptions({
            oppositeAccount: payAccountType,
            supportOptions: allOptions,
            direction: 'rec',
          }),
        },
      });
    }
  }, [payAccountType, dispatchTransfer, allOptions, recConfig]);

  // 初始化paylabel
  useEffect(() => {
    if (payConfig) {
      dispatchTransfer({
        type: 'update',
        payload: {
          payAccountLabel: payConfig.getSelectedLabel({ tag: payTag }),
        },
      });
    }
  }, [payConfig, payTag, dispatchTransfer, _t]);

  // 初始化reclabel
  useEffect(() => {
    if (recConfig) {
      dispatchTransfer({
        type: 'update',
        payload: {
          recAccountLabel: recConfig.getSelectedLabel({ tag: recTag }),
        },
      });
    }
  }, [dispatchTransfer, recTag, recConfig, _t]);

  // 获取currencies(直接更新在effects中了)
  useEffect(() => {
    if (payAccountType && recAccountType && payConfig && multiAccounts.length) {
      payConfig.getCurrencies(
        {
          payAccountType,
          recAccountType,
          baseLegalCurrency,
          payTag,
          recTag,
          multiAccounts,
        },
        { dispatchTransfer }
      );
    }
  }, [
    dispatchTransfer,
    payAccountType,
    recAccountType,
    payConfig,
    baseLegalCurrency,
    recTag,
    payTag,
    forceFormUpdate,
    multiAccounts,
  ]);

  // 获取可转余额
  useEffect(() => {
    if (payAccountType && recAccountType && currency && payConfig) {
      const tags = [payTag, recTag].filter(tag => tag !== '');
      // 如果单边逐仓，要确保currency在tag中
      if (tags.length === 1) {
        if (!tags[0].split('-').includes(currency)) {
          return;
        }
      }
      payConfig.getAvaliable(
        {
          payAccountType,
          recAccountType,
          currency,
          payTag,
          recTag,
        },
        { dispatchTransfer }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, currencies]);

  // 如果在切换账户后,当前选中币种不在币种集合里，自动回填第一个币种
  useEffect(() => {
    if (currencies?.length && !currencies.some(_currency => _currency.currency === currency)) {
      forceFormUpdate(() => ({
        currency: currencies[0].currency,
      }));
    }
  }, [currencies, currency, forceFormUpdate]);

  // 切换币种时，更新币种精度
  useEffect(() => {
    const current = currencies.find(_currency => _currency.currency === currency);
    if (current) {
      const { precision } = current;
      dispatchTransfer({
        type: 'update',
        payload: {
          precision,
        },
      });
      forceFormUpdate(() => ({
        amount: setNumToPrecision(amount, precision),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, currencies, dispatchTransfer]);

  // 切换币种时，拉取新的各账户余额
  // NOTE 暂时web不需要展示余额，此接口只在初始话调用，用来拿各账户开通情况
  useEffect(() => {
    dispatchTransfer({
      type: 'pullAccountsAvailableByCurrency',
    });
  }, [dispatchTransfer]);

  // 获取是否支持批量划转
  useEffect(() => {
    if (payAccountType && recAccountType && payConfig) {
      payConfig.getSupportBatch(
        {
          payAccountType,
          recAccountType,
        },
        { dispatchTransfer }
      );
    }
  }, [dispatchTransfer, payAccountType, recAccountType, payConfig]);

  // 当切换 payAccountType 和 recAccountType 时(不是真的切换，只是过渡阶段，不更新表单值），更新 payAccountSubOptions recAccountSubOptions
  useEffect(() => {
    if (_recConfig?.getTags) {
      _recConfig.getTags(
        {
          updateSubOptionsKey: 'recAccountSubOptions',
          oppositeTag: payTag,
          baseLegalCurrency,
        },
        {
          dispatchTransfer,
        }
      );
    }
    if (_payConfig?.getTags) {
      _payConfig.getTags(
        {
          updateSubOptionsKey: 'payAccountSubOptions',
          oppositeTag: recTag,
          baseLegalCurrency,
        },
        {
          dispatchTransfer,
        }
      );
    }
  }, [_payConfig, _recConfig, baseLegalCurrency, dispatchTransfer, payTag, recTag]);

  // 当total变化时，要触发下amount的校验
  useEffect(() => {
    const hasError = form.getFieldError('amount')?.length;
    const hasNoInput = !isNil(amount) && amount !== '';
    // 如果当前数字校验已经出现错误，或者用户没有输入过，再触发下amount的校验
    if (hasError || hasNoInput) {
      form.validateFields(['amount']);
    }
  }, [total, amount, form]);

  // 当切换账户时，要清空选中的批量币种
  useEffect(() => {
    if (isBatchEnable) {
      dispatchTransfer({
        type: 'update',
        payload: {
          selectedKeys: [],
        },
      });
    }
  }, [payAccountType, recAccountType, isBatchEnable, dispatchTransfer]);

  useEffect(() => {
    // 如果是初始是逐仓，需要更新_payAccountType和_recAccountType，触发deps.js的更新payAccountSubOptions和recAccountSubOptions逻辑
    if (payAccountType) {
      dispatchTransfer({
        type: 'update',
        payload: {
          _payAccountType: payAccountType,
        },
      });
    }
    if (recAccountType) {
      dispatchTransfer({
        type: 'update',
        payload: {
          _recAccountType: recAccountType,
        },
      });
    }
  }, [payAccountType, recAccountType, dispatchTransfer]);
}

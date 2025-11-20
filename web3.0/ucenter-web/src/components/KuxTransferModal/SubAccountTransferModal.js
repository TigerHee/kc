/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { Box, Button, Dialog, Form, InputNumber, Select } from '@kux/mui';
import { useColor } from '@kux/mui/hooks';
import { useDebounceFn } from 'ahooks';
import CoinCurrency from 'components/common/CoinCurrency';
import Cascader from 'components/common/KuxCascader';
import KuxCoinSelector from 'components/common/KuxCoinSelector';
import { numberFixed } from 'helper';
import { debounce, filter, indexOf, isEqual, map, some, uniq } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { ReactComponent as ICArrow } from 'static/assets/arrow-down.svg';
import transferIcon from 'static/assets/transfer-vertical.svg';
import { _t } from 'tools/i18n';
import { track, trackClick } from 'utils/ga';
import NoSSG from '../NoSSG';
import Balance from './Balance';
import {
  ACCOUNT_CODE,
  ACCOUNT_MAP,
  subTypesKeyMap,
  SUB_ACCOUNT_MAP,
  symbolLabelWrap,
  typesKeyMap,
} from './config';
import MultiCoinsList from './MultiCoinsList';
import MultiSwitch from './MultiSwitch';
import { FormWrapper, Max, TransferBox } from './styles/index/style.js';
import SymbolSelector from './SymbolSelector';
import TransferTips from './Tips';

const { FormItem, useForm } = Form;
// 数字格式正则
const numReg = /^[0-9]+(\.?[0-9]*)?$/;

const maxSelectedLen = 20;

const formatSymbol = (symbol) => (symbol ? `${symbol}`.split('-') : []);
const getAccountWithoutSymbol = (account) => account[0];
// 两个数组是否存在交集
const isHaveIntersection = (arr1 = [], arr2 = []) => {
  const collectArr = [...uniq(arr1), ...uniq(arr2)];
  return uniq(collectArr).length !== collectArr.length;
};
const accounts2Options = (accounts, currentLang, symbols) => {
  return map(accounts, (item) => {
    const { key, label, ...other } = SUB_ACCOUNT_MAP[item] || {};
    if (!key) return {};
    const result = {
      value: key,
      label: label(currentLang),
      _label: label(currentLang),
      ...other,
    };
    if (key === ACCOUNT_CODE.ISOLATED || key === `SUB_${ACCOUNT_CODE.ISOLATED}`) {
      result.children = symbols.map((symbol) => {
        return {
          ...symbol,
          _label: symbolLabelWrap(symbol),
        };
      });
    }
    return result;
  });
};

const SubAccountTransferModal = React.memo((props) => {
  const colors = useColor();
  const needRunGetFromOptions = useRef(true);
  const needRunGetToOptions = useRef(true);
  // 保存当前from支持的币种
  const fromCurrenciesCache = useRef([]);
  const dispatch = useDispatch();
  const {
    main,
    trade,
    highFrequency,
    mainMap,
    tradeMap,
    highFrequencyMap,
    currencies: coins,
    isHFOpen,
  } = useSelector((state) => state.user_assets);
  const categories = useSelector((state) => state.categories);
  const { userPosition } = useSelector((state) => state.marginMeta);
  const { kumexOpenFlag } = useSelector((state) => state.overview);
  const { loanCurrenciesMap, crossCurrenciesMap } =
    useSelector((state) => state.marginConfig) || {};
  const {
    // transferConfig,
    // isolatedSymbols,
    mainIsolatedSymbols,
    subIsolatedSymbols,
    transferBalance: balance,
    isSupportBatch,
  } = useSelector((state) => state.transfer);
  const loadingBalance = useSelector(
    (state) => state.loading.effects['transfer/pullTransferBalance'],
  );
  const comfirmLoading = useSelector((state) => state.loading.effects['transfer/subTransfer']);
  const loadingCoins = useSelector(
    (state) => state.loading.effects['transfer/pullTransferCurrencies'],
  );
  const [form] = useForm();
  const {
    initDict,
    initCurrency,
    visible,
    initSubAccount,
    currentLang,
    curItem = {},
    ...restProps
  } = props;
  const { subName, uid, userId } = curItem;
  const { resetFields, setFieldsValue, getFieldValue, validateFields } = form;
  const { openFlag } = userPosition || {};
  const { multiSiteConfig } = useMultiSiteConfig();

  // const [from, setFrom] = useState([]);
  // const [to, setTo] = useState([]);
  const from = Form.useWatch('from', form) || [];
  const to = Form.useWatch('to', form) || [];
  // 划出账户选项
  const [fromOptions, setFromOptions] = useState([]);
  // 划入账户选项
  const [toOptions, setToOptions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  // const [currency, setCurrency] = useState();
  // 消费表单currency字段的值
  const currency = Form.useWatch('currency', form);
  // 消费表单amount字段的值
  const amount = Form.useWatch('amount', form);
  // 消费表单subAccount字段的值
  const subAccountId = Form.useWatch('subAccount', form);
  // const [subAccountId, setSubAccountId] = useState();
  const [isBatchTransfer, setBatchTransfer] = useState(false); // 开启批量划转 不可切换账户类型
  const [selectedCurrencies, setSelectedCurrencies] = useState([]); // 批量币种
  const { precision } = categories[currency] || { precision: 8 };
  const fromAccount = getAccountWithoutSymbol(from);
  const toAccount = getAccountWithoutSymbol(to);

  const setFrom = (formValue) => {
    setFieldsValue({
      from: formValue,
    });
  };

  const setTo = (toValue) => {
    setFieldsValue({
      to: toValue,
    });
  };

  // 禁用账户
  const disabledAccounts = useMemo(() => {
    // 暂时去掉poolx账户
    const result = [ACCOUNT_CODE.POOL, `SUB_${ACCOUNT_CODE.POOL}`];
    const { userOpen, subUserOpen } = isHFOpen || {};
    if (openFlag === false) {
      result.push(
        ACCOUNT_CODE.MARGIN,
        ACCOUNT_CODE.ISOLATED,
        `SUB_${ACCOUNT_CODE.MARGIN}`,
        `SUB_${ACCOUNT_CODE.ISOLATED}`,
      );
    }
    if (kumexOpenFlag === false) {
      result.push(ACCOUNT_CODE.CONTRACT, `SUB_${ACCOUNT_CODE.CONTRACT}`);
    }
    // if (!userOpen) {
    //   result.push(ACCOUNT_CODE.TRADE_HF);
    // }
    // if (!subUserOpen) {
    //   result.push(`SUB_${ACCOUNT_CODE.TRADE_HF}`);
    // }
    return result;
  }, [openFlag, kumexOpenFlag, isHFOpen]);

  // 检测方向对的有效性, 不包含禁用账户(未开通账户), 且互相为可划转账户， 则为合法
  const checkIsAvailableDict = useCallback(
    (dicts) => {
      let result;
      try {
        if (dicts.length !== 2) {
          result = false;
        } else {
          const _dicts = dicts.map((v) => v[0]);
          // 是否包含禁用的账户
          const isContainDisabledAccounts = isHaveIntersection(_dicts, disabledAccounts);
          const isAvailablePair =
            indexOf(SUB_ACCOUNT_MAP[_dicts[1]].supportFromAccounts, _dicts[0]) > -1 &&
            indexOf(SUB_ACCOUNT_MAP[_dicts[0]].supportToAccounts, _dicts[1]) > -1;
          result = !isContainDisabledAccounts && isAvailablePair;
        }
      } catch (e) {
        result = false;
      }
      return result;
    },
    [disabledAccounts],
  );

  // 获取options
  const getOptions = useCallback(
    (dict = [], accountsKey = 'supportToAccounts') => {
      const [accountType, accountSymbol] = dict;
      const coinsArr = formatSymbol(accountSymbol);
      const accountConfig = SUB_ACCOUNT_MAP[accountType];
      if (!accountConfig || !accountConfig[accountsKey]) return [];
      let availableAccounts = filter(accountConfig[accountsKey], (item) => {
        const { checkCurrencyIsSupport } = SUB_ACCOUNT_MAP[item] || {};
        let result = !disabledAccounts.includes(item);
        if (item === ACCOUNT_CODE.ISOLATED && !mainIsolatedSymbols.length) {
          result = false;
        }
        if (item === `SUB_${ACCOUNT_CODE.ISOLATED}` && !subIsolatedSymbols.length) {
          result = false;
        }
        if (result && checkCurrencyIsSupport && coinsArr.length) {
          const isSupport = some(coinsArr, (v) =>
            checkCurrencyIsSupport({
              categories,
              crossCurrenciesMap,
              currency: v,
            }),
          );
          result = result && isSupport;
        }
        return result;
      });
      let symbols = [];
      if (
        some(
          availableAccounts,
          (item) => item === ACCOUNT_CODE.ISOLATED || item === `SUB_${ACCOUNT_CODE.ISOLATED}`,
        )
      ) {
        const isolatedSymbols =
          availableAccounts[0].indexOf('SUB_') > -1 ? subIsolatedSymbols : mainIsolatedSymbols;
        symbols = coinsArr.length
          ? filter(isolatedSymbols, ({ symbol }) => {
              return isHaveIntersection(formatSymbol(symbol), coinsArr) && symbol !== accountSymbol;
            })
          : [...isolatedSymbols];
      }
      if (!symbols.length) {
        availableAccounts = filter(
          availableAccounts,
          (item) => item !== ACCOUNT_CODE.ISOLATED && item !== `SUB_${ACCOUNT_CODE.ISOLATED}`,
        );
      }
      return accounts2Options(availableAccounts, currentLang, symbols);
    },
    [
      categories,
      crossCurrenciesMap,
      disabledAccounts,
      currentLang,
      mainIsolatedSymbols,
      subIsolatedSymbols,
    ],
  );

  // 检查币种是否支持划转的两个账户
  const checkIsAvailableCurrency = useCallback(
    (currencyCode, needCheckAccounts = ['from', 'to']) => {
      let result = true;
      map(needCheckAccounts, (item) => {
        const [accountType, symbol] = item === 'from' ? from : to;
        if (symbol) {
          result = formatSymbol(symbol).includes(currencyCode);
        } else {
          const { checkCurrencyIsSupport } = SUB_ACCOUNT_MAP[accountType] || {};
          const isSupportAccount = checkCurrencyIsSupport
            ? checkCurrencyIsSupport({
                categories,
                crossCurrenciesMap,
                currency: currencyCode,
              })
            : true;
          result = result && isSupportAccount;
        }
      });
      return result;
    },
    [categories, crossCurrenciesMap, from, to],
  );

  // 最大值小于0，为请求出错的情况，此时不校验最大值
  const max = (() => {
    // 获取最大可转数量
    let _max = balance || 0;
    // 储蓄和币币账户走推送
    // 2023.03.09 全部不走推送 统一接口
    // if (fromAccount === ACCOUNT_CODE.MAIN) {
    //   _max = (mainMap[currency] || {}).availableBalance || 0;
    // }
    // if (fromAccount === ACCOUNT_CODE.TRADE) {
    //   _max = (tradeMap[currency] || {}).availableBalance || 0;
    // }
    // if (fromAccount === ACCOUNT_CODE.TRADE_HF) {
    //   _max = (highFrequencyMap[currency] || {}).availableBalance || 0;
    // }
    return numberFixed(_max, precision);
  })();
  // 用于ui展示, 最小为0(用Math，遇到特别小的浮点数，会被转成科学计数法)
  // const displayMax = Math.max(max, 0);
  const displayMax = max > 0 ? max : 0;

  // 变更币种
  const setCurrentCurrency = useCallback((currentCurrency) => {
    // setCurrency(currentCurrency);
    setFieldsValue({ currency: currentCurrency });
  }, []);

  const handleCancel = useCallback((flag) => {
    // dispatch({
    //   type: 'transfer/updateTransferConfig',
    //   payload: {
    //     visible: false,
    //   },
    // });
    const { onCancel } = props;
    onCancel(flag);
    resetFields(['amount']);
  }, []);

  // 获取初始划转方向的值
  const getInitDirect = useCallback((initDict) => {
    if (
      Array.isArray(initDict) &&
      initDict.length === 2 &&
      SUB_ACCOUNT_MAP.filter((v) => initDict.includes(v.key)).length === 2
    ) {
      return initDict;
    }
    return [[ACCOUNT_CODE.MAIN], [`SUB_${ACCOUNT_CODE.MAIN}`]];
  }, []);

  const initDirection = useCallback(() => {
    const nextInitDict = getInitDirect(initDict);
    if (checkIsAvailableDict(nextInitDict)) {
      const [nextFrom, nextTo] = nextInitDict;
      const nextFromOptions = getOptions(nextTo);
      setFromOptions(nextFromOptions);
      setFrom(nextFrom);
      setTo(nextTo);
    }
  }, [initDict, checkIsAvailableDict, from, to]);

  // 调换转入与转出账户
  const reverse = useCallback(() => {
    if (checkIsAvailableDict([to, from])) {
      if (
        isEqual(
          SUB_ACCOUNT_MAP[to[0]].supportToAccounts,
          SUB_ACCOUNT_MAP[to[0]].supportFromAccounts,
        )
      ) {
        needRunGetToOptions.current = false;
      }
      if (
        isEqual(
          SUB_ACCOUNT_MAP[from[0]].supportToAccounts,
          SUB_ACCOUNT_MAP[from[0]].supportFromAccounts,
        )
      ) {
        needRunGetFromOptions.current = false;
      }
      setFromOptions(toOptions);
      setToOptions(fromOptions);
      setFrom(to);
      setTo(from);
      // setFieldsValue({ from: to, to: from });
    }
  }, [checkIsAvailableDict, from, to, fromOptions, toOptions]);

  const triggerAmountValidator = useCallback(
    (rule, value, callback) => {
      if (value === '') {
        callback(_t('form.required'));
        return;
      }
      if (!numReg.test(value) || +value <= 0) {
        callback(_t('trans.amount.num.err'));
        return;
      }
      value = +value;
      if (max >= 0 && value > max) {
        callback(`${_t('transfer.trans.avaliable')} ${max}`);
        return;
      }
      callback();
    },
    [max],
  );

  // 接口获取余额，储蓄和币币账户走推送，不用拉取 +高频
  // update 2023.03.09 获取余额接口更新，全部账户都用同一的接口获取余额 主要是为了支持场外借贷用户展示实际可划转余额
  const _queryBalance = useCallback(() => {
    const [fromAccountType, fromSymbol] = from;
    const [toAccountType, toSymbol] = to;
    if (fromAccountType && toAccountType && currency) {
      dispatch({
        type: 'transfer/pullTransferBalance',
        payload: {
          currency,
          accountType: fromAccountType.replace(/SUB_/, ''),
          toAccountType: toAccountType.replace(/SUB_/, ''),
          subUserId: subAccountId,
          direction: SUB_ACCOUNT_MAP[fromAccountType].direct,
          ...(fromSymbol ? { tag: fromSymbol } : {}),
          ...(toSymbol ? { toAccountTag: toSymbol } : {}),
        },
      })
        .then((res) => {
          if (res && res.success) {
            dispatch({
              type: 'transfer/update',
              payload: {
                transferBalance: res.data.availableBalance,
              },
            });
          }
        })
        .catch(() => {
          dispatch({
            type: 'transfer/update',
            payload: {
              transferBalance: -1,
            },
          });
        });
    }
  }, [from, to, subAccountId, currency]);

  const { run: queryBalance } = useDebounceFn(_queryBalance, {
    wait: 800,
  });

  // 接口获取币种列表
  const pullAssets = useMemo(
    () =>
      debounce(({ payload, cb }) => {
        dispatch({
          payload,
          type: 'transfer/pullTransferCurrencies',
          callback: (value) => {
            if (cb && typeof cb === 'function') {
              cb(value);
            }
          },
        });
      }, 100),
    [],
  );

  // 更新currencies
  const updateCurrencies = useCallback(
    (fromCurrencies) => {
      if (fromCurrencies) {
        fromCurrenciesCache.current = fromCurrencies;
      }
      let nextCurrencies = [...fromCurrenciesCache.current];
      // 即将更新的币种列表是否包含当前币种
      let isContainCurrentCurrency = false;
      const [fromAccountType, fromSymbol] = from;
      const [toAccountType, toSymbol] = to;
      const shouldCheck =
        SUB_ACCOUNT_MAP[fromAccountType]?.checkCurrencyIsSupport ??
        SUB_ACCOUNT_MAP[toAccountType]?.checkCurrencyIsSupport;
      // 逐仓账户或者其他支持划入划出的账户
      nextCurrencies = filter(nextCurrencies, (item) => {
        let isAvailable = true;
        if (toSymbol || shouldCheck) {
          isAvailable = item && checkIsAvailableCurrency(item.currency);
          if (isAvailable && item.currency === currency) {
            isContainCurrentCurrency = true;
          }
        } else if (item.currency === currency) {
          isContainCurrentCurrency = true;
        }
        return isAvailable;
      });
      // 逐仓账户组装余额 & 排序
      let isolatedSymbols = [];
      if (fromAccountType === ACCOUNT_CODE.ISOLATED) {
        isolatedSymbols = mainIsolatedSymbols;
      }
      if (fromAccountType === `SUB_${ACCOUNT_CODE.ISOLATED}`) {
        isolatedSymbols = subIsolatedSymbols;
      }
      if (
        (fromAccountType === ACCOUNT_CODE.ISOLATED ||
          fromAccountType === `SUB_${ACCOUNT_CODE.ISOLATED}`) &&
        isolatedSymbols.length
      ) {
        const { quote = {}, base = {} } =
          isolatedSymbols.find((isolatedSymbol) => isolatedSymbol.symbol === fromSymbol) || {};
        nextCurrencies = nextCurrencies
          .map((item) => {
            return {
              ...item,
              ...(item.currency === quote.currency ? quote : {}),
              ...(item.currency === base.currency ? base : {}),
            };
          })
          .sort((a, b) => b.availableBaseLegalCurrency - a.availableBaseLegalCurrency);
      }

      setCurrencies(nextCurrencies);
      if (!isContainCurrentCurrency && nextCurrencies.length) {
        // 当前币种不在可选列表中，默认选中第一个币种
        let nextCurrency = nextCurrencies[0].currency;
        // 仅一方为逐仓账户 默认选中逐仓的quote币种
        if ((fromSymbol || toSymbol) && !(fromSymbol && toSymbol)) {
          const [_, quoteCurrency = ''] = formatSymbol(fromSymbol ? fromSymbol : toSymbol);
          const quote = nextCurrencies.filter((item) => item.currency === quoteCurrency)[0];
          if (quote) {
            nextCurrency = quote.currency;
          }
        }
        setCurrentCurrency(nextCurrency);
      }
      queryBalance();
    },
    [from, to, mainIsolatedSymbols, subIsolatedSymbols, currency, checkIsAvailableCurrency],
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      validateFields().then((values) => {
        const [fromAccountType, fromSymbol] = from;
        const [toAccountType, toSymbol] = to;
        const commonPayload = { currency, amount: values.amount, subUserId: values.subAccount };
        const payload = {
          ...commonPayload,

          direction: SUB_ACCOUNT_MAP[fromAccountType].direct,
        };
        if (fromAccountType.indexOf('SUB_') === 0) {
          payload.subAccountType = fromAccountType.replace(/SUB_/, '');
          payload.accountType = toAccountType;
          payload.subTag = fromSymbol;
          payload.tag = toSymbol;
        } else {
          payload.subAccountType = toAccountType.replace(/SUB_/, '');
          payload.accountType = fromAccountType;
          payload.subTag = toSymbol;
          payload.tag = fromSymbol;
        }
        dispatch({
          payload,
          callback: handleCancel,
          type: 'transfer/subTransfer',
        });
      });
    },
    [currency, from, to, handleCancel],
  );

  const handleBatchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      validateFields().then(() => {
        if (!selectedCurrencies.length) {
          return;
        }
        if (
          some(
            selectedCurrencies,
            (item) =>
              !item.transferBalance ||
              +item.transferBalance <= 0 ||
              +item.transferBalance > item.availableBalance,
          )
        ) {
          return;
        }
        const [fromAccountType, fromSymbol] = from;
        const [toAccountType, toSymbol] = to;
        const commonPayload = {
          currencies: selectedCurrencies.map((item) => ({
            currency: item.currency,
            amount: item.transferBalance,
          })),
        };
        const payload = {
          ...commonPayload,
          subUserId: subAccountId,
          direction: SUB_ACCOUNT_MAP[fromAccountType].direct,
        };
        if (fromAccountType.indexOf('SUB_') === 0) {
          payload.subAccountType = fromAccountType.replace(/SUB_/, '');
          payload.accountType = toAccountType;
          payload.subTag = fromSymbol;
          payload.tag = toSymbol;
        } else {
          payload.subAccountType = toAccountType.replace(/SUB_/, '');
          payload.accountType = fromAccountType;
          payload.subTag = toSymbol;
          payload.tag = fromSymbol;
        }
        dispatch({
          payload,
          callback: (success, data = []) => {
            // 划转失败提示
            const failData = data.filter((item) => !item.result);
            if (failData && failData.length > 0) {
              dispatch({
                type: 'transfer/update',
                payload: {
                  subBatchFailedCurrencies: failData,
                },
              });
            }
            handleCancel(success);
          },
          type: 'transfer/batchTransfer',
        });
      });
    },
    [selectedCurrencies, from, to, handleCancel, subAccountId],
  );

  const handleSwitchChange = useCallback((checked) => {
    setBatchTransfer(checked);
    if (checked) {
      trackClick(['subaccountTransferWindow', '4']);
    }
  }, []);

  const handleSelectedCoins = useCallback((rowKeys, rows) => {
    setSelectedCurrencies(rows);
  }, []);

  // 划转账户变更 判断是否支持批量
  useEffect(() => {
    const [fromAccountType] = from;
    const [toAccountType] = to;
    if (fromAccountType && toAccountType) {
      dispatch({
        type: 'transfer/batchSupport',
        payload: {
          from: fromAccountType.replace(/SUB_/, ''),
          to: toAccountType.replace(/SUB_/, ''),
        },
      });
    }
  }, [from, to]);

  // 查询子账号逐仓账户交易对
  useEffect(() => {
    if (!subAccountId || !visible) {
      return;
    }
    dispatch({
      type: `transfer/pullSubIsolatedSymbols`,
      payload: {
        subUserId: subAccountId,
        bizType: 'SUB-ACCOUNT-TRANSFER',
      },
    });
  }, [dispatch, subAccountId, visible]);

  // 查询母账号逐仓账户交易对
  useEffect(() => {
    if (!visible) {
      return;
    }
    dispatch({
      type: `transfer/pullMainIsolatedSymbols`,
      payload: null,
    });
  }, [dispatch, visible]);

  // 每次打开弹框需要更新账户的相关配置
  useEffect(() => {
    if (visible) {
      // if (from.length) {
      //   setFieldsValue({ from });
      // }
      // if (to.length) {
      //   setFieldsValue({ to });
      // }
      // 拉取子账户
      // dispatch({
      //   type: 'transfer/pullAllSubAccount',
      // });
      if (initCurrency === currency) {
        queryBalance();
      }
      initDirection();
      if (openFlag === false) {
        dispatch({
          type: 'marginMeta/pullUserMarginPostion',
        });
      } else {
        // dispatch({
        //   type: 'transfer/pullIsolatedSymbols',
        //   payload: {
        //     subUserId: initSubAccount || {}.userId,
        //     bizType: 'SUB-ACCOUNT-TRANSFER',
        //   },
        // });
        dispatch({
          type: 'marginConfig/pullCrossCurrencies',
        });
        dispatch({
          type: 'marginConfig/pullLoanCurrencies',
        });
      }
      if (!kumexOpenFlag) {
        dispatch({
          type: 'overview/checkKumexIsOpen',
        });
      }
      // 获取高频账户是否开通
      dispatch({
        type: 'user_assets/queryUserHasSubHighAccount',
        payload: {
          subUserId: uid || '',
          userId: userId || '',
        },
      });
    } else {
      setBatchTransfer(false);
    }
  }, [visible]);

  // 初始币种变更
  useEffect(() => {
    if (checkIsAvailableCurrency(initCurrency) && initCurrency !== currency) {
      setCurrentCurrency(initCurrency);
    }
  }, [initCurrency]);

  // 初始币种变更
  useEffect(() => {
    // setSubAccountId(initSubAccount);
    setFieldsValue({ subAccount: initSubAccount });
  }, [initSubAccount]);

  // 初始划转方向变更
  useEffect(() => {
    // const nextInitDict = getInitDirect();
    // if (checkIsAvailableDict(nextInitDict)) {
    //   const [nextFrom, nextTo] = nextInitDict;
    //   // const nextFromOptions = getOptions(nextTo);
    //   // setFromOptions(nextFromOptions);
    //   if (nextFrom) {
    //     setFrom(nextFrom);
    //   }
    //   if (nextTo) {
    //     setTo(nextTo);
    //   }
    // }
    initDirection();
  }, [initDict]);

  // 获取划出的options
  useEffect(() => {
    // 在调转划出与划入账户时，阻止触发getOptions
    if (!needRunGetFromOptions.current) {
      needRunGetFromOptions.current = true;
      return;
    }
    const nextFromOptions = getOptions(to, 'supportFromAccounts');
    setFromOptions(nextFromOptions);
  }, [
    JSON.stringify(to),
    categories,
    disabledAccounts,
    currentLang,
    mainIsolatedSymbols,
    subIsolatedSymbols,
  ]);

  // 获取划入的options
  useEffect(() => {
    // 在调转划出与划入账户时，阻止触发getOptions
    if (!needRunGetToOptions.current) {
      needRunGetToOptions.current = true;
      return;
    }
    const nextToOptions = getOptions(from);
    setToOptions(nextToOptions);
  }, [
    JSON.stringify(from),
    categories,
    disabledAccounts,
    currentLang,
    mainIsolatedSymbols,
    subIsolatedSymbols,
  ]);

  // 划转优化需求 和app统一币种列表接口
  useEffect(() => {
    const [fromAccountType, fromSymbol] = from;
    if (visible && (ACCOUNT_MAP[fromAccountType] || SUB_ACCOUNT_MAP[fromAccountType])) {
      if (
        fromAccountType === ACCOUNT_CODE.ISOLATED ||
        fromAccountType === `SUB_${ACCOUNT_CODE.ISOLATED}`
      ) {
        const coinsArr = formatSymbol(fromSymbol);
        const nextCurrencies = map(coinsArr, (v) => categories[v]);
        updateCurrencies(nextCurrencies);
      } else {
        // 防止初始化账户切换时调多次接口 对请求接口做防抖处理只请求最后一次
        const isSub = fromAccountType.includes('SUB_');
        const accountType = fromAccountType.replace(/SUB_/, '');
        pullAssets({
          payload: {
            accountInfos: [
              {
                ...(isSub ? { subUserId: subAccountId } : {}),
                accountType,
              },
            ],
          },
          cb: (value) => {
            const { sub = {}, primary = {} } = value;
            const nextCurrencies = isSub ? sub[accountType] : primary[accountType];
            updateCurrencies(nextCurrencies);
          },
        });
      }
    }
  }, [from, visible, pullAssets, subAccountId]);

  // 划转账户变更，更新币种列表，并检测当前的币种是否支持，不支持重置币种为列表中的第一条
  // useEffect(() => {
  //   const [fromAccountType, fromSymbol] = from;
  //   if (fromAccountType === ACCOUNT_CODE.MAIN || fromAccountType === `SUB_${ACCOUNT_CODE.MAIN}`) {
  //     updateCurrencies(main);
  //   } else if (
  //     fromAccountType === ACCOUNT_CODE.TRADE ||
  //     fromAccountType === `SUB_${ACCOUNT_CODE.TRADE}`
  //   ) {
  //     updateCurrencies(trade);
  //   } else if (
  //     fromAccountType === ACCOUNT_CODE.TRADE_HF ||
  //     fromAccountType === `SUB_${ACCOUNT_CODE.TRADE_HF}`
  //   ) {
  //     updateCurrencies(highFrequency);
  //   } else if (
  //     fromAccountType === ACCOUNT_CODE.ISOLATED ||
  //     fromAccountType === `SUB_${ACCOUNT_CODE.ISOLATED}`
  //   ) {
  //     const coinsArr = formatSymbol(fromSymbol);
  //     const nextCurrencies = map(coinsArr, (v) => categories[v]);
  //     updateCurrencies(nextCurrencies);
  //   } else if (SUB_ACCOUNT_MAP[fromAccountType]) {
  //     const coinsCache = Cache.getInstance();
  //     const nextCurrencies = coinsCache.get(from);
  //     if (!nextCurrencies) {
  //       dispatch({
  //         payload: { accountType: replace(from, /SUB_/, '') },
  //         type: 'user_assets/pullAssetsByType',
  //         callback: (value) => {
  //           coinsCache.set(from, value);
  //           updateCurrencies(value);
  //         },
  //       });
  //     } else {
  //       updateCurrencies(nextCurrencies);
  //     }
  //   }
  // }, [from, main]);

  useEffect(() => {
    const [fromAccountType] = from;
    const [toAccountType] = to;
    if (toAccountType || fromAccountType) {
      updateCurrencies();
    }
  }, [from, to]);

  // 划出账户变更，或币种变更，需重新拉去余额
  useEffect(() => {
    queryBalance();
  }, [subAccountId, currency]);

  useEffect(() => {
    if (
      (toAccount === ACCOUNT_CODE.MAIN || toAccount === `SUB_${ACCOUNT_CODE.MAIN}`) &&
      loanCurrenciesMap[currency]
    ) {
      // 拉取自动还币配置
      dispatch({
        type: 'marginMeta/pullAutoLendConf',
        payload: { currency },
      });
    }
  }, [toAccount, currency, loanCurrenciesMap]);

  // 可转数量变化，触发重新检测
  useEffect(() => {
    const num = getFieldValue('amount');
    if (num || num === 0) {
      validateFields(['amount'], { force: true });
    }
  }, [max]);

  // const changeValues = useCallback((changedValues, values) => {
  //   Object.entries(changedValues).forEach(([key, val]) => {
  //     switch (key) {
  //       case 'subAccount':
  //         setSubAccountId(val);
  //         break;
  //       case 'currency':
  //         setCurrency(val);
  //         break;
  //       case 'from':
  //         setFrom(val);
  //         break;
  //       case 'to':
  //         setTo(val);
  //         break;
  //     }
  //   });
  // }, []);

  const showSymbolSelected = useMemo(() => {
    return (
      ([ACCOUNT_CODE.ISOLATED, `SUB_${ACCOUNT_CODE.ISOLATED}`].includes(fromAccount) ||
        [ACCOUNT_CODE.ISOLATED, `SUB_${ACCOUNT_CODE.ISOLATED}`].includes(toAccount)) &&
      currencies &&
      currencies.length === 2
    );
  }, [fromAccount, toAccount, currencies]);

  const subAccountOptions = useMemo(() => {
    return [
      {
        label: curItem.subName,
        value: curItem.userId,
      },
    ];
  }, [curItem]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    track('subAccountTransferModalShow', {
      channel: 'JS',
    });
  }, [visible]);

  const subUserPermissions = multiSiteConfig?.accountConfig?.subUserPermissions || [];

  // 在最后接入多租户配置系统后，需要根据租户配置来渲染展示的账号
  const fromAccountOptions = useMemo(() => {
    const keys = Object.keys(typesKeyMap);
    return fromOptions.filter((item) => {
      if (keys.includes(item.value)) {
        return subUserPermissions?.includes(typesKeyMap[item.value]);
      }
      return item;
    });
  }, [fromOptions, subUserPermissions]);

  const toAccountOptions = useMemo(() => {
    const keys = Object.keys(subTypesKeyMap);
    return toOptions.filter((item) => {
      if (keys.includes(item.value)) {
        return subUserPermissions?.includes(subTypesKeyMap[item.value]);
      }
      return item;
    });
  }, [subUserPermissions, toOptions]);

  return (
    <NoSSG>
      <Dialog
        size="medium"
        cancelText=""
        okText=""
        open={visible}
        onCancel={handleCancel}
        destroyOnClose
        maskClosable={true}
        title={_t('transfer.mother.sub')}
        footer={null}
        {...restProps}
      >
        <FormWrapper>
          <Form form={form}>
            <FormItem
              colon={false}
              required={false}
              label={_t('subaccount.subaccount')}
              name="subAccount"
              initialValue={initSubAccount}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
              ]}
            >
              <Select size={'xlarge'} options={subAccountOptions} />
            </FormItem>
            <TransferBox>
              <div className="direction">
                <div>{_t('convert.form.input.from.left.title')}</div>
                <div className="arrowBox">
                  <ICArrow width={12} height={12} />
                </div>
                <div>{_t('convert.form.input.to.left.title')}</div>
              </div>
              <div className="trandseCascader">
                <FormItem label={_t('subaccount.trans.dir')} name="from" noStyle={true}>
                  <Cascader
                    showSearch
                    disabled={isBatchTransfer}
                    options={fromAccountOptions}
                    onClick={() => trackClick(['subaccountTransferWindow', '2'])}
                    fieldNames={{
                      label: '_label',
                    }}
                  />
                </FormItem>
                <span className="dividerbox">
                  <span className="divider" />
                </span>
                <FormItem name="to" label=" " noStyle={true}>
                  <Cascader
                    showSearch
                    disabled={isBatchTransfer}
                    options={toAccountOptions}
                    onClick={() => trackClick(['subaccountTransferWindow', '2'])}
                    fieldNames={{
                      label: '_label',
                    }}
                  />
                </FormItem>
              </div>
              <div className="reverse" onClick={reverse}>
                <img alt="transfer" width={20} height={46} src={transferIcon} />
              </div>
            </TransferBox>
            {isSupportBatch && (
              <Box style={{ position: 'relative', marginBottom: '16px' }}>
                <MultiSwitch
                  // style={{ float: 'right' }}
                  onSwitchChange={handleSwitchChange}
                  checked={isBatchTransfer}
                />
              </Box>
            )}

            {/* 批量划转/普通划转 */}
            {isSupportBatch && isBatchTransfer ? (
              <MultiCoinsList
                style={{}}
                to={to}
                maxSelection={maxSelectedLen}
                loading={loadingCoins}
                currencies={currencies && currencies.length ? currencies : coins}
                onSelected={handleSelectedCoins}
                editable={true}
              />
            ) : (
              <>
                <div onClick={() => trackClick(['subaccountTransferWindow', '1'])}>
                  <FormItem label={_t('vote.coin-type')} name="currency" initialValue={currency}>
                    {showSymbolSelected ? (
                      <SymbolSelector
                        loading={loadingCoins}
                        showBalance={true}
                        currencies={currencies}
                        value={currency}
                        onChange={(v) => setCurrentCurrency(v)}
                      />
                    ) : (
                      <KuxCoinSelector
                        showIcon
                        loading={loadingCoins}
                        searchIcon={false}
                        listItemHeight={48}
                        style={{ width: '100%' }}
                        contanierStyle={{ height: '40px' }}
                        currencies={currencies.length ? currencies : coins}
                        amountConfig={{
                          key: 'availableBalance',
                        }}
                      />
                    )}
                  </FormItem>
                </div>
                <div>
                  <Balance
                    style={{
                      fontSize: '14px',
                      color: colors.text40,
                      display: 'flex',
                      marginBottom: '4px',
                      justifyContent: 'flex-end',
                    }}
                    balance={displayMax}
                    currency={currency}
                    loading={loadingBalance}
                    onClick={(num) => {
                      setFieldsValue({ amount: num });
                      trackClick(['subaccountTransferWindow', '3']);
                    }}
                  />
                  <FormItem
                    label={_t('margin.number')}
                    name="amount"
                    rules={[{ validator: triggerAmountValidator }]}
                  >
                    <InputNumber
                      size={'xlarge'}
                      controls={false}
                      fullWidth
                      precision={precision}
                      labelProps={{ shrink: true }}
                      unit={
                        <Max
                          onClick={() => {
                            setFieldsValue({ amount: displayMax });
                            trackClick(['TransferWindow', '3']);
                          }}
                        >
                          {_t('i59WspMk1h9yP5tAzyCXt5')}
                        </Max>
                      }
                    />
                  </FormItem>
                  {!!amount && +amount > 0 && +amount <= +displayMax && (
                    <CoinCurrency
                      className="coinCurrency"
                      coin={currency}
                      value={amount}
                      useLegalChars={false}
                    />
                  )}
                </div>

                <TransferTips from={from} to={to} currency={currency} />
              </>
            )}
            <Button
              size="large"
              fullWidth
              loading={comfirmLoading}
              style={{ marginTop: '8px' }}
              onClick={isBatchTransfer ? handleBatchSubmit : handleSubmit}
              disabled={isBatchTransfer ? !selectedCurrencies.length : !amount}
            >
              {_t('confirm')}
              {isBatchTransfer && !!selectedCurrencies.length && (
                <span>{`(${selectedCurrencies.length}/${maxSelectedLen})`}</span>
              )}
            </Button>
          </Form>
        </FormWrapper>
      </Dialog>
    </NoSSG>
  );
});

SubAccountTransferModal.propTypes = {
  initDict: PropTypes.array,
};

export default injectLocale(SubAccountTransferModal);

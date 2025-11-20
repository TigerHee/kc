/**
 * Owner: solar@kupotech.com
 */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  indexOf,
  filter,
  uniq,
  map,
  some,
  isEqual,
  debounce,
  isNil,
  noop,
  isEmpty,
  intersection,
  get,
} from 'lodash';
import { BigNumber } from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  InputNumber2 as InputNumber,
  Button,
  Box,
  ThemeProvider,
  Snackbar,
  Notification,
  useSnackbar,
} from '@kux/mui';

import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';

import { useTheme, useUpdateEffect } from '@kux/mui/hooks';
import useShowHfAccount from '@packages/hooks/src/useShowHfAccount';
// import { injectLocale } from '@kucoin-base/i18n';
import { useTranslation } from '@tools/i18n';

import clns from 'classnames';
import transferModel from '../model';

import { MODEL_NAMESPACE } from '../config';

import { StateProvider } from '../components/StateProvider';
import { NoSSG } from '../components/NoSSG';

import { kcsensorsClick as trackClick } from '../utils/ga.js';
import numberFixed from '../utils/numberFixed.js';
import KuxCoinSelector from '../components/KuxCoinSelector';
import RootEmotionCacheProvider from '../components/RootEmotionCacheProvider';
import CoinCurrency from '../components/CoinCurrency';
import Cascader from '../components/KuxCascader';

import transferIcon from '../../static/transfer-vertical.svg';
import icArrow from '../../static/arrow-down.svg';
import TransferTips from './Tips';
import Balance from './Balance';
import MultiSwitch from './MultiSwitch';
import MultiCoinsList from './MultiCoinsList';
import MultiFailedModal from './MultiFailedModal';
import SymbolSelector from './SymbolSelector';
import TrandseCascaderWrapper from './TrandseCascaderWrapper';
import { useStateSelector } from '../hooks/useStateSelector.js';

import { ACCOUNT_CODE, symbolLabelWrap, useAccountMap } from './config';

import { TransferBox, Max, FormWrapper } from './styles/index/style.js';
import { TransferEvent } from '../event';
import Dialog from './Modal';

const { FormItem } = Form;

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

// 数字格式正则
const numReg = /^[0-9]+(\.?[0-9]*)?$/;

const maxSelectedLen = 20;

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, transferModel));
});

export { TransferEvent };

// export const TransferEvent = evtEmitter.getEvt('transfer');

const formatSymbol = (symbol) => (symbol ? `${symbol}`.split('-') : []);
const getAccountWithoutSymbol = (account) => account[0];
// 两个数组是否存在交集
const isHaveIntersection = (arr1 = [], arr2 = []) => {
  const collectArr = [...uniq(arr1), ...uniq(arr2)];
  return uniq(collectArr).length !== collectArr.length;
};

const EMPTY_ARRAY = [];

const TransferModal = React.memo((props) => {
  const [form] = Form.useForm();
  const { colors } = useTheme();
  const ACCOUNT_MAP = useAccountMap();
  const needRunGetFromOptions = useRef(true);
  const needRunGetToOptions = useRef(true);
  // 保存当前from支持的币种
  const fromCurrenciesCache = useRef([]);
  const dispatch = useDispatch();
  const _isHFAccountExist = useStateSelector('isHFAccountExist');
  const isHFAccountExist = useShowHfAccount(_isHFAccountExist) || false;

  const isOPTIONExist = useSelector((state) => state[MODEL_NAMESPACE].optionsOpenFlag);
  const categories = useStateSelector('categories');
  const userPosition = useSelector((state) => state[MODEL_NAMESPACE].marginPosition);
  const crossCurrenciesMap = useSelector((state) => state[MODEL_NAMESPACE].crossCurrenciesMap);
  const optionCurrenciesSet = useSelector((state) => state[MODEL_NAMESPACE].optionCurrenciesSet);
  const userInfo = useStateSelector('userInfo');

  const kumexOpenFlag = useSelector((state) => state[MODEL_NAMESPACE].kumexOpenFlag);
  const {
    isolatedSymbols,
    transferBalance: balance,
    isSupportBatch,
    batchFailedCurrencies,
  } = useSelector((state) => state[MODEL_NAMESPACE]);
  const loadingBalance = useSelector(
    (state) => state.loading.effects[`${MODEL_NAMESPACE}/pullTransferBalance`],
  );
  const transferLoading = useSelector(
    (state) => state.loading.effects[`${MODEL_NAMESPACE}/transfer`],
  );
  const batchTransferLoading = useSelector(
    (state) => state.loading.effects[`${MODEL_NAMESPACE}/batchTransfer`],
  );
  const comfirmLoading = transferLoading || batchTransferLoading;
  const loadingCoins = useSelector(
    (state) => state.loading.effects[`${MODEL_NAMESPACE}/pullTransferCurrencies`],
  );

  const { currentLang = 'en_US', transferConfig, visible } = props;
  const { resetFields, setFieldsValue, getFieldValue, validateFields } = form;
  const { openFlag } = userPosition || {};
  const { initDict = [], initCurrency = '', supportAccounts } = transferConfig;

  // const [from, setFrom] = useState([]);
  // const [to, setTo] = useState([]);
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [isBatchTransfer, setBatchTransfer] = useState(false); // 开启批量划转 不可切换账户类型
  const [selectedCurrencies, setSelectedCurrencies] = useState([]); // 批量币种

  const from = Form.useWatch('from', form) || EMPTY_ARRAY;
  const to = Form.useWatch('to', form) || EMPTY_ARRAY;

  const currency = Form.useWatch('currency', form);
  const amount = Form.useWatch('amount', form);

  const { precision } = categories[currency] || { precision: 8 };

  const fromAccount = getAccountWithoutSymbol(from);
  const toAccount = getAccountWithoutSymbol(to);
  const { t: _t } = useTranslation('transfer');
  const { message } = useSnackbar();

  // 允许法币划转 mian、trade、trade_hf
  const isAllowFiatTransfer = useMemo(() => {
    const transferTypes = [from[0], to[0]];
    return transferTypes.every((type) =>
      [ACCOUNT_CODE.TRADE, ACCOUNT_CODE.MAIN, ACCOUNT_CODE.TRADE_HF].includes(type),
    );
  }, [from, to]);

  const setFrom = (formValue) => {
    form.setFieldsValue({
      from: formValue,
    });
  };

  const setTo = (toValue) => {
    form.setFieldsValue({
      to: toValue,
    });
  };

  // 禁用账户
  const disabledAccounts = useMemo(() => {
    const result = [ACCOUNT_CODE.POOL]; // 暂时去掉poolx账户
    if (openFlag === false) {
      result.push(ACCOUNT_CODE.MARGIN, ACCOUNT_CODE.ISOLATED);
    }
    if (kumexOpenFlag === false) {
      result.push(ACCOUNT_CODE.CONTRACT);
    }
    if (!isHFAccountExist) {
      result.push(ACCOUNT_CODE.TRADE_HF);
    }
    if (isOPTIONExist === false) {
      result.push(ACCOUNT_CODE.OPTION);
    }
    return result;
  }, [openFlag, kumexOpenFlag, isHFAccountExist, isOPTIONExist]);

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
            indexOf(ACCOUNT_MAP[_dicts[1]].supportFromAccounts, _dicts[0]) > -1 &&
            indexOf(ACCOUNT_MAP[_dicts[0]].supportToAccounts, _dicts[1]) > -1;
          result = !isContainDisabledAccounts && isAvailablePair;
        }
      } catch (e) {
        result = false;
      }
      return result;
    },
    [disabledAccounts],
  );

  const accounts2Options = (accounts, currentLang, symbols) => {
    return map(accounts, (item) => {
      const { key, labelComp, ...other } = ACCOUNT_MAP[item] || {};
      if (!key) return {};
      const result = {
        ...other,
        value: key,
        label: labelComp(currentLang),
        _label: labelComp(currentLang),
      };
      if (key === ACCOUNT_CODE.ISOLATED) {
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

  // 获取options
  const getOptions = useCallback(
    (dict = [], accountsKey = 'supportToAccounts') => {
      const [accountType, accountSymbol] = dict;
      const coinsArr = formatSymbol(accountSymbol);
      const accountConfig = ACCOUNT_MAP[accountType];
      if (!accountConfig || !accountConfig[accountsKey]) return [];
      let availableAccounts = filter(accountConfig[accountsKey], (item) => {
        return supportAccounts.includes(item);
      });
      availableAccounts = filter(availableAccounts, (item) => {
        const { checkCurrencyIsSupport } = ACCOUNT_MAP[item] || {};
        let result = !disabledAccounts.includes(item);
        if (item === ACCOUNT_CODE.ISOLATED && !isolatedSymbols.length) {
          result = false;
        }
        if (result && checkCurrencyIsSupport && coinsArr.length) {
          const isSupport = some(coinsArr, (v) =>
            checkCurrencyIsSupport({
              categories,
              crossCurrenciesMap,
              currency: v,
              optionCurrenciesSet,
            }),
          );
          result = result && isSupport;
        }
        return result;
      });
      let symbols = [];
      if (some(availableAccounts, (item) => item === ACCOUNT_CODE.ISOLATED)) {
        symbols = filter(isolatedSymbols, ({ symbol }) => {
          const symbolArr = formatSymbol(symbol);
          return coinsArr.length
            ? isHaveIntersection(symbolArr, coinsArr) && symbol !== accountSymbol
            : some(symbolArr, (item) => {
                const { checkCurrencyIsSupport } = ACCOUNT_MAP[accountType] || {};
                return (
                  !checkCurrencyIsSupport ||
                  checkCurrencyIsSupport({
                    categories,
                    crossCurrenciesMap,
                    currency: item,
                    optionCurrenciesSet,
                  })
                );
              });
        });
      }
      if (!symbols.length) {
        availableAccounts = filter(availableAccounts, (item) => item !== ACCOUNT_CODE.ISOLATED);
      }
      return accounts2Options(availableAccounts, currentLang, symbols);
    },
    [
      categories,
      crossCurrenciesMap,
      disabledAccounts,
      currentLang,
      isolatedSymbols,
      supportAccounts,
      optionCurrenciesSet,
      accounts2Options,
    ],
  );

  // 检查币种是否支持划转的两个账户
  const checkIsAvailableCurrency = useCallback(
    (currencyCode, needCheckAccounts = ['from', 'to'], dicts = []) => {
      let result = true;
      map(needCheckAccounts, (item, index) => {
        const [accountType, symbol] = dicts[index] || (item === 'from' ? from : to);
        if (symbol) {
          result = formatSymbol(symbol).includes(currencyCode);
        } else {
          const { checkCurrencyIsSupport } = ACCOUNT_MAP[accountType] || {};
          const isSupportAccount = checkCurrencyIsSupport
            ? checkCurrencyIsSupport({
                categories,
                crossCurrenciesMap,
                currency: currencyCode,
                optionCurrenciesSet,
              })
            : true;
          result = result && isSupportAccount;
        }
      });
      return result;
    },
    [categories, crossCurrenciesMap, from, to, optionCurrenciesSet],
  );

  // 最大值小于0，为请求出错的情况，此时不校验最大值
  const max = (() => {
    // 获取最大可转数量
    const _max = balance || 0;
    return numberFixed(_max, precision);
  })();

  // 用于ui展示, 最小为0(用Math，遇到特别小的浮点数，会被转成科学计数法)
  const displayMax = max > 0 ? max : 0;

  // 变更币种
  const setCurrentCurrency = useCallback((currentCurrency) => {
    setFieldsValue({ currency: currentCurrency });
  }, []);

  const handleCancel = useCallback(
    (flag) => {
      if (flag === true && transferConfig.callback) transferConfig.callback();
      props.onClose();
      resetFields(['amount']);
    },
    [dispatch, transferConfig, resetFields],
  );

  // 调换转入与转出账户
  const reverse = useCallback(() => {
    if (checkIsAvailableDict([to, from])) {
      if (isEqual(ACCOUNT_MAP[to[0]].supportToAccounts, ACCOUNT_MAP[to[0]].supportFromAccounts)) {
        needRunGetToOptions.current = false;
      }
      if (
        isEqual(ACCOUNT_MAP[from[0]].supportToAccounts, ACCOUNT_MAP[from[0]].supportFromAccounts)
      ) {
        needRunGetFromOptions.current = false;
      }
      setFromOptions(toOptions);
      setToOptions(fromOptions);

      setFrom(to);
      setTo(from);
    }
  }, [checkIsAvailableDict, from, to, fromOptions, toOptions]);

  const [reverseFlag, setReverseFlag] = useState({});

  // 使用reverseFlag来调度reverse，避免异步调用reverse内部连续设置from和to的state时不在同一个tick中。
  useUpdateEffect(() => {
    reverse();
  }, [reverseFlag]);

  const trandseRef = useRef();
  const [reverseLoading, setReverseLoading] = useState(false);

  const handleReverseClick = () => {
    setReverseLoading(true);
    trandseRef.current.exchange().then(() => {
      setReverseFlag({});
      setReverseLoading(false);
    });

    // 如需回滚到无动画情况，直接改为reverse调用即可。
    // reverse();
  };

  const triggerAmountValidator = useCallback(
    (rule, value) => {
      if (value === '') {
        return Promise.reject(_t('form.required'));
      }
      if (!numReg.test(value) || +value < 0) {
        return Promise.reject(_t('trans.amount.num.err'));
      }
      value = +value;
      if (max >= 0 && value > max) {
        const avaliableMax = `${_t('transfer.trans.avaliable')} ${max}`;
        return Promise.reject(avaliableMax);
      }
      return Promise.resolve();
    },
    [max],
  );

  // 接口获取余额，储蓄和币币账户走推送，不用拉取 +高频
  // update 2023.03.09 获取余额接口更新，全部账户都用同一的接口获取余额 主要是为了支持场外借贷用户展示实际可划转余额
  const queryBalance = useCallback(() => {
    const [fromAccountType, fromSymbol] = from;
    const [toAccountType, toSymbol] = to;
    if (fromAccountType && toAccountType && currency) {
      dispatch({
        type: `${MODEL_NAMESPACE}/pullTransferBalance`,
        payload: {
          currency,
          accountType: fromAccountType,
          toAccountType,
          ...(fromSymbol ? { tag: fromSymbol } : {}),
          ...(toSymbol ? { toAccountTag: toSymbol } : {}),
        },
      })
        .then((res) => {
          if (res && res.success) {
            dispatch({
              type: `${MODEL_NAMESPACE}/update`,
              payload: {
                transferBalance: res.data.availableBalance,
              },
            });
          }
        })
        .catch(() => {
          dispatch({
            type: `${MODEL_NAMESPACE}/update`,
            payload: {
              transferBalance: -1,
            },
          });
        });
    }
  }, [from, to, currency, dispatch]);

  // 接口获取币种列表
  const pullAssets = useMemo(
    () =>
      debounce(({ payload, cb, userInfo }) => {
        dispatch({
          payload,
          type: `${MODEL_NAMESPACE}/pullTransferCurrencies`,
          callback: (value) => {
            if (cb && typeof cb === 'function') {
              cb(value);
            }
          },
          userInfo,
        });
      }, 100),
    [],
  );

  // 更新currencies并排序
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
      const { checkCurrencyIsSupport } = ACCOUNT_MAP[toAccountType] || {};
      nextCurrencies = filter(nextCurrencies, (item) => {
        // 如果不是数字货币，直接过滤掉
        const { isDigital } = categories[item.currency] || {};
        let isAvailable = isAllowFiatTransfer || isDigital !== false;
        // 逐仓账户或者其他需要检测支不支持币种的账户
        if (toSymbol || checkCurrencyIsSupport) {
          isAvailable = isAvailable && item && checkIsAvailableCurrency(item.currency, ['to']);
          if (isAvailable && item.currency === currency) {
            isContainCurrentCurrency = true;
          }
        } else if (item.currency === currency) {
          isContainCurrentCurrency = true;
        }
        return isAvailable;
      });
      // 逐仓账户组装余额 & 排序
      if (fromAccountType === ACCOUNT_CODE.ISOLATED && isolatedSymbols.length) {
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
          const [, quoteCurrency = ''] = formatSymbol(fromSymbol || toSymbol);
          const quote = nextCurrencies.filter((item) => item.currency === quoteCurrency)[0];
          if (quote) {
            nextCurrency = quote.currency;
          }
        }
        setCurrentCurrency(nextCurrency);
      } else if (fromCurrencies) {
        // fromCurrencies存在代表from变更, 需重新拉去余额
        queryBalance();
      }
    },
    [
      from,
      to,
      currency,
      checkIsAvailableCurrency,
      categories,
      isAllowFiatTransfer,
      isolatedSymbols,
    ],
  );

  const initDirection = useCallback(() => {
    if (checkIsAvailableDict(initDict)) {
      const [nextFrom, nextTo] = initDict;
      const nextFromOptions = getOptions(nextTo);
      setFromOptions(nextFromOptions);
      setFrom(nextFrom);
      setTo(nextTo);
    }
  }, [initDict, checkIsAvailableDict, from, to]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      validateFields().then((values) => {
        const [fromAccountType, fromSymbol] = from;
        const [toAccountType, toSymbol] = to;
        const commonPayload = { currency, amount: values.amount };
        const successText = _t('operation.succeed');
        const payload = {
          ...commonPayload,
          ...(fromSymbol ? { payTag: fromSymbol } : {}),
          ...(toSymbol ? { recTag: toSymbol } : {}),
          recAccountType: toAccountType,
          payAccountType: fromAccountType,
          successCallback() {
            message.success(successText);
          },
        };
        dispatch({
          payload,
          type: `${MODEL_NAMESPACE}/transfer`,
          callback: (...rest) => {
            handleCancel(...rest);
            TransferEvent.emit('transfer.success', { from, to, currencies: [currency] });
          },
        });
      });
    },
    [currency, from, to, handleCancel, _t, message, dispatch, validateFields],
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
        const successText = _t('operation.succeed');
        const payload = {
          ...commonPayload,
          ...(fromSymbol ? { payTag: fromSymbol } : {}),
          ...(toSymbol ? { recTag: toSymbol } : {}),
          recAccountType: toAccountType,
          payAccountType: fromAccountType,
          _t,
          successCallback() {
            message.success(successText);
          },
        };
        dispatch({
          payload,
          callback: (success, data = []) => {
            // 划转失败提示
            const failData = data.filter((item) => !item.result);
            if (failData && failData.length > 0) {
              dispatch({
                type: `${MODEL_NAMESPACE}/update`,
                payload: {
                  batchFailedCurrencies: failData,
                },
              });
              return;
            }
            TransferEvent.emit('transfer.success', {
              from,
              to,
              currencies: selectedCurrencies.map((v) => v.currency),
            });
            handleCancel(success);
          },
          type: `${MODEL_NAMESPACE}/batchTransfer`,
        });
      });
    },
    [selectedCurrencies, from, to, handleCancel, dispatch, validateFields, _t, message],
  );

  const handleSwitchChange = useCallback((checked) => {
    setBatchTransfer(checked);
    if (checked) {
      trackClick(['TransferWindow', '4']);
    }
  }, []);

  const handleSelectedCoins = useCallback((rowKeys, rows) => {
    setSelectedCurrencies(rows);
  }, []);

  const handleReTransfer = useCallback(() => {
    handleFailedModalClose();
    // dispatch({
    //   type: `${MODEL_NAMESPACE}/updateTransferConfig`,
    //   payload: {
    //     visible: true,
    //   },
    // });
    handleCancel();
    setTimeout(() => {
      props.reOpen();
    }, 1000);
  }, [dispatch, handleCancel]);

  const handleFailedModalClose = useCallback(() => {
    dispatch({
      type: `${MODEL_NAMESPACE}/update`,
      payload: {
        batchFailedCurrencies: null,
      },
    });
  }, [dispatch]);

  // 划转账户变更 判断是否支持批量
  useEffect(() => {
    const [fromAccountType] = from;
    const [toAccountType] = to;
    if (fromAccountType && toAccountType) {
      dispatch({
        type: `${MODEL_NAMESPACE}/batchSupport`,
        payload: {
          from: fromAccountType,
          to: toAccountType,
        },
      });
    }
  }, [from, to, dispatch]);

  // 每次打开弹框需要更新账户的相关配置
  useEffect(() => {
    // 当不开启这些账户时，不请求相关的接口
    if (visible) {
      if (supportAccounts.includes(ACCOUNT_CODE.MARGIN)) {
        dispatch({
          type: `${MODEL_NAMESPACE}/pullUserMarginPostion`,
        });
      }
      if (supportAccounts.includes(ACCOUNT_CODE.CONTRACT)) {
        dispatch({
          type: `${MODEL_NAMESPACE}/checkKumexIsOpen`,
          payload: { isLogin: !!userInfo },
        });
      }
      if (supportAccounts.includes(ACCOUNT_CODE.OPTION)) {
        dispatch({
          type: `${MODEL_NAMESPACE}/checkOptionsIsOpen`,
        });
      }

      if (initCurrency === currency) {
        queryBalance();
      }
      initDirection();
      if (openFlag !== false) {
        if (supportAccounts.includes(ACCOUNT_CODE.MARGIN)) {
          dispatch({
            type: `${MODEL_NAMESPACE}/pullIsolatedSymbols`,
            payload: {
              user: userInfo,
            },
          });
          dispatch({
            type: `${MODEL_NAMESPACE}/pullMarginCrossCurrencies`,
          });
        }
      }
    } else {
      setBatchTransfer(false);
    }
  }, [visible, userInfo]);

  // 初始币种变更
  useEffect(() => {
    if (
      initCurrency !== currency &&
      checkIsAvailableCurrency(initCurrency, ['from', 'to'], initDict)
    ) {
      setCurrentCurrency(initCurrency);
    }
  }, [initCurrency, initDict]);

  // 初始划转方向变更
  useEffect(() => {
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
  }, [JSON.stringify(to), categories, disabledAccounts, currentLang, isolatedSymbols]);

  // 获取划入的options
  useEffect(() => {
    // 在调转划出与划入账户时，阻止触发getOptions
    if (!needRunGetToOptions.current) {
      needRunGetToOptions.current = true;
      return;
    }
    const nextToOptions = getOptions(from);
    setToOptions(nextToOptions);
  }, [JSON.stringify(from), categories, disabledAccounts, currentLang, isolatedSymbols]);

  // 划转优化需求 和app统一币种列表接口
  useEffect(() => {
    const [fromAccountType, fromSymbol] = from;
    if (visible && ACCOUNT_CODE[fromAccountType] && !isEmpty(categories)) {
      if (fromAccountType === ACCOUNT_CODE.ISOLATED) {
        const coinsArr = formatSymbol(fromSymbol);
        const nextCurrencies = map(coinsArr, (v) => categories[v]);
        updateCurrencies(nextCurrencies);
      } else {
        // 防止初始化账户切换时调多次接口 对请求接口做防抖处理只请求最后一次
        pullAssets({
          payload: {
            accountInfos: [
              {
                accountType: fromAccountType,
              },
            ],
          },
          cb: (value) => {
            const { primary = {} } = value;
            updateCurrencies(primary[fromAccountType] || []);
          },
          userInfo,
        });
      }
    }
  }, [from, to, visible, pullAssets, userInfo, categories]);

  // 币种变更，需重新拉去余额
  useEffect(() => {
    queryBalance();
  }, [currency]);

  useEffect(() => {
    const [toAccountType, toSymbol] = to;
    if (toAccountType) {
      updateCurrencies();
    }
    if (toSymbol) {
      dispatch({
        type: `${MODEL_NAMESPACE}/pullPositionStatusByTag`,
        payload: { tag: toSymbol },
      });
    }
  }, [to]);

  // 可转数量变化，触发重新检测
  useEffect(() => {
    const num = getFieldValue('amount');
    if (num || num === 0) {
      validateFields(['amount']);
    }
  }, [max]);

  const showSymbolSelected = useMemo(() => {
    return (
      (fromAccount === ACCOUNT_CODE.ISOLATED || toAccount === ACCOUNT_CODE.ISOLATED) &&
      currencies &&
      currencies.length === 2
    );
  }, [fromAccount, toAccount, currencies]);

  const confirmDisable = useMemo(() => {
    if (isBatchTransfer) {
      return !selectedCurrencies.length;
    }
    return isNil(amount) || BigNumber(amount).isEqualTo(0);
  }, [isBatchTransfer, selectedCurrencies.length, amount]);

  return (
    <>
      <RootEmotionCacheProvider>
        <NoSSG>
          <Dialog
            // size="medium"
            // maskClosable
            open={visible}
            onClose={props.onClose}
            onCancel={handleCancel}
            // footer={null}
            title={_t('transfer')}
            // {...restProps}
          >
            <FormWrapper>
              <Form form={form}>
                {/* <FormItem label={_t('subaccount.trans.dir')}> */}
                <TransferBox>
                  <div className="direction">
                    <div>{_t('convert.form.input.from.left.title')}</div>
                    <div className="arrowBox">
                      <img alt="" src={icArrow} width={12} height={12} />
                    </div>
                    <div>{_t('convert.form.input.to.left.title')}</div>
                  </div>
                  <TrandseCascaderWrapper
                    visible={visible}
                    ref={trandseRef}
                    from={form.getFieldValue('from')}
                    to={form.getFieldValue('to')}
                    formOptions={fromOptions}
                    toOptions={toOptions}
                  >
                    <FormItem noStyle name="from">
                      <Cascader
                        showSearch
                        options={fromOptions}
                        style={{ width: '100%' }}
                        disabled={isBatchTransfer || fromOptions?.length === 1}
                        onClick={() => trackClick(['TransferWindow', '2'])}
                        fieldNames={{
                          label: '_label',
                        }}
                        data-inspector="transfer-from"
                      />
                    </FormItem>
                    <span className="dividerbox">
                      <span className="divider" />
                    </span>
                    <FormItem noStyle name="to">
                      <Cascader
                        showSearch
                        options={toOptions}
                        style={{ width: '100%' }}
                        disabled={isBatchTransfer || toOptions?.length === 1}
                        onClick={() => trackClick(['TransferWindow', '2'])}
                        fieldNames={{
                          label: '_label',
                        }}
                        data-inspector="transfer-to"
                      />
                    </FormItem>
                  </TrandseCascaderWrapper>
                  <div
                    data-inspector="change-direction"
                    className={clns('reverse', {
                      disabled: reverseLoading,
                    })}
                    onClick={handleReverseClick}
                  >
                    <img alt="" width={20} height={46} src={transferIcon} />
                  </div>
                </TransferBox>
                {/* </FormItem> */}
                {isSupportBatch && (
                  <Box style={{ position: 'relative', marginBottom: '16px' }}>
                    <MultiSwitch
                      // style={{ position: 'absolute', right: 0 }}
                      onSwitchChange={handleSwitchChange}
                      checked={isBatchTransfer}
                    />
                  </Box>
                )}
                {/* 批量划转/普通划转 */}
                {isSupportBatch && isBatchTransfer ? (
                  <MultiCoinsList
                    to={to}
                    maxSelection={maxSelectedLen}
                    style={{ marginTop: '20px' }}
                    loading={loadingCoins}
                    currencies={currencies}
                    onSelected={handleSelectedCoins}
                  />
                ) : (
                  <>
                    <div onClick={() => trackClick(['TransferWindow', '1'])}>
                      <FormItem
                        label={_t('vote.coin-type')}
                        name="currency"
                        initialValue={currency}
                      >
                        {showSymbolSelected ? (
                          <SymbolSelector
                            loading={loadingCoins}
                            showBalance
                            currencies={currencies}
                            value={currency}
                            onChange={(v) => setCurrentCurrency(v)}
                          />
                        ) : (
                          <KuxCoinSelector
                            showIcon
                            loading={loadingCoins}
                            style={{ width: '100%' }}
                            searchIcon={false}
                            listItemHeight={48}
                            currencies={currencies}
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
                          justifyContent: 'flex-end',
                        }}
                        balance={displayMax}
                        currency={currency}
                        loading={loadingBalance}
                        onClick={(num) => {
                          setFieldsValue({ amount: num });
                          trackClick(['TransferWindow', '3']);
                        }}
                      />
                      <FormItem
                        label={_t('margin.number')}
                        name="amount"
                        rules={[
                          {
                            validator: triggerAmountValidator,
                          },
                        ]}
                      >
                        <InputNumber
                          size="xlarge"
                          fullWidth
                          precision={precision}
                          controls={false}
                          labelProps={{ shrink: true }}
                          className="transfer-amount"
                          separator
                          lang={currentLang}
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
                      {Boolean(+amount > 0 && +amount <= +displayMax && userInfo?.currency) && (
                        <CoinCurrency
                          className="coinCurrency"
                          coin={currency}
                          value={amount}
                          useLegalChars={false}
                        />
                      )}
                    </div>
                  </>
                )}
                <TransferTips
                  from={from}
                  to={to}
                  currency={currency}
                  currencies={selectedCurrencies.map((item) => item.currency).join()}
                />
                <Button
                  size="large"
                  fullWidth
                  onClick={isBatchTransfer ? handleBatchSubmit : handleSubmit}
                  loading={comfirmLoading}
                  style={{ marginTop: '16px' }}
                  disabled={confirmDisable}
                  data-inspector="transfer-confirm"
                >
                  {_t('confirm')}
                  {isBatchTransfer &&
                    !!selectedCurrencies.length &&
                    `(${selectedCurrencies.length}/${maxSelectedLen})`}
                </Button>
              </Form>
            </FormWrapper>
          </Dialog>
        </NoSSG>
        {/* 批量划转部分失败 */}
        <MultiFailedModal
          failedCurrencies={batchFailedCurrencies}
          onCancel={handleFailedModalClose}
          onConfirm={handleReTransfer}
        />
      </RootEmotionCacheProvider>
    </>
  );
});

TransferModal.propTypes = {
  initDict: PropTypes.array,
};

// 生成支持账户配置
function genSupport(account) {
  return (sites = []) => (functionsName) => {
    const isSupport = (() => {
      if (functionsName) {
        return get(window._SITE_CONFIG_, functionsName);
      }
      return sites.includes(window._BRAND_SITE_);
    })();
    return isSupport ? [account] : [];
  };
}

const allSupportAccounts = [
  'MAIN',
  'TRADE',
  ...genSupport('CONTRACT')(['KC'])('functions.futures'),
  ...genSupport('MARGIN')(['KC'])('functions.margin'),
  ...genSupport('ISOLATED')(['KC'])('functions.margin'),
  ...genSupport('OPTION')(['KC'])('functions.option'),
];

// export default injectLocale(TransferModal);
export default (_props) => {
  const { transferConfig = {}, visible, reOpen, onClose, ...rest } = _props;
  const props = {
    ...rest,
    visible,
    reOpen: reOpen || noop,
    onClose: onClose || noop,
    transferConfig: {
      callback: transferConfig.callback || noop,
      initCurrency: transferConfig.initCurrency || window._BASE_CURRENCY_ || 'USDT',
      initDict: transferConfig.initDict || [['MAIN'], ['TRADE']],
      supportAccounts: transferConfig.supportAccounts
        ? intersection(transferConfig.supportAccounts, allSupportAccounts)
        : allSupportAccounts,
    },
  };

  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          {visible ? (
            <StateProvider {...props}>
              <TransferModal {...props} />
            </StateProvider>
          ) : null}
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

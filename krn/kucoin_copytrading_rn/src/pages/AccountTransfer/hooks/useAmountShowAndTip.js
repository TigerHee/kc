import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';

import {TRADER_ACTIVE_STATUS} from 'constants/businessType';
import useLang from 'hooks/useLang';
import {isUndef} from 'utils/helper';

export const useAmountShowAndTip = ({
  isParentOutAccDirection,
  parentAvailableBalance,
  subAvailableBalance,
  config,
  value,
}) => {
  const {_t} = useLang();
  const {status} = useSelector(
    state => state.leadInfo.activeLeadSubAccountInfo || {},
  );
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);

  // 校验逻辑
  // 转入：输入金额 > 可用余额，提示 可转 {可用余额}
  // 转出：输入数量 > 可用余额，提示：超出最大可转出余额。如需全部转出，申请停止带单资格后，带单资金将全部划转回币币账户
  const transferErrMsg = useMemo(() => {
    const {minInitAmount, subToMainAvailableTransfer} = config || {};
    if (!minInitAmount || isUndef(value)) {
      return '';
    }
    if (isParentOutAccDirection && +value > +parentAvailableBalance) {
      return _t('95f3d1c7563c4000ae31');
    }

    if (!isParentOutAccDirection && +value > +subToMainAvailableTransfer) {
      return _t('72ea202f15bc4000a043');
    }

    return '';
  }, [_t, config, value, isParentOutAccDirection, parentAvailableBalance]);

  const disabledTransfer = isUndef(value) || value <= 0 || !!transferErrMsg;

  const bottomTipText = useMemo(() => {
    const {minInitAmount} = config;
    if (!isParentOutAccDirection) {
      return _t('40f7418ed4614000a3c2', {
        amount: minInitAmount || '-',
        symbol: getBaseCurrency(),
      });
    }
    //  如果已经开始带单 隐藏
    if (
      isLeadTrader &&
      [TRADER_ACTIVE_STATUS.Freeze, TRADER_ACTIVE_STATUS.Disabled].includes(
        status,
      )
    ) {
      return minInitAmount - subAvailableBalance > 0
        ? _t('a135d73107da4000aba6', {
            amount: minInitAmount - subAvailableBalance,
            symbol: getBaseCurrency(),
          })
        : '';
    }

    return '';
  }, [
    _t,
    config,
    isLeadTrader,
    isParentOutAccDirection,
    status,
    subAvailableBalance,
  ]);
  const showMaxValidBalance = useMemo(
    () =>
      isParentOutAccDirection
        ? parentAvailableBalance
        : config?.subToMainAvailableTransfer,
    [
      isParentOutAccDirection,
      parentAvailableBalance,
      config?.subToMainAvailableTransfer,
    ],
  );

  return {
    transferErrMsg,
    bottomTipText,
    disabledTransfer,
    showMaxValidBalance,
  };
};

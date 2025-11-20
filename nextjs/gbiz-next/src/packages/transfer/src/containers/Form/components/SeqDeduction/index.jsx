/**
 * Owner: solar@kupotech.com
 */
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@kux/mui';
import { Trans } from 'tools/i18n';
import { useTranslation } from 'tools/i18n';
import { ICArrowDownOutlined, ICArrowUpOutlined, ICWarningOutlined } from '@kux/icons';
import { DragIcon } from '@kux/iconpack';
import { useTransferSelector, useTransferDispatch } from '@transfer/utils/redux';
import { useCoinCodeToName } from '@transfer/hooks/currency';
import { kcsensorsClick as trackClick } from '@transfer/utils/ga';
import NumberFormat from '@transfer/components/NumberFormat';
import { useGetConfigByAccount } from '@transfer/hooks/accounts';
import { useFormField } from '@transfer/hooks/fields';

import { setNumToPrecision, max, min, minus } from '@transfer/utils/number';
import storage from 'tools/storage';
import map from 'lodash-es/map';
import { useDragAccountSorted, DndProvider } from './dnd';
import {
  StyledSeqDeduction,
  StyledAccount,
  Accounts,
  StyledAlert,
  StyledAlertTag,
  ExpandTitleWrapper,
} from './style';

// 多账户提示手动关闭过一次，就不再展示了。
const MULTI_ALERT_OPENED = 'multi_alert_opened';

function useAccounts() {
  const multiAccounts = useTransferSelector((state) => state.multiAccounts);
  const [_accounts, setAccounts] = useState(() =>
    multiAccounts.filter((account) => !['ISOLATED'].includes(account.accountType)),
  );
  const multiAccountsAvailableMap = useTransferSelector((state) => state.multiAccountsAvailableMap);
  const amount = useFormField('amount');
  const precision = useTransferSelector((state) => state.precision);
  const recAccountType = useFormField('recAccountType');

  // 逐仓不支持顺序划转
  return useMemo(() => {
    const accountsMap = {};
    // 剩余扣除的数量
    let remaining = amount;
    // 是否已经扣除完成了
    let isFinishedDeducted = false;
    const accounts = _accounts
      .filter((item) => item.accountType !== recAccountType)
      .reduce((acu, item) => {
        const { accountType } = item;
        const { availableBalance } = multiAccountsAvailableMap[accountType] || {};
        const obj = {
          ...item,
          accountType,
          available: setNumToPrecision(availableBalance, precision),
          deducted: remaining ? setNumToPrecision(min(remaining, availableBalance), precision) : '',
        };
        if (remaining) {
          remaining = max(0, minus(remaining, availableBalance));
        }
        if (!remaining && !isFinishedDeducted) {
          isFinishedDeducted = true;
        }
        accountsMap[accountType] = obj;
        return [...acu, obj];
      }, []);

    return {
      accountsMap,
      accounts,
      setAccounts,
    };
  }, [_accounts, multiAccountsAvailableMap, precision, amount, recAccountType]);
}

const Account = ({ accountType, info, onDrop, index }) => {
  const getConfigByAccount = useGetConfigByAccount();
  const currencyName = useCoinCodeToName();

  const res = useMemo(() => getConfigByAccount(accountType), [getConfigByAccount, accountType]);
  const { icon: ICON, getLabel } = res;
  const { ref } = useDragAccountSorted({
    onDrop,
    accountType,
    index,
  });

  const { available, deducted } = info;
  const hasError = useTransferSelector((state) => state.hasError);
  return (
    <StyledAccount ref={ref}>
      <ICON />
      <div className="account-wrapper">
        <div className="account-name">{getLabel()}</div>
        <div className="account-info">
          <div className="available">
            <NumberFormat>{available}</NumberFormat> {currencyName}
          </div>
          {deducted && !hasError && (
            <div className="deducted">
              (<span className="symbol">-</span>
              <NumberFormat>{deducted}</NumberFormat> {currencyName})
            </div>
          )}
        </div>
      </div>
      <DragIcon className="drag-icon" size="20" />
    </StyledAccount>
  );
};

function Alert() {
  const dispatchTransfer = useTransferDispatch();
  useEffect(() => {
    dispatchTransfer({
      type: 'update',
      payload: {
        deductionAlertShow: true,
      },
    });
  }, [dispatchTransfer]);
  const handleClose = () => {
    storage.setItem(MULTI_ALERT_OPENED, '1');
  };
  const { t: _t } = useTranslation('transfer');
  return (
    <StyledAlert
      showIcon
      icon={<StyledAlertTag>{_t('deposit.address.newTag')}</StyledAlertTag>}
      type="success"
      title={_t('kc_transferpro_multi_earn_guide')}
      onClose={handleClose}
    />
  );
}

function SeqDeduction() {
  const dispatchTransfer = useTransferDispatch();
  const multiAccountExpanded = useTransferSelector((state) => state.multiAccountExpanded);
  const currency = useFormField('currency');

  const theme = useTheme();

  const handleToggle = () => {
    dispatchTransfer({
      type: 'update',
      payload: {
        multiAccountExpanded: !multiAccountExpanded,
      },
    });
    trackClick(['transferPopup', 'editTransferOrder'], {
      currency,
    });
  };

  // 逐仓不支持顺序划转
  const { accounts, accountsMap, setAccounts } = useAccounts();

  const ArrowIcon = useMemo(
    () => (multiAccountExpanded ? ICArrowUpOutlined : ICArrowDownOutlined),
    [multiAccountExpanded],
  );

  useEffect(() => {
    if (accounts.length) {
      dispatchTransfer({
        type: 'update',
        payload: {
          applySortedMultiAccounts: accounts.map((item) => item.accountType),
        },
      });
    }
  }, [accounts, dispatchTransfer]);

  // 组件卸载时，把accountsAvaliable置为false, multiAccountDeducted置为空数组
  useEffect(() => {
    return () => {
      dispatchTransfer({
        type: 'update',
        payload: {
          multiAccountExpanded: false,
          applySortedMultiAccounts: [],
        },
      });
    };
  }, [dispatchTransfer]);

  const { t: _t } = useTranslation('transfer');

  const handleDrop = (dragIndex, hoverIndex) => {
    const _accounts = [...accounts];
    const [draggedItem] = _accounts.splice(dragIndex, 1); // 从 dragIndex 删除 1 个元素
    _accounts.splice(hoverIndex, 0, draggedItem);
    setAccounts(_accounts);
  };

  const hasAlerted = useMemo(() => storage.getItem(MULTI_ALERT_OPENED) === '1', []);

  return (
    <StyledSeqDeduction>
      {!hasAlerted && <Alert />}
      <ExpandTitleWrapper>
        <div onClick={handleToggle} className="expand-title">
          <span>
            <Trans i18nKey="kc_transferpro_sort" ns="transfer" />
            {!multiAccountExpanded && `(${accounts.length || 0})`}
          </span>
          <ArrowIcon size="20" color={theme.colors.icon} className="icon" />
        </div>
        <div className="tip">
          <ICWarningOutlined size="14" color={theme.colors.icon40} />
          {_t('kc_transfer_pro_support_tip')}
        </div>
      </ExpandTitleWrapper>
      {multiAccountExpanded && (
        <DndProvider>
          <Accounts>
            {map(accounts, ({ accountType }, index) => (
              <Account
                accountType={accountType}
                key={accountType}
                accounts={accounts}
                info={accountsMap[accountType]}
                onDrop={handleDrop}
                index={index}
              />
            ))}
          </Accounts>
        </DndProvider>
      )}
    </StyledSeqDeduction>
  );
}

export default function() {
  const payAccountType = useFormField('payAccountType');
  if (payAccountType !== 'MULTI') {
    return null;
  }
  return <SeqDeduction />;
}

/**
 * Owner: solar@kupotech.com
 */
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme, Alert } from '@kux/mui';
import { ICInfoFilled, ICWarningOutlined } from '@kux/icons';
import { useFormField } from '@transfer/hooks/fields';
import { useTransferDispatch, useTransferSelector } from '@transfer/utils/redux';
import addLangToPath from 'tools/addLangToPath';
import storage from 'tools/storage';
import { useGetConfigByAccount } from '../../hooks/accounts';
import { StyledTip, StyledSavingsAlert } from './style';

// 自动还币
function MarginTip() {
  const { t: _t } = useTranslation('transfer');
  const theme = useTheme();
  const dispatchTransfer = useTransferDispatch();
  const isAutoRepay = useTransferSelector((state) => state.isAutoRepay);
  const isLiability = useTransferSelector((state) => state.isLiability);
  const recAccountType = useFormField('recAccountType');
  const recTag = useFormField('recTag');
  useEffect(() => {
    if (recAccountType === 'MARGIN') {
      dispatchTransfer({
        type: 'queryUserMarginPosition',
      });
    } else if (recAccountType === 'ISOLATED') {
      dispatchTransfer({
        type: 'queryIsolatedPosition',
        payload: {
          tag: recTag,
        },
      });
    }
  }, [recAccountType, recTag]);

  // 穿仓
  if (isLiability) {
    return (
      <StyledTip>
        <ICInfoFilled size={24} color={theme.colors.secondary} />
        <span>
          <Trans i18nKey="marginAccount.liability.label" ns="transfer" />
        </span>
        {recAccountType === 'MARGIN' && <span>{_t('transfer.negativeBalance.cross')}</span>}
        {recAccountType === 'ISOLATED' && (
          <span>
            {_t('transfer.negativeBalance.isolated', {
              symbol: recTag,
            })}
          </span>
        )}
      </StyledTip>
    );
  }
  // 自动还币
  if (isAutoRepay) {
    return (
      <StyledTip>
        <span>{_t('kumex.transfer.warn')}</span>
        {recAccountType === 'MARGIN' && <span>{_t('transfer.cross.autoRepay.enabled')}</span>}
        {recAccountType === 'ISOLATED' && (
          <span>
            {_t('transfer.isolated.autoRepay.enabled', {
              symbol: recTag,
            })}
          </span>
        )}
      </StyledTip>
    );
  }
  return null;
}

function SavingsTip() {
  const { t: _t } = useTranslation('transfer');
  const theme = useTheme();
  return (
    <StyledSavingsAlert
      showIcon
      icon={<ICWarningOutlined size={14} color={theme.colors.primary} />}
      type="success"
      title={_t('kc_transferpro_earn_tip')}
    />
  );
}

function NotOpenTip() {
  const notAllowedAccounts = useTransferSelector((state) => state.notAllowedAccounts);
  const { t: _t } = useTranslation('transfer');
  const getConfigByAccount = useGetConfigByAccount();
  const accountName = notAllowedAccounts
    .map((account) => {
      const key = getConfigByAccount(account)?.i18nKey;
      return key ? _t(key) : '';
    })
    .join(',');

  const title = (
    <Trans i18nKey="universalTransfer.notOpen.tip" ns="transfer" values={{ accountName }} />
  );
  return <Alert showIcon type="error" title={title} />;
}

export default function Tips() {
  const { t: _t } = useTranslation('transfer');
  const payAccountType = useFormField('payAccountType');
  const recAccountType = useFormField('recAccountType');
  const notAllowedAccounts = useTransferSelector((state) => state.notAllowedAccounts);

  // 未开通提示
  if (notAllowedAccounts?.length) {
    return <NotOpenTip />;
  }

  // 合约相关提示
  if (payAccountType === 'MAIN' && recAccountType === 'CONTRACT') {
    return <StyledTip>{_t('kumex.transfer.warn')}</StyledTip>;
  }
  if (payAccountType === 'CONTRACT' && recAccountType === 'MAIN') {
    return (
      <StyledTip>
        <Trans
          i18nKey="tansfer_from_kumex_tip"
          ns="transfer"
          values={{
            href: addLangToPath(
              '/assets/record?category=transfer',
              storage.getItem('kucoinv2_lang'),
            ),
            classname: 'link',
          }}
          components={{
            a: (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label
              <a
                href={addLangToPath(
                  '/assets/record?category=transfer',
                  storage.getItem('kucoinv2_lang'),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              />
            ),
          }}
        />
      </StyledTip>
    );
  }

  // 杠杆相关提示
  if (['MARGIN', 'ISOLATED'].includes(recAccountType)) {
    return <MarginTip />;
  }
  // 金融账户提示
  if ([payAccountType, recAccountType].includes('SAVINGS')) {
    return <SavingsTip />;
  }

  return null;
}

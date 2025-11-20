/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { ICTriangleBottomOutlined } from '@kux/icons';
import { Button, numberFormat, styled } from '@kux/mui';
import SelectDropdown from 'components/Account/Overview/SelectDropdown';
import CoinCurrency from 'components/common/CoinCurrency';
import { tenantConfig } from 'config/tenant';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const BalanceWrapper = styled.div`
  margin-bottom: 40px;
  border: 1px solid ${(props) => props.theme.colors.cover8};
  border-radius: 20px;
  padding: 24px 32px 20px;
  background-color: ${({ theme }) => theme.colors.cover2};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 32px;
    padding: 24px 20px;
  }
`;

const BalanceTop = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
  }
`;
const BalanceTitle = styled.h2`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  margin-bottom: 0;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    font-size: 18px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const BalanceLink = styled.a`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const BalanceLinkDivider = styled.span`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.cover16};
  margin: 0 12px;
`;
const BalanceBottom = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 10px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: unset;
  }
`;
const BalanceAmount = styled.div`
  flex: 1 0 auto;
  max-width: 100%;
`;
const TotalAmount = styled.span`
  font-weight: 700;
  font-size: 32px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-all;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    font-size: 28px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const AmountUnit = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 8px;
  margin-left: 4px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    font-size: 28px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const AmountTypeIconBox = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.cover4};
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  top: 2px;
`;
const AmountTypeIcon = styled(ICTriangleBottomOutlined)`
  color: ${({ theme }) => theme.colors.icon};
  font-size: 12px;
`;
const TotalCurrencyAmount = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text30};
  margin-top: 4px;
  flex: 1;
  flex-shrink: 0;
  min-width: auto;
  /* 修复loading闪烁 */
  white-space: nowrap;
  position: relative;
  top: 2px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 2px;
    min-width: unset;
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  height: 47px;
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  button + button {
    margin-left: 12px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    button {
      height: 28px;
      margin-top: 16px;
      font-size: 12px;
    }
    button + button {
      margin-left: 8px;
    }
  }
`;

const ExtendSelectDropdown = styled(SelectDropdown)`
  margin-top: 4px;
`;

const OverviewBalance = () => {
  const assetOverview = useSelector((s) => s.accountOverview.assetOverview) || {};
  const balanceCurrency = useSelector((s) => s.accountOverview.balanceCurrency);
  const hideBalanceAmount = useSelector((s) => s.accountOverview.hideBalanceAmount);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const { isSub = false } = useSelector((state) => state.user.user) || {};

  useEffect(() => {
    dispatch({ type: 'accountOverview/getAssetOverview', payload: { balanceCurrency } });
  }, [balanceCurrency]);

  const { multiSiteConfig } = useMultiSiteConfig();
  if (!multiSiteConfig) {
    return null;
  }
  const { overviewConfig } = multiSiteConfig?.myConfig || {};

  return (
    <BalanceWrapper data-inspector="account_overview_balance">
      <BalanceTop>
        <BalanceTitle>{_t('2VktdRQ356HhgBwFbm9VQ7')}</BalanceTitle>
        {overviewConfig?.assetFuncs?.includes('assetoverview') && (
          <BalanceLink
            href={addLangToPath('/assets')}
            target="_blank"
            onClick={() => trackClick(['Assets', 'Assets'])}
          >
            {_t('aGFRftGWY4YRqDWSrHYcZ4')}
          </BalanceLink>
        )}

        {overviewConfig?.assetFuncs?.includes('assetoverview') &&
          overviewConfig?.assetFuncs?.includes('entrustedinquiry') && <BalanceLinkDivider />}

        {overviewConfig?.assetFuncs?.includes('entrustedinquiry') && (
          <BalanceLink
            href={addLangToPath('/order/trade')}
            target="_blank"
            onClick={() => trackClick(['Assets', 'Orders'])}
          >
            {_t('1ovVaxkeJZ7XAWK3cgLeTe')}
          </BalanceLink>
        )}
      </BalanceTop>
      <BalanceBottom>
        <BalanceAmount>
          <TotalAmount>
            {loading.effects['accountOverview/getAssetOverview']
              ? _t('1h77gr2PGrfDN8MuVULpxh')
              : typeof assetOverview.totalAssets === 'undefined'
              ? '--'
              : hideBalanceAmount
              ? '**'
              : numberFormat({
                  number: assetOverview.totalAssets,
                  lang: currentLang,
                })}{' '}
          </TotalAmount>
          <AmountUnit>
            {loading.effects['accountOverview/getAssetOverview'] ? null : balanceCurrency}
          </AmountUnit>
          <ExtendSelectDropdown
            options={tenantConfig.account.balanceOptions()}
            activeValue={balanceCurrency}
            placement="bottom"
            onChange={(val) =>
              dispatch({ type: 'accountOverview/update', payload: { balanceCurrency: val } })
            }
          >
            <AmountTypeIconBox>
              <AmountTypeIcon />
            </AmountTypeIconBox>
          </ExtendSelectDropdown>
          <TotalCurrencyAmount>
            {loading.effects['accountOverview/getAssetOverview'] ? (
              ''
            ) : hideBalanceAmount ? (
              '≈ **'
            ) : (
              <CoinCurrency
                coin={balanceCurrency}
                value={assetOverview.totalAssets}
                useLegalChars
                hideLegalCurrency
              />
            )}
          </TotalCurrencyAmount>
        </BalanceAmount>
        {isSub ? null : (
          <ButtonGroup>
            <>
              {overviewConfig?.assetFuncs?.includes('depositcoins') && (
                <Button
                  size="small"
                  onClick={() => {
                    trackClick(['Assets', 'Deposit']);
                    window.open(`/assets/coin/${window._BASE_CURRENCY_}`);
                  }}
                  data-inspector="account_overview_balance_deposit"
                >
                  {_t('iXYh1zbAxb851gxyF5Sb3h')}
                </Button>
              )}
              {overviewConfig?.assetFuncs?.includes('buycoins') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    trackClick(['Assets', 'Buy']);
                    window.open('/express?currency=USD');
                  }}
                  data-inspector="account_overview_balance_buy"
                >
                  {_t('fyMvhfJFXBK5bJBAY74GQL')}
                </Button>
              )}
              {overviewConfig?.assetFuncs?.includes('withdrawalcoins') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    trackClick(['Assets', 'Withdraw']);
                    window.open(`/assets/withdraw/${window._BASE_CURRENCY_}?isDefault=true`);
                  }}
                  data-inspector="account_overview_balance_withdraw"
                >
                  {_t('6eGNqoPgiKUDSPVEqgDP4p')}
                </Button>
              )}
            </>
          </ButtonGroup>
        )}
      </BalanceBottom>
    </BalanceWrapper>
  );
};

export default OverviewBalance;

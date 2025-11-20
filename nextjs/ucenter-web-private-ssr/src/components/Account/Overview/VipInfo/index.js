/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { ICArrowUpOutlined } from '@kux/icons';
import { LineProgress, numberFormat, Select, styled, Switch } from '@kux/mui';
import { divide, floadToPercent, multiply, numberFixed, sub } from 'helper';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VIP_CONFIG, VIP_LEVEL_DATA } from 'components/VipEquity/config';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { bootConfig } from 'kc-next/boot';

const VipInfoWrapper = styled.div`
  padding: 24px 32px 28px;
  background-color: ${({ theme }) => theme.colors.overlay};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  margin-bottom: 28px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    padding: 24px 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 20px 24px;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const VipLogo = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 8px;
  margin-left: -6px;
`;
const VipLevel = styled.span`
  flex: 1;
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
`;
const ViewMore = styled.a`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
`;
const KCSPay = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 20px;

  > span {
    margin-left: 8px;
  }
`;
const FeeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 5px;
`;
const FeeItem = styled.div``;
const FeeTitle = styled.a`
  font-weight: 400;
  font-size: 12px;
  font-family: Kufox Sans;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
  margin-bottom: 4px;
  display: block;
`;
const FeeValue = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 130%;
  font-family: Kufox Sans;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  .fee-value-line {
    width: 1px;
    height: 12px;
    margin: 0 8px;
    background-color: ${({ theme }) => theme.colors.text20};
  }
`;

const ExtendLineProgress = styled(LineProgress)`
  background-color: ${({ theme }) => theme.colors.cover4};
  height: 6px;
  border-radius: 3px;
  margin-bottom: 6px;

  & > div {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProgressDesc = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
  display: flex;
  align-items: flex-start;

  & > span:nth-of-type(2) {
    flex: 1;
    margin-right: 16px;
    margin-left: 19px;
  }
`;

const MaxLevelDesc = styled.div`
  margin-top: 12px;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text30};
`;

const ExtendSelect = styled(Select)`
  .KuxSelect-wrapper .KuxSelect-itemLabel {
    color: ${({ theme, focus }) => (focus ? theme.colors.text : theme.colors.text40)};
  }

  .KuxSelect-wrapper .KuxSelect-dropdownIcon {
    color: ${({ theme, focus }) => (focus ? 'inherit' : theme.colors.icon60)};
  }
`;

const EmptyBlank = styled.span`
  color: ${(props) => props.theme.colors.text40};
`;

const resolveFee = (num, isDiscount, discountRate = 80) => {
  if (num === undefined || num === null) return '--';
  if (+num > 0) {
    return floadToPercent(isDiscount ? multiply(num, divide(discountRate || 100, 100)) : num);
  }
  return floadToPercent(num);
};

const vipLevelOptions = [
  { label: () => _t('jJxMcRU3QgiCU9FT1qWnb6'), value: 'kcs', unit: 'KCS' },
  // { label: () => _t('9DoMxXMj6Cqi7gk5H4SKYV'), value: 'balance' },
  { label: () => _t('f9SnoCgfwpq4EcZ1Dg6hFH'), value: 'spot', unit: bootConfig._BASE_CURRENCY_ },
  { label: () => _t('8icM8tbdGqeCT5DUNmp4aM'), value: 'futures', unit: bootConfig._BASE_CURRENCY_ },
];

const OverviewVipInfo = () => {
  const [type, setType] = useState('kcs');
  const [selectFocus, setSelectFocus] = useState(false);
  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const vipInfo = useSelector((s) => s.accountOverview.vipInfo);
  const userKcsDiscountStatus = useSelector((s) => s.accountOverview.userKcsDiscountStatus);
  const feeDiscountConfig = useSelector((s) => s.accountOverview.feeDiscountConfig);
  const feeDiscountEnable = useSelector((s) => s.accountOverview.feeDiscountEnable);
  const hideBalanceAmount = useSelector((s) => s.accountOverview.hideBalanceAmount);
  const futureFee = useSelector((s) => s.accountOverview.futureFee);
  const { isSub = false } = useSelector((state) => state.user.user) || {};
  const loading = useSelector((state) => state.loading);
  const vipLevel = vipInfo?.userLevel || 0;

  useEffect(() => {
    dispatch({ type: 'accountOverview/getUserVipInfo' });
    dispatch({ type: 'accountOverview/getUserKcsDiscount' });
    dispatch({ type: 'accountOverview/getFeeDeductionConfig' });
    dispatch({ type: 'accountOverview/getRealFutureFee' });
  }, []);

  useEffect(() => {
    if (vipLevel >= 12) return;
    const nextLevelConfig = VIP_LEVEL_DATA[vipLevel + 1];
    const kcsTypePercent = vipInfo?.minHoldAmount / nextLevelConfig.minHoldKCS;
    // const balanceTypePercent = null / nextLevelConfig.minBalance;
    const spotTypePercent = vipInfo?.tradeAmountUsdt / nextLevelConfig.minSpot;
    const futuresTypePercent = vipInfo?.contractTradeAmountUsdt / nextLevelConfig.minFutures;
    const maxPercent = Math.max(
      kcsTypePercent,
      // balanceTypePercent,
      spotTypePercent,
      futuresTypePercent,
    );
    // if (balanceTypePercent === maxPercent) setType('balance');
    if (spotTypePercent === maxPercent) setType('spot');
    if (futuresTypePercent === maxPercent) setType('futures');
    if (kcsTypePercent === maxPercent) setType('kcs');
  }, [vipInfo, vipLevel]);

  const nextLevelInfo = useMemo(() => {
    if (vipLevel === 12) return {};
    const nextLevelConfig = VIP_LEVEL_DATA[vipLevel + 1];
    let nextLevelAmount = nextLevelConfig.minHoldKCS;
    let currentAmount = vipInfo?.minHoldAmount;
    let decimal = 2;
    if (type === 'futures') {
      nextLevelAmount = nextLevelConfig.minFutures;
      currentAmount = vipInfo?.contractTradeAmountUsdt;
      decimal = 4;
    } else if (type === 'spot') {
      nextLevelAmount = nextLevelConfig.minSpot;
      currentAmount = vipInfo?.tradeAmountUsdt;
      decimal = 4;
    } else if (type === 'balance') {
      nextLevelAmount = nextLevelConfig.minBalance;
      currentAmount = vipInfo?.totalBalanceUsdt;
      decimal = 2;
    }
    return {
      amount: numberFormat({
        number: numberFixed(sub(nextLevelAmount, currentAmount || 0), decimal),
        lang: currentLang,
        options: { maximumFractionDigits: decimal },
      }),
      percent: (currentAmount * 100) / nextLevelAmount,
    };
  }, [vipLevel, vipInfo, type, currentLang]);

  return (
    <VipInfoWrapper data-inspector="account_overview_vip_info">
      <Title>
        {hideBalanceAmount ? (
          <VipLevel>**</VipLevel>
        ) : (
          <>
            <VipLogo src={VIP_CONFIG[vipLevel].imgsrc} />
            <VipLevel>VIP Lv. {vipLevel}</VipLevel>
          </>
        )}
        <ViewMore
          href={addLangToPath('/vip/privilege')}
          target="_blank"
          onClick={() => trackClick(['VIP', 'ViewVIP'])}
        >
          {_t('rq8BQYkh9biGAp5C9rqFBQ')}
        </ViewMore>
      </Title>
      {isSub ? null : (
        <KCSPay>
          <Switch
            size="small"
            checked={userKcsDiscountStatus}
            onChange={(checked) => {
              if (!loading.effects['accountOverview/updateUserKcsDiscount']) {
                trackClick(['VIP', 'KCSFees']);
                dispatch({
                  type: 'accountOverview/updateUserKcsDiscount',
                  payload: { enabled: checked },
                });
              }
            }}
          />
          <span style={{ fontSize: 12 }}>{_t('qcvGnwoRg3wHQw61SwW8vX')}</span>
        </KCSPay>
      )}
      <FeeBox>
        <FeeItem>
          <FeeTitle href={addLangToPath('/vip/level')} target="_blank">
            {_t('msc8MY5vwX6EBhyiZRKj8T')}
          </FeeTitle>
          <FeeValue>
            <span>
              {hideBalanceAmount
                ? '**'
                : resolveFee(
                  vipInfo?.makerFeeRate,
                  userKcsDiscountStatus,
                  feeDiscountEnable?.makerEnable ? feeDiscountConfig?.discountRate : 100,
                )}
            </span>
            <span className="fee-value-line" />
            <span>
              {hideBalanceAmount
                ? '**'
                : resolveFee(
                  vipInfo?.takerFeeRate,
                  userKcsDiscountStatus,
                  feeDiscountEnable?.takerEnable ? feeDiscountConfig?.discountRate : 100,
                )}
            </span>
          </FeeValue>
        </FeeItem>
        <FeeItem>
          <FeeTitle href={addLangToPath('/vip/level')} target="_blank">
            <>{_t('7TvsdwYojpf8ncYnV9h45N')}</>
          </FeeTitle>
          {futureFee?.makerFeeRate || futureFee?.takerFeeRate ? (
            <FeeValue>
              <span>{hideBalanceAmount ? '**' : floadToPercent(futureFee?.makerFeeRate)}</span>
              <span className="fee-value-line" />
              <span>{hideBalanceAmount ? '**' : floadToPercent(futureFee?.takerFeeRate)}</span>
            </FeeValue>
          ) : (
            <EmptyBlank>--</EmptyBlank>
          )}
        </FeeItem>
      </FeeBox>
      {vipLevel === 12 ? (
        <MaxLevelDesc>{_t('t7eECvueC1u6wem2cns6QM')}</MaxLevelDesc>
      ) : (
        <>
          <ExtendSelect
            size="small"
            noStyle
            dropdownIcon={<ICArrowUpOutlined />}
            matchWidth={false}
            options={vipLevelOptions}
            value={type}
            onChange={setType}
            onFocus={() => setSelectFocus(true)}
            onBlur={() => setSelectFocus(false)}
            focus={selectFocus}
          />
          <ExtendLineProgress percent={nextLevelInfo.percent} size="basic" showInfo={false} />
          <ProgressDesc>
            <span>{hideBalanceAmount ? '**' : `Lv. ${vipLevel}`}</span>
            {type === 'kcs' ? (
              <span>
                {_t('kzf2r5Bu3C44nWdD3Lrbyg', {
                  amount: hideBalanceAmount
                    ? '**'
                    : nextLevelInfo.amount +
                      ' ' +
                      vipLevelOptions.find((i) => i.value === type)?.unit,
                })}
              </span>
            ) : type === 'balance' ? (
              <span>
                {_t('eQeidBp1vTKoJRtMceEPEV', {
                  amount: hideBalanceAmount ? '**' : nextLevelInfo.amount,
                })}
              </span>
            ) : (
              <span>
                {_t('2Egiv21bLgXwavpbH89Uu3', {
                  amount: hideBalanceAmount
                    ? '**'
                    : nextLevelInfo.amount +
                      ' ' +
                      vipLevelOptions.find((i) => i.value === type)?.unit,
                })}
              </span>
            )}
            <span>{hideBalanceAmount ? '**' : `Lv. ${vipLevel + 1}`}</span>
          </ProgressDesc>
        </>
      )}
    </VipInfoWrapper>
  );
};

export default OverviewVipInfo;

import { isNil } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from '@tools/i18n';
import { kcsensorsManualTrack } from '@utils/sensors';
import { ICArrowRight2Outlined, ICQuestionOutlined } from '@kux/icons';
import { styled, Box, Button, Alert, useEventCallback } from '@kux/mui';
import Dialog from '../../components/common/Dialog';
import CoinIcon from '../../components/common/CoinIcon';
import Tooltip from '../../components/common/Tooltip';
import NumberFormat from '../../components/common/NumberFormat';
import CoinCodeToName from '../../components/common/CoinCodeToName';
import PriceNotice from './PriceNotice';
import ButtonWrapper from './ButtonWrapper';
import { NAMESPACE, ORDER_TYPE_MAP } from '../../config';
import { getInnerUrl } from '../../utils/tools';
import { preloadTaxInfoCollectDialog } from '../TaxInfoCollectDialog';
import StakingSubmitButton from './StakingSubmitButton';
import { useCurrenciesMap, useFromCurrency, useToCurrency } from '../../hooks/form/useStoreValue';

const ButtonWrapperPro = styled(ButtonWrapper)`
  display: flex;
  margin: 32px 0;
  button {
    flex: 1;
    &:not(:first-of-type) {
      margin-left: 24px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 0;
  }
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const TextRight = styled.div`
  text-align: right;
`;
const Banel = styled(FlexBox)`
  padding: 20px 0px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.cover2};
`;
const CurrencyInfo = styled(FlexBox)`
  flex: 1;
  flex-direction: column;
`;
const CoinName = styled.div`
  font-size: 14px;
  margin-top: 8px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const CoinAmount = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
const ArrowIcon = styled(ICArrowRight2Outlined)`
  color: ${(props) => props.theme.colors.icon60};
`;
const Content = styled.div`
  margin-top: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 24px;
  }
`;
const Row = styled(FlexBox)`
  font-size: 14px;
  font-weight: 400;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text40};
  &:not(:first-of-type) {
    margin-top: 13px;
  }
`;
const TooltipContent = styled.span`
  cursor: help;
  margin-left: 2px;
  display: inline-flex;
`;
const Tag = styled(FlexBox)`
  height: 20px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  border-radius: 4px;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  background: ${(props) => props.theme.colors.primary8};
`;

const Value = styled.div`
  display: inline-flex;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const ConfirmDialog = ({
  onOk,
  open,
  onCancel,
  priceInfo,
  refreshPrice, // 市价才传
  toCurrencySize,
  fromCurrencySize,
  isErrorPrice,
  ...otherProps
}) => {
  const { t: _t } = useTranslation('convert');
  const _priceSymbol = useSelector((state) => state[NAMESPACE].priceSymbol);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const currenciesMap = useCurrenciesMap();

  const confirmLoading = useSelector(
    (state) =>
      state.loading.effects[
        `${NAMESPACE}/${ORDER_TYPE_MAP[state[NAMESPACE].orderType]?.confirmOrderEffectName}`
      ] ||
      state.loading.effects[
        `${NAMESPACE}/${ORDER_TYPE_MAP[state[NAMESPACE].orderType]?.queryPriceEffectName}`
      ] ||
      state.loading.effects[`${NAMESPACE}/getKyc3TradeLimitInfo`],
  );

  const isMarketOrder = Boolean(refreshPrice);
  const showPriceDanger = !isMarketOrder && isErrorPrice;
  const priceSymbol = `${fromCurrency}-${toCurrency}`;
  const inversePriceSymbol = `${toCurrency}-${fromCurrency}`;
  const isBuy = inversePriceSymbol === _priceSymbol;

  useEffect(() => {
    if (open) {
      preloadTaxInfoCollectDialog();
      kcsensorsManualTrack({ spm: ['convertForm', '3'] }, 'expose');
    }
  }, [open, isMarketOrder]);

  const handleCancel = useEventCallback(() => {
    if (onCancel) onCancel(true);
  });

  const renderButtons = () => {
    if (isMarketOrder) {
      return <StakingSubmitButton loading={confirmLoading} open={open} onClick={onOk} />;
    }
    if (showPriceDanger) {
      return (
        <>
          <Button size="large" variant="outlined" onClick={handleCancel}>
            {_t('96oo8Yq5o389Qt4hNRmqty')}
          </Button>
          <Button size="large" loading={confirmLoading} onClick={onOk}>
            {_t('retry')}
          </Button>
        </>
      );
    }
    return (
      <Button fullWidth size="large" loading={confirmLoading} onClick={onOk}>
        {_t('axLG7W3an6vbKkE32hhsTT')}
      </Button>
    );
  };

  return (
    <Dialog
      open={open}
      size="medium"
      footer={null}
      height="auto"
      destroyOnClose
      onCancel={handleCancel}
      title={_t('x3R1euthU18SWxWAFaLyPJ')}
      {...otherProps}
    >
      <Banel>
        <CurrencyInfo>
          <CoinIcon size={28} coin={fromCurrency} icon={currenciesMap[fromCurrency]?.icon} />
          <CoinName>
            <CoinCodeToName coin={fromCurrency} />
          </CoinName>
          <CoinAmount>
            <NumberFormat>{fromCurrencySize}</NumberFormat>
          </CoinAmount>
        </CurrencyInfo>
        <ArrowIcon className="horizontal-flip-in-arabic" />
        <CurrencyInfo>
          <CoinIcon size={28} coin={toCurrency} />
          <CoinName>
            <CoinCodeToName coin={toCurrency} />
          </CoinName>
          <CoinAmount>
            <NumberFormat>{toCurrencySize}</NumberFormat>
          </CoinAmount>
        </CurrencyInfo>
      </Banel>
      <Content>
        <Row>
          <FlexBox>
            {_t('2m1a87XbefEz8qVuMShNmQ')}{' '}
            <Tooltip title={_t('wPRQ2qp2VeKe8nqCzAs6Cr')}>
              <TooltipContent>
                <ICQuestionOutlined size={14} />
              </TooltipContent>
            </Tooltip>
          </FlexBox>
          <Tag>{_t('5UoUji8yQgm9qSDZjADU5i')}</Tag>
        </Row>
        {!isNil(priceInfo?.taxSize) && (
          <Row>
            <FlexBox>
              {_t('a5tsFk78WLBMjP7PL518CL')}{' '}
              <Tooltip
                title={
                  <Trans i18nKey="mX6cUJ4EFJqAsG4XhZiCb6" ns="convert">
                    根據印度 1961 年所得稅法第 194S 條，根據政府關於虛擬數位資產 (VDA)
                    轉讓的指導方針，每筆交易將扣除交易價值 1% 的源頭扣除稅 (TDS)
                    。您可以在提交所得稅申報表 (ITR) 時索取此 TDS。
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={getInnerUrl('/support/30538829815833')}
                    >
                      了解詳情
                    </a>
                  </Trans>
                }
              >
                <TooltipContent>
                  <ICQuestionOutlined size={14} />
                </TooltipContent>
              </Tooltip>
            </FlexBox>
            <Value>
              <NumberFormat>{priceInfo.taxSize}</NumberFormat>{' '}
              <CoinCodeToName coin={priceInfo.taxCurrency} />
            </Value>
          </Row>
        )}
        <Row style={{ alignItems: 'flex-start' }}>
          <FlexBox>
            {isMarketOrder ? _t('qidVjpf13KYd5L8hNg1dHT') : _t('rSxX2biR2g3jnBFAvdZw3v')}
          </FlexBox>
          <TextRight>
            <Value>
              1 <CoinCodeToName coin={fromCurrency} />
              <Box margin="0 4px">≈</Box>
              <NumberFormat>{priceInfo?.[priceSymbol]}</NumberFormat>{' '}
              <CoinCodeToName coin={toCurrency} />
            </Value>
            <br />
            <Value>
              1 <CoinCodeToName coin={toCurrency} />
              <Box margin="0 4px">≈</Box>
              <NumberFormat>{priceInfo?.[inversePriceSymbol]}</NumberFormat>{' '}
              <CoinCodeToName coin={fromCurrency} />
            </Value>
          </TextRight>
        </Row>
      </Content>
      {isMarketOrder && <PriceNotice />}
      {/* 限价时预检异常时显示 */}
      {showPriceDanger && (
        <Alert
          showIcon
          type="warning"
          style={{ marginTop: 16, fontWeight: 400 }}
          title={isBuy ? _t('aTSugS3m11DTyKAseD3jdq') : _t('uoTqfmLbhMfgM6w6dYdDfA')}
        />
      )}
      <ButtonWrapperPro {...(refreshPrice ? { onClick: refreshPrice } : null)}>
        {renderButtons()}
      </ButtonWrapperPro>
    </Dialog>
  );
};

export default React.memo(ConfirmDialog);

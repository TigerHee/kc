/*
 * owner: june.lee@kupotech.com
 */
import React from 'react';
import { useTranslation } from '@tools/i18n';
import { kcsensorsManualTrack } from '@utils/sensors';
import { styled, useTheme, Button, useEventCallback } from '@kux/mui';
import useContextSelector from '../../hooks/common/useContextSelector';
// import CoinPrecision from '../components/common/CoinPrecision';
import CoinCodeToName from '../../components/common/CoinCodeToName';
import NumberFormat from '../../components/common/NumberFormat';
import Dialog from '../../components/common/Dialog';
import { formatNumber } from '../../utils/format';
import { getInnerUrl } from '../../utils/tools';

import failDark from '../../../static/fail-dark.svg';
import failLight from '../../../static/fail-light.svg';
import successDark from '../../../static/success-dark.svg';
import successLight from '../../../static/success-light.svg';
import { useFromCurrency, useToCurrency } from '../../hooks/form/useStoreValue';

const StyledDialog = styled(Dialog)`
  .KuxDialog-content {
    padding: 32px;
  }
  .KuxMDialog-content {
    padding-bottom: 32px;
  }
  .KuxDialog-content,
  .KuxMDialog-content {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;
const WeightText = styled.span`
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
const NoticeText = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.text};
`;
const Amount = styled(WeightText)`
  color: ${(props) => props.theme.colors.primary};
  margin: 4px 0 8px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const Description = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.colors.text60};
`;
const DetailLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  margin-top: 16px;
  color: ${(props) => props.theme.colors.text};
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const getImgSrc = (type, theme) => {
  const srcMap = {
    success: {
      dark: successDark,
      light: successLight,
    },
    fail: {
      dark: failDark,
      light: failLight,
    },
  };
  return srcMap?.[type]?.[theme] || srcMap.success.light;
};

const StakingResultDialog = ({
  onOk,
  type,
  errorMsg,
  onCancel,
  toCurrencySize,
  fromCurrencySize,
  pageType = 'history',
  ...otherProps
}) => {
  const { currentTheme } = useTheme();
  const { t: _t } = useTranslation('convert');
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const currenciesMap = useContextSelector((state) => state.currenciesMap);

  const convertOrderUrl = `/order/trade/convert?type=${pageType}`;
  const { fromCurrencyName = fromCurrency } = currenciesMap?.[fromCurrency] || {};

  const handleOk = useEventCallback(() => {
    if (onCancel) onCancel();
    if (onOk) onOk();
  });

  const handleRetry = useEventCallback(() => {
    kcsensorsManualTrack({ spm: ['convertRetry', !fromCurrencySize ? '1' : '2'] }, 'page_click');
    handleOk();
  });

  return (
    <StyledDialog
      {...otherProps}
      header={null}
      footer={null}
      height="auto"
      destroyOnClose
      showCloseX={false}
      open={Boolean(type)}
    >
      <img width={148} height={148} src={getImgSrc(type, currentTheme)} alt="convert result" />
      {type === 'success' ? (
        <>
          {fromCurrencySize ? (
            <WeightText style={{ margin: '8px 0' }}>{_t('uVWR9GxJdEL9M3FbdnTsnF')}</WeightText>
          ) : (
            <>
              <NoticeText>{_t('vGfazXUnDnk8Sfe2q5NNh5')}</NoticeText>
              <Amount>
                <NumberFormat>{toCurrencySize}</NumberFormat>{' '}
                {/* <CoinPrecision coin={toCurrency} precision={precision} value={toCurrencySize} />{' '} */}
                <CoinCodeToName coin={toCurrency} />
              </Amount>
            </>
          )}
          <Description>
            {fromCurrencySize
              ? _t('ao7g454ewpwZJWYZUs7ZNC', {
                  currency: fromCurrencyName,
                  num: formatNumber(fromCurrencySize, { dp: null }),
                })
              : _t('tx3qjhSEpyPsPhWNACGzgQ')}
          </Description>
          <Button fullWidth size="large" onClick={handleOk} style={{ marginTop: 24 }}>
            {_t('x3R1euthU18SWxWAFaLyPJ')}
          </Button>
          <DetailLink target="_blank" onClick={handleOk} href={getInnerUrl(convertOrderUrl)}>
            {_t('vv4GKsm2oftQ78f8oaMhyX')}
          </DetailLink>
        </>
      ) : (
        <>
          <WeightText style={{ margin: '8px 0' }}>{_t('62jCAUUio4WahfGniW611d')}</WeightText>
          <Description>{errorMsg || _t('vpB6phhdpKppc2Pz2BtRmo')}</Description>
          <Button fullWidth size="large" onClick={handleRetry} style={{ marginTop: 16 }}>
            {_t('retry')}
          </Button>
        </>
      )}
    </StyledDialog>
  );
};

export default React.memo(StakingResultDialog);

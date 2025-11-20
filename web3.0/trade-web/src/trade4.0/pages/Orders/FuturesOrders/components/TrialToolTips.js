/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import Tooltip from '@mui/Tooltip';
import { _t, _tHTML } from 'utils/lang';
import { formatNumber } from '@/utils/futures';
import { intlFormatDate } from '@/hooks/common/useIntlFormat';
import { fx, styled } from '@/style/emotion';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
import { getTrialFundDetail } from '@/hooks/futures/useFuturesTrialFund';

const TrialText = styled.span`
  ${(props) => fx.color(props, 'complementary')}
  ${(props) => fx.backgroundColor(props, 'complementary8')}
  padding: 0 4px;
  border-radius: 4px;
  word-break: normal;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
`;
const OverlayWrapper = styled.div`
  font-size: 12px;
  font-style: normal;
  .value {
    ${(props) => fx.color(props, 'primary')}
  }
`;

const Overlay = () => {
  const detail = getTrialFundDetail() || {};
  const { validPeriod, faceValue, currency, withDrawHelpText } = detail;
  const { shortPrecision: precision } = getCurrenciesPrecision(currency);
  const value = formatNumber(faceValue, {
    pointed: true,
    dropZ: false,
    fixed: precision,
  });
  const ruleText = ` ${withDrawHelpText}`;
  const time = validPeriod ? intlFormatDate({ date: validPeriod }) : '-';
  return (
    <OverlayWrapper>
      <span>
        {_tHTML('trailFund.tooltips.desc', {
          amount: value || '-',
          currency: currency || '-',
          time,
        })}
      </span>
      <span>{ruleText}</span>
    </OverlayWrapper>
  );
};

const TrialToolTips = ({ isShow = true }) => {
  const handleClose = React.useCallback(() => {
    // trackClick(TRIAL_FUND_WITHDRAW);
  }, []);

  if (isShow) {
    return (
      <Tooltip placement="top" interactive title={<Overlay />} arrow onClose={handleClose}>
        <TrialText className="trial-fund">{_t('homepage.head.trial')}</TrialText>
      </Tooltip>
    );
  } else {
    return <TrialText className="trial-fund">{_t('homepage.head.trial')}</TrialText>;
  }
};

export default TrialToolTips;

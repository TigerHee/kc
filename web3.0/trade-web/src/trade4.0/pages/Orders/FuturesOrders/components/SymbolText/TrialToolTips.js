/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';
import Tooltip from '@mui/Tooltip';
import { _t, _tHTML } from 'utils/lang';
// import { trackClick } from 'utils/sensors';
// import { TRIAL_FUND_WITHDRAW } from 'sensorsKey/trialFund';
import { formatNumber } from '@/utils/format';
import { intlFormatDate } from '@/hooks/common/useIntlFormat';
import { styled } from '@/style/emotion';
import { getTrialFundDetail } from '@/hooks/futures/useFuturesTrialFund';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
import { ReactComponent as TrialFundIcon } from '@/assets/futures/trialFund.svg';

const TrialText = styled.span`
  color: ${(props) => props.theme.colors.complementary};
  background-color: ${(props) => props.theme.colors.complementary8};
  padding: 0 4px;
  border-radius: 4px;
  margin-right: 4px;
  white-space: nowrap;
`;
const OverlayWrapper = styled.div`
  font-size: 14px;
  font-style: normal;
  .value {
    color: ${(props) => props.theme.colors.primary};
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
  // const time = validPeriod
  //   ? moment(validPeriod)
  //       .utcOffset(8)
  //       .format('YYYY/MM/DD HH:mm')
  //   : '-';
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

export const TrialFund = memo(({ isShow }) => {
  return (
    <Tooltip
      placement="top"
      interactive
      title={isShow ? <Overlay /> : _t('homepage.head.trial')}
      arrow
    >
      <TrialFundIcon className="trial-fund-icon" />
    </Tooltip>
  );
});

const TrialToolTips = ({ isShow = true, className = '' }) => {
  const handleClose = React.useCallback(() => {
    // trackClick(TRIAL_FUND_WITHDRAW);
  }, []);

  if (isShow) {
    return (
      <Tooltip placement="top" interactive title={<Overlay />} arrow onClose={handleClose}>
        <TrialText className={`trial-fund trial-fund-tip ${className}`}>
          {_t('homepage.head.trial')}
        </TrialText>
      </Tooltip>
    );
  } else {
    return <TrialText className={`trial-fund ${className}`}>{_t('homepage.head.trial')}</TrialText>;
  }
};

export default TrialToolTips;

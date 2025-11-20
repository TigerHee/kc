/*
  * owner: borden@kupotech.com
 */
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { split, debounce } from 'lodash';
import styled from '@emotion/styled';
import { getMarginDataUrl } from '@/meta/link';
import SvgComponent from '@/components/SvgComponent';
import TooltipWrapper from '@/components/TooltipWrapper';
import { getCoinInfo } from '@/hooks/common/useCoin';
import useIsMobile from '@/hooks/common/useIsMobile';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import useRequest from '@/hooks/common/useRequest';
import { _t, _tHTML } from 'src/utils/lang';
import { queryReferRate } from 'src/services/margin';
import { floadToPercent } from '@/utils/format';
import { divideAndFixed } from 'helper';
import StatisticsInfo from './StatisticsInfo';

/** 样式开始 */
const StyledTooltipWrapper = styled(TooltipWrapper)`
  cursor: pointer;
`;
const LabelTooltipWrapper = styled(TooltipWrapper)`
  cursor: help;
  font-size: 12px;
  color: ${props => props.theme.colors.text40};
  ${props => (props.isFold ? 'display: block;' : '')}
  ${props => props.theme.breakpoints.down('sm')} {
    font-size: 10px;
  }
`;
const Container = styled.div`
  display: flex;
  ${props => props.theme.breakpoints.up('sm')} {
    margin-left: 24px;
  }
  ${props => props.theme.breakpoints.down('sm')} {
    margin-top: 12px;
  }
`;
const Divider = styled.span`
  margin: 0 2px;
  color: ${props => props.theme.colors.text30};
`;
const RightBox = styled.div`
  margin-left: 8px;
  ${props => (props.isFold ? `
    min-width: 70px;
    text-align: right;
    margin-left: 16px;
    color: ${props.theme.colors.text};
  ` : `
    display: flex;
    align-items: center;
  `)}
`;
const FoldLabel = styled.div`
  display: flex;
  align-items: center;
`;
const LabelText = styled.div`
  line-height: 130%;
  width: fit-content;
  border-bottom: 1px dashed ${props => props.theme.colors.text40};
`;
/** 样式结束 */

const PLACEHOLDER = '--';
// 年利率转小时利率，保留小数点后8位 (a / 365 / 24)
const year2Hourly = (y) => {
  let result;
  try {
    result = floadToPercent(divideAndFixed(y, 365 * 24, 8), { isPositive: false });
  } catch (e) {
    result = PLACEHOLDER;
  }
  return result;
};

const ReferRate = React.memo(({ isFold, ...restProps }) => {
  const isMobile = useIsMobile();
  const currentSymbol = useGetCurrentSymbol();
  const pair = split(currentSymbol, '-');
  const [base, quote] = pair;

  const [currency, setCurrency] = useState(quote);
  const [rateInfo, setRateInfo] = useState(null);

  const { run, cancel, data: res } = useRequest(
    () => queryReferRate({ currency }),
    {
      manual: true,
      pollingWhenHidden: false,
      staleTime: 3 * 60 * 1000, // 3mins
      pollingInterval: 5 * 60 * 1000, // 5mins
      cacheKey: `referRate_${currency}`,
      onError: (_, errorHandler) => {
        setRateInfo(null);
        errorHandler();
      },
    },
  );
  // coin不能传空值，否则会被默认转成base币种
  const { currencyName = PLACEHOLDER } = getCoinInfo({ coin: currency || '-' });

  useEffect(() => {
    if (quote) {
      setCurrency(quote);
    }
  }, [currentSymbol]);

  useEffect(() => {
    if (currency) {
      run();
    }
    return () => {
      if (currency) {
        cancel();
      }
    };
  }, [currency]);

  useEffect(() => {
    const { yearRate } = res?.data || {};
    if (+yearRate >= 0) {
      setRateInfo({
        hourlyInterestRate: year2Hourly(yearRate),
        annualizedInterestRate: floadToPercent(yearRate, { isPositive: false }),
      });
    } else if (+yearRate < 0) {
      // yearRate < 0, 说明币种不支持借贷市场
      setRateInfo(null);
      cancel();
    }
  }, [res]);

  const handleClick = useCallback(debounce(() => {
    setCurrency(pre => (pre === base ? quote : base));
  }, 300), [base, quote]);

  if (!isMobile && isFold) {
    return (
      <Container {...restProps}>
        <FoldLabel>
          <LabelTooltipWrapper
            isFold
            title={_tHTML('pewUKqKB6JodSKVffBuwza', {
              a: getMarginDataUrl(),
            })}
          >
            <LabelText>
              {_t('88aUNqLZp7anRexKvDHxFm')}
            </LabelText>
            <LabelText>
              {_t('caNYWG8GbbN7T246HwRqUv', { a: currencyName })}
            </LabelText>
          </LabelTooltipWrapper>
          <StyledTooltipWrapper className="ml-10" placement="bottom" title={_t('a1csFshnXDRtYzjJF11nTR')}>
            <SvgComponent type="ic2_swap" onClick={handleClick} />
          </StyledTooltipWrapper>
        </FoldLabel>
        <RightBox isFold>
          {rateInfo?.hourlyInterestRate || PLACEHOLDER}
          <br />
          {rateInfo?.annualizedInterestRate || PLACEHOLDER}
        </RightBox>
      </Container>
    );
  }

  return (
    <Container {...restProps}>
      <StatisticsInfo
        label={
          <LabelTooltipWrapper
            useUnderline
            title={_tHTML('pewUKqKB6JodSKVffBuwza', {
              a: getMarginDataUrl(),
            })}
          >
            {_t('aD8e7ovRr6tpbDpbPpwCNA', { a: currencyName })}
          </LabelTooltipWrapper>
        }
        value={
          <Fragment>
            {rateInfo?.hourlyInterestRate || PLACEHOLDER}
            <Divider>/</Divider>
            {rateInfo?.annualizedInterestRate || PLACEHOLDER}
          </Fragment>
        }
      />
      <RightBox>
        {isMobile ? (
          <SvgComponent type="ic2_swap" onClick={handleClick} />
        ) : (
          <StyledTooltipWrapper placement="bottom" title={_t('a1csFshnXDRtYzjJF11nTR')}>
            <SvgComponent type="ic2_swap" onClick={handleClick} />
          </StyledTooltipWrapper>
        )}
      </RightBox>
    </Container>
  );
});

export default ReferRate;

/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import { isNil } from 'lodash';
import styled from '@emotion/styled';
import TooltipWrapper from '@/components/TooltipWrapper';
import useIsMobile from '@/hooks/common/useIsMobile';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import useRequest from '@/hooks/common/useRequest';
import { _t, _tHTML } from 'src/utils/lang';
import { queryCurrencyInfo } from 'services/leveragedTokens';
import { floadToPercent } from '@/utils/format';
import StatisticsInfo from './StatisticsInfo';

/** 样式开始 */
const StyledStatisticsInfo = styled(StatisticsInfo)`
  ${props => props.theme.breakpoints.up('sm')} {
    margin-left: 24px;
  }
  ${props => props.theme.breakpoints.down('sm')} {
    margin-top: 12px;
  }
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
const FoldLabel = styled.div`
  display: flex;
  align-items: center;
`;
const LabelText = styled.div`
  line-height: 130%;
  width: fit-content;
  border-bottom: 1px dashed ${props => props.theme.colors.text40};
`;
const ValueText = styled.div`
  font-size: 12px;
  line-height: 130%;
  color: ${props => props.theme.colors.text};
`;
/** 样式结束 */

const PLACEHOLDER = '--';

const ManagementFee = React.memo(({ isFold, ...restProps }) => {
  const isMobile = useIsMobile();
  const currencyCode = useEtfCoin();

  const { data: res } = useRequest(
    () => queryCurrencyInfo({ currencyCode }),
    {
      refreshDeps: [currencyCode],
      cacheKey: `info_${currencyCode}`,
      staleTime: 8 * 60 * 60 * 1000, // 8hours
    },
  );
  const { data } = res || {};

  if (!isMobile && isFold) {
    return (
      <FoldLabel {...restProps}>
        <LabelTooltipWrapper
          isFold
          title={_t('tokenInfo.etf.information.managementFee.tip', {
            time: data?.payManagementFeeTime || '07:45:00(UTC+8)',
          })}
        >
          <LabelText>{_t('tokenInfo.etf.information.managementFee')}</LabelText>
        </LabelTooltipWrapper>
        <ValueText>
          {isNil(data?.dailyManageFee)
            ? PLACEHOLDER
            : floadToPercent(data?.dailyManageFee || 0, { isPositive: false })}
        </ValueText>
      </FoldLabel>
    );
  }

  return (
    <StyledStatisticsInfo
      label={
        <LabelTooltipWrapper
          useUnderline
          title={_t('tokenInfo.etf.information.managementFee.tip', {
            time: data?.payManagementFeeTime || '07:45:00(UTC+8)',
          })}
        >
          {_t('tokenInfo.etf.information.managementFee')}
        </LabelTooltipWrapper>
      }
      value={
        isNil(data?.dailyManageFee)
          ? PLACEHOLDER
          : floadToPercent(data?.dailyManageFee || 0, { isPositive: false })
      }
    />
  );
});

export default ManagementFee;


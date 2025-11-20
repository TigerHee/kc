/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { useState } from 'react';
import useHtmlToReact from 'src/hooks/useHtmlToReact';
import { _t, _tHTML } from 'src/tools/i18n';
import { useFormat } from '../../hooks/useFormat';
import { useLimitTaskConfig } from '../../hooks/useLimitTaskConfig';
import { useCtx } from '../Context';
import EarnCard from './EarnCard';

const Container = styled.div`
  margin-top: 40px;
  padding-bottom: 40px;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 130%;
`;

const Description = styled.div`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 15px;
  font-weight: 400;
  line-height: 150%;

  span span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

const EarnCardWrapper = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: row;
  > .earnCard {
    flex: 1;
  }
`;

export function Earn() {
  const { taskList } = useCtx();
  const { newCommerConfig, vipConfig } = useLimitTaskConfig();
  const { formatNum } = useFormat();
  const [apr, updateApr] = useState(0);
  const { tempTask } = taskList || {};
  const subtitle = tempTask?.financialSubtitle;
  const { eles: subtitleReact } = useHtmlToReact({ html: subtitle || '' });
  const subtitleContent = subtitle ? (
    <span>{subtitleReact}</span>
  ) : (
    _tHTML('sA9Vj5MBpXucKDwHVhHBoB', {
      apr: apr,
      amount: formatNum(2500),
      currency: window._BASE_CURRENCY_,
    })
  );
  if (!taskList) {
    return null;
  }
  return (
    <Container>
      <Title>{_t('1ePNq93SasLMDRk4j43SjX')}</Title>
      <Description>{subtitleContent}</Description>
      <EarnCardWrapper>
        <EarnCard
          title={_t('nkyi8QqBW2onwKFhZkFz6L')}
          showShadow
          subscrpiton={false}
          typeKey="financialNewcomerTaskInfo"
          bizKey="FINANCIAL_NEWCOMER"
          options={newCommerConfig}
          onUpdateApr={updateApr}
        />
        <EarnCard
          title={_t('9JuwzgA77ArLQzVYMmXV8h')}
          showShadow
          subscrpiton={false}
          typeKey="financialVipTaskInfo"
          bizKey="FINANCIAL_VIP"
          options={vipConfig}
        />
      </EarnCardWrapper>
    </Container>
  );
}

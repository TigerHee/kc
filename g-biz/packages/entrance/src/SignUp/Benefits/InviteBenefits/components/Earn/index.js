/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import { useState } from 'react';
import { Trans } from '@tools/i18n';
import { useLang, useHtmlToReact } from '../../../../../hookTool';
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
  flex-direction: ${({ isH5 }) => (isH5 ? 'column' : 'row')};
  > .earnCard {
    flex: 1;
    &:not(:first-of-type) {
      margin-top: ${({ isH5 }) => (isH5 ? '12px' : '0')};
      margin-left: ${({ isH5 }) => (isH5 ? '0' : '12px')};
    }
  }
`;

export function Earn() {
  const { t: _t } = useLang();
  const { taskList } = useCtx();
  const { newCommerConfig, vipConfig } = useLimitTaskConfig();
  const { formatNum } = useFormat();
  const [apr, updateApr] = useState(0);
  const responsive = useResponsive();
  const isH5 = !responsive.sm;

  const { tempTask } = taskList || {};
  const subtitle = tempTask?.financialSubtitle;
  const { eles: subtitleReact } = useHtmlToReact({ html: subtitle || '' });
  const subtitleContent = subtitle ? (
    <span>{subtitleReact}</span>
  ) : (
    <Trans
      i18nKey="sA9Vj5MBpXucKDwHVhHBoB"
      ns="entrance"
      values={{
        apr,
        amount: formatNum(2500),
        currency: window._BASE_CURRENCY_,
      }}
      components={{
        span: <span className="highlight" />,
      }}
    />
  );
  if (!taskList) {
    return null;
  }
  return (
    <Container>
      <Title>{_t('1ePNq93SasLMDRk4j43SjX')}</Title>
      <Description>{subtitleContent}</Description>
      <EarnCardWrapper isH5={isH5}>
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

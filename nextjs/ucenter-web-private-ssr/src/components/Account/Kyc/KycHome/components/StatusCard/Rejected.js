/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import statusDarkIcon from 'static/account/kyc/brandUpgrade/kycStatus/rejected.dark.png';
import statusIcon from 'static/account/kyc/brandUpgrade/kycStatus/rejected.png';
import { Button, Container, Gap, Img, Title } from './components/styled';

const List = styled.ul`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  list-style: auto;
  ${({ isRTL }) => `padding-${isRTL ? 'right' : 'left'}: 1em;`};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default ({ isDark, loading, failReasons = [], onVerify }) => {
  const { isRTL } = useLocale();

  return (
    <Container>
      <Gap distance={8}>
        <Img src={isDark ? statusDarkIcon : statusIcon} />
        <Title>{_t('f2b667e733954800a64e')}</Title>
        <List isRTL={isRTL}>
          {failReasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </List>
      </Gap>
      <Button size="large" fullWidth loading={loading} onClick={onVerify}>
        <span>{_t('48a040550a384000af48')}</span>
      </Button>
    </Container>
  );
};
